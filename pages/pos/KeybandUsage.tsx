import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { keybandRows } from "./posData";

type KeybandUsageProps = {
  isOpen: boolean;
  onClose: () => void;
};

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

function getRowAmount(row: (typeof keybandRows)[number]) {
  return row.items.reduce(
    (sum, item) => sum + Number(item.price.replace(/[^0-9]/g, "")) * item.quantity,
    0,
  );
}

function matchesRow(row: (typeof keybandRows)[number], query: string, queryDigits: string) {
  const textMatched = [row.bandNo, row.reservationNo].some((value) => value.toLowerCase().includes(query));
  const phoneMatched = queryDigits.length > 0 && normalizeDigits(row.phone) === queryDigits;

  return textMatched || phoneMatched;
}

function getUsageHistory(row: (typeof keybandRows)[number]) {
  return [
    { label: "사용 시간", value: row.time },
    { label: "예약 번호", value: row.reservationNo },
    { label: "현재 상태", value: row.status },
    { label: "이용 요약", value: row.detail },
  ];
}

export function KeybandUsage({ isOpen, onClose }: KeybandUsageProps) {
  const [query, setQuery] = useState("");
  const [searchedRowIds, setSearchedRowIds] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();
  const normalizedDigits = normalizeDigits(query);
  const results = useMemo(
    () => keybandRows.filter((row) => searchedRowIds.includes(row.id)),
    [searchedRowIds],
  );

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!normalizedQuery && !normalizedDigits) {
      setHasSearched(false);
      setSearchedRowIds([]);
      return;
    }

    const matchedRowIds = keybandRows
      .filter((row) => matchesRow(row, normalizedQuery, normalizedDigits))
      .map((row) => row.id);

    setHasSearched(true);
    setSearchedRowIds(matchedRowIds);
  };

  const handleReset = () => {
    setQuery("");
    setHasSearched(false);
    setSearchedRowIds([]);
  };

  return (
    <div className="keyband-issue" role="dialog" aria-modal="true" aria-labelledby="keyband-usage-title">
      <div className="keyband-issue__backdrop" onClick={onClose} />
      <section className="keyband-issue__panel keyband-usage">
        <div className="keyband-issue__header">
          <div>
            <strong id="keyband-usage-title">키밴드 사용</strong>
            <span>스캐너 입력값이나 직접 입력한 키밴드 정보로 사용 상태를 조회합니다.</span>
          </div>
          <button type="button" className="keyband-issue__close" onClick={onClose} aria-label="팝업 닫기">
            <X size={18} />
          </button>
        </div>

        <form className="keyband-usage__search" onSubmit={handleSubmit}>
          <label className="keyband-usage__searchField">
            <Search size={18} />
            <input
              type="text"
              value={query}
              placeholder="키밴드 번호, 예약 번호, 전체 휴대폰 번호 입력"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <div className="keyband-usage__actions">
            <button type="submit" className="keyband-issue__primary">
              조회
            </button>
            <button type="button" className="keyband-issue__secondary" onClick={handleReset}>
              초기화
            </button>
          </div>
        </form>

        <div className="keyband-usage__body">
          <div className="keyband-usage__resultBox">
            {hasSearched ? (
              results.length > 0 ? (
                results.map((row) => (
                  <article key={row.id} className="keyband-usage__card">
                    <div className="keyband-usage__cardHead">
                      <div>
                        <strong>{row.bandNo}</strong>
                        <p>{row.name}</p>
                      </div>
                      <span>{getRowAmount(row).toLocaleString()}원</span>
                    </div>

                    <section className="keyband-usage__section">
                      <div className="keyband-usage__sectionHead">
                        <h3>사용 이력</h3>
                      </div>
                      <dl className="keyband-usage__history">
                        {getUsageHistory(row).map((entry) => (
                          <div key={`${row.id}-${entry.label}`}>
                            <dt>{entry.label}</dt>
                            <dd>{entry.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </section>

                    <section className="keyband-usage__section">
                      <div className="keyband-usage__sectionHead">
                        <h3>사용 가능한 티켓</h3>
                        <span>{row.items.length}건</span>
                      </div>
                      <div className="keyband-usage__ticketTable">
                        <div className="keyband-usage__ticketHead">
                          <span>상품명</span>
                          <span>권종</span>
                          <span>이용 시간</span>
                          <span>수량</span>
                          <span>처리</span>
                        </div>
                        <div className="keyband-usage__ticketBody">
                          {row.items.map((item) => (
                            <div key={item.id} className="keyband-usage__ticketRow">
                              <span>{item.productName}</span>
                              <span>{item.ticketName}</span>
                              <span>{item.session}</span>
                              <span>{item.quantity}개</span>
                              <button type="button" className="keyband-usage__ticketAction">
                                사용 처리
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  </article>
                ))
              ) : (
                <div className="keyband-usage__empty">일치하는 키밴드 정보가 없습니다.</div>
              )
            ) : (
              <div className="keyband-usage__empty">조회할 키밴드 정보를 입력한 뒤 조회 버튼을 눌러주세요.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
