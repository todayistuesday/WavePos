import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { keybandRows, keybandUsageRows } from "./posData";

type KeybandUsageProps = {
  isOpen: boolean;
  onClose: () => void;
};

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

type UsageRow = {
  id: string;
  bandNo: string;
  reservationNo?: string;
  phone?: string;
  items: ReadonlyArray<{
    id: string;
    productName: string;
    ticketName: string;
    session: string;
    quantity: number;
  }>;
};

const CURRENT_COUNTER_NO = "05";
const ALLOWED_PRODUCT_NAMES_BY_COUNTER: Record<string, readonly string[]> = {
  "05": ["서핑장비", "타월"],
};

function matchesRow(row: UsageRow, query: string, queryDigits: string) {
  const itemMatched = row.items.some((item) =>
    [item.productName, item.ticketName, item.session].some((value) => value.toLowerCase().includes(query)),
  );
  const textMatched =
    [row.bandNo, row.reservationNo ?? ""].some((value) => value.toLowerCase().includes(query)) || itemMatched;
  const phoneMatched =
    queryDigits.length > 0 &&
    [row.bandNo, row.phone ?? ""].some((value) => normalizeDigits(value) === queryDigits);

  return textMatched || phoneMatched;
}

function isUsableProductAtCounter(productName: string, counterNo: string) {
  const allowedProducts = ALLOWED_PRODUCT_NAMES_BY_COUNTER[counterNo];

  if (!allowedProducts) {
    return true;
  }

  return allowedProducts.includes(productName);
}

export function KeybandUsage({ isOpen, onClose }: KeybandUsageProps) {
  const [query, setQuery] = useState("");
  const [searchedRowIds, setSearchedRowIds] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [usedTicketQuantities, setUsedTicketQuantities] = useState<Record<string, number>>({});
  const [selectedUsageQuantities, setSelectedUsageQuantities] = useState<Record<string, number>>({});

  const normalizedQuery = query.trim().toLowerCase();
  const normalizedDigits = normalizeDigits(query);
  const searchableRows = useMemo<UsageRow[]>(
    () => [
      ...keybandRows.map((row) => ({
        id: row.id,
        bandNo: row.bandNo,
        reservationNo: row.reservationNo,
        phone: row.phone,
        items: row.items.map((item) => ({
          id: item.id,
          productName: item.productName,
          ticketName: item.ticketName,
          session: item.session,
          quantity: item.quantity,
        })),
      })),
      ...keybandUsageRows,
    ],
    [],
  );
  const results = useMemo(
    () => searchableRows.filter((row) => searchedRowIds.includes(row.id)),
    [searchableRows, searchedRowIds],
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

    const matchedRowIds = searchableRows
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

  const handleSelectUsageQuantity = (ticketId: string, value: number) => {
    setSelectedUsageQuantities((prev) => ({
      ...prev,
      [ticketId]: value,
    }));
  };

  const handleUseTicket = (ticketId: string, totalQuantity: number, productName: string) => {
    if (!isUsableProductAtCounter(productName, CURRENT_COUNTER_NO)) {
      window.alert("해당 창구에서 사용 처리 불가한 티켓입니다.");
      return;
    }

    const usedQuantity = usedTicketQuantities[ticketId] ?? 0;
    const isFullyUsed = usedQuantity >= totalQuantity;
    const remainingQuantity = totalQuantity - usedQuantity;

    if (isFullyUsed) {
      const shouldRestore = window.confirm("사용 완료된 항목을 복구하시겠습니까?");

      if (!shouldRestore) {
        return;
      }

      setUsedTicketQuantities((prev) => {
        const next = { ...prev };
        delete next[ticketId];
        return next;
      });
      setSelectedUsageQuantities((prev) => {
        const next = { ...prev };
        delete next[ticketId];
        return next;
      });
      return;
    }

    if (remainingQuantity <= 0) {
      return;
    }

    const selectedQuantity = Math.min(selectedUsageQuantities[ticketId] ?? remainingQuantity, remainingQuantity);

    setUsedTicketQuantities((prev) => ({
      ...prev,
      [ticketId]: usedQuantity + selectedQuantity,
    }));
    setSelectedUsageQuantities((prev) => {
      const nextRemainingQuantity = remainingQuantity - selectedQuantity;
      const nextSelectedQuantity =
        nextRemainingQuantity > 0
          ? Math.min(prev[ticketId] ?? nextRemainingQuantity, nextRemainingQuantity)
          : selectedQuantity;

      return {
        ...prev,
        [ticketId]: nextSelectedQuantity,
      };
    });
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
                <>
                  {results.map((row) => (
                    <article key={row.id} className="keyband-usage__card">
                      <div className="keyband-usage__cardHead">
                        <div className="keyband-usage__cardTitle">
                          <strong>{row.bandNo}</strong>
                          <span>사용 가능한 티켓</span>
                        </div>
                      </div>
                      <section className="keyband-usage__section">
                        <div className="keyband-usage__sectionHead">
                          <span>{row.items.length}건</span>
                        </div>
                        <div className="keyband-usage__ticketTable">
                          <div className="keyband-usage__ticketHead">
                            <span className="keyband-usage__col keyband-usage__col--product">상품명</span>
                            <span className="keyband-usage__col keyband-usage__col--ticket">권종</span>
                            <span className="keyband-usage__col keyband-usage__col--session">이용 시간</span>
                            <span className="keyband-usage__col keyband-usage__col--quantity">수량</span>
                            <span className="keyband-usage__col keyband-usage__col--action">처리</span>
                          </div>
                          <div className="keyband-usage__ticketBody">
                            {row.items.map((item) => {
                              const isUsableAtCurrentCounter = isUsableProductAtCounter(
                                item.productName,
                                CURRENT_COUNTER_NO,
                              );
                              const usedQuantity = usedTicketQuantities[item.id] ?? 0;
                              const remainingQuantity = item.quantity - usedQuantity;
                              const isPartiallyUsed = usedQuantity > 0 && usedQuantity < item.quantity;
                              const isFullyUsed = usedQuantity >= item.quantity;
                              const maxSelectableQuantity = isFullyUsed
                                ? selectedUsageQuantities[item.id] ?? item.quantity
                                : Math.max(remainingQuantity, 1);
                              const selectedQuantity = Math.min(
                                selectedUsageQuantities[item.id] ?? maxSelectableQuantity,
                                maxSelectableQuantity,
                              );
                              const actionLabel = isFullyUsed
                                ? "사용 완료"
                                : isPartiallyUsed
                                  ? "부분 사용"
                                  : "사용 처리";

                              const blockedActionLabel = isUsableAtCurrentCounter ? actionLabel : "처리 불가";

                              return (
                                <div key={item.id} className="keyband-usage__ticketRow">
                                  <span className="keyband-usage__col keyband-usage__col--product">{item.productName}</span>
                                  <span className="keyband-usage__col keyband-usage__col--ticket">{item.ticketName}</span>
                                  <span className="keyband-usage__col keyband-usage__col--session">{item.session}</span>
                                  <div className="keyband-usage__col keyband-usage__col--quantity keyband-usage__quantityPicker">
                                    <select
                                      aria-label={`${item.productName} 사용 수량`}
                                      value={selectedQuantity}
                                      onChange={(event) =>
                                        handleSelectUsageQuantity(item.id, Number(event.target.value))
                                      }
                                      disabled={isFullyUsed}
                                    >
                                      {Array.from({ length: maxSelectableQuantity }, (_, index) => {
                                        const option = index + 1;

                                        return (
                                          <option key={`${item.id}-${option}`} value={option}>
                                            {option}개
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                  <div className="keyband-usage__col keyband-usage__col--action keyband-usage__ticketControls">
                                    <div className="keyband-usage__ticketActions">
                                      <button
                                        type="button"
                                        className={`keyband-usage__ticketAction${
                                          !isUsableAtCurrentCounter
                                            ? " keyband-usage__ticketAction--blocked"
                                            : isFullyUsed
                                              ? " keyband-usage__ticketAction--used"
                                              : isPartiallyUsed
                                                ? " keyband-usage__ticketAction--partial"
                                                : ""
                                        }`}
                                        onClick={() => handleUseTicket(item.id, item.quantity, item.productName)}
                                        aria-disabled={!isUsableAtCurrentCounter}
                                        title={
                                          !isUsableAtCurrentCounter
                                            ? "해당 창구에서 사용 처리 불가한 티켓입니다."
                                            : undefined
                                        }
                                      >
                                        {blockedActionLabel}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </section>
                    </article>
                  ))}
                  <p className="keyband-usage__guide">
                    ※ 수량이 2개 이상인 항목은 남은 수량 안에서 필요한 개수만 선택해 사용 처리할 수 있습니다.
                  </p>
                </>
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
