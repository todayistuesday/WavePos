import { Check, Search } from "lucide-react";
import { useEffect, useState, type CSSProperties, type FormEvent } from "react";

import { copyElementPng } from "../../utils/copyPng";
import { keybandRows } from "./posData";

const devicePresets = [
  { id: "ios", label: "iOS", sizeLabel: "390 x 844", width: 390, height: 844 },
  { id: "android", label: "Android", sizeLabel: "360 x 800", width: 360, height: 800 },
  { id: "tablet", label: "태블릿", sizeLabel: "768 x 1024", width: 768, height: 1024 },
] as const;

const onlinePostpaidReservationNo = "RS26000021603";

const onlinePostpaidMockRow = {
  id: "kb-26000021603",
  bandNo: "KB-2603",
  reservationNo: onlinePostpaidReservationNo,
  phone: "010-2600-2160",
  name: "온라인 후불",
  time: "16:24",
  amount: "42,000원",
  status: "정산 가능",
  detail: "모바일 후불 정산용 예매",
  items: [
    {
      id: "kb-26000021603-food",
      productName: "스마트 레스토랑",
      session: "12:00 ~ 18:00",
      ticketName: "돈가스",
      price: "18,000원",
      quantity: 1,
    },
    {
      id: "kb-26000021603-admission",
      productName: "테마파크 입장권",
      session: "00:00 ~ 00:00",
      ticketName: "소인 입장권",
      price: "24,000원",
      quantity: 1,
    },
  ],
} as const;

const settlementRows = [...keybandRows, onlinePostpaidMockRow] as const;

type SettlementRow = (typeof settlementRows)[number];
type CopyState = "idle" | "success" | "error";
type PaymentState = "idle" | "success" | "failure";

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

function getPrefilledReservationNoFromHash() {
  const rawHash = window.location.hash.replace(/^#/, "");
  const [, queryString = ""] = rawHash.split("?");
  const params = new URLSearchParams(queryString);
  return params.get("reservationNo")?.trim() ?? "";
}

function getRowAmount(row: SettlementRow) {
  return row.items.reduce(
    (sum, item) => sum + Number(item.price.replace(/[^0-9]/g, "")) * item.quantity,
    0,
  );
}

function matchesRow(row: SettlementRow, query: string, queryDigits: string) {
  const textMatched = [row.bandNo, row.reservationNo].some((value) => value.toLowerCase().includes(query));
  const phoneMatched = queryDigits.length > 0 && normalizeDigits(row.phone) === queryDigits;

  return textMatched || phoneMatched;
}

function getItemDisplayAmount(price: string, quantity: number) {
  return `${(Number(price.replace(/[^0-9]/g, "")) * quantity).toLocaleString()}원`;
}

function getResultContent(paymentState: Exclude<PaymentState, "idle">) {
  if (paymentState === "failure") {
    return {
      icon: "failure" as const,
      title: "결제에 실패했습니다",
      description: "4초 후 모바일 정산 화면으로 돌아갑니다.",
      toneClassName: "is-failure",
    };
  }

  return {
    icon: "success" as const,
    title: "결제가 완료되었습니다",
    description: "4초 후 모바일 정산 화면으로 돌아갑니다.",
    toneClassName: "is-success",
  };
}

export function MobileSettlementPage() {
  const prefilledReservationNo = getPrefilledReservationNoFromHash();
  const [query, setQuery] = useState(prefilledReservationNo);
  const [searchedRowIds, setSearchedRowIds] = useState<string[]>([]);
  const [devicePreset, setDevicePreset] = useState<(typeof devicePresets)[number]["id"]>("ios");
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");

  const normalizedQuery = query.trim().toLowerCase();
  const normalizedDigits = normalizeDigits(query);
  const results = settlementRows.filter((row) => searchedRowIds.includes(row.id));
  const totalAmount = results.reduce((sum, row) => sum + getRowAmount(row), 0);
  const currentPreset = devicePresets.find((preset) => preset.id === devicePreset) ?? devicePresets[0];
  const screenshotLabel =
    copyState === "success" ? "PNG 복사됨" : copyState === "error" ? "복사 실패" : "스크린샷";
  const resultContent = paymentState === "idle" ? null : getResultContent(paymentState);
  const isPrefilledReservation = prefilledReservationNo.length > 0;

  useEffect(() => {
    if (!isPrefilledReservation) {
      return;
    }

    const lockedQuery = prefilledReservationNo;
    const lockedDigits = normalizeDigits(lockedQuery);
    const matchedRowIds = settlementRows
      .filter((row) => matchesRow(row, lockedQuery.toLowerCase(), lockedDigits))
      .map((row) => row.id);

    setQuery(lockedQuery);
    setSearchedRowIds(matchedRowIds);
  }, [isPrefilledReservation, prefilledReservationNo]);

  useEffect(() => {
    if (copyState === "idle") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCopyState("idle");
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [copyState]);

  useEffect(() => {
    if (paymentState === "idle") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setPaymentState("idle");

      if (isPrefilledReservation) {
        const lockedQuery = prefilledReservationNo;
        const lockedDigits = normalizeDigits(lockedQuery);
        const matchedRowIds = settlementRows
          .filter((row) => matchesRow(row, lockedQuery.toLowerCase(), lockedDigits))
          .map((row) => row.id);

        setQuery(lockedQuery);
        setSearchedRowIds(matchedRowIds);
        return;
      }

      setQuery("");
      setSearchedRowIds([]);
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [isPrefilledReservation, paymentState, prefilledReservationNo]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isPrefilledReservation) {
      return;
    }

    if (!normalizedQuery && !normalizedDigits) {
      return;
    }

    const matchedRowIds = settlementRows
      .filter((row) => matchesRow(row, normalizedQuery, normalizedDigits))
      .map((row) => row.id);

    if (matchedRowIds.length === 0) {
      return;
    }

    setSearchedRowIds((current) => [...current, ...matchedRowIds.filter((rowId) => !current.includes(rowId))]);
  };

  const resetSettlement = () => {
    setPaymentState("idle");

    if (isPrefilledReservation) {
      const lockedQuery = prefilledReservationNo;
      const lockedDigits = normalizeDigits(lockedQuery);
      const matchedRowIds = settlementRows
        .filter((row) => matchesRow(row, lockedQuery.toLowerCase(), lockedDigits))
        .map((row) => row.id);

      setQuery(lockedQuery);
      setSearchedRowIds(matchedRowIds);
      return;
    }

    setQuery("");
    setSearchedRowIds([]);
  };

  const handleRemoveRow = (rowId: string) => {
    if (isPrefilledReservation) {
      return;
    }

    setSearchedRowIds((current) => current.filter((currentRowId) => currentRowId !== rowId));
  };

  const handlePay = () => {
    if (results.length === 0) {
      return;
    }

    setPaymentState(totalAmount >= 100000 ? "failure" : "success");
  };

  const handleCopyScreenshot = async () => {
    try {
      await copyElementPng(".mobile-settlement");
      setCopyState("success");
    } catch (error) {
      console.error(error);
      setCopyState("error");
    }
  };

  return (
    <main className="mobile-settlement-page">
      <div className="mobile-settlement-page__controls">
        <div className="mobile-settlement-page__controlRow">
          <div className="mobile-settlement-page__toggle" role="tablist" aria-label="기기 프리셋">
            {devicePresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                role="tab"
                aria-selected={preset.id === devicePreset}
                className={`mobile-settlement-page__toggleButton${preset.id === devicePreset ? " is-active" : ""}`}
                onClick={() => setDevicePreset(preset.id)}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={`mobile-settlement-page__capture${copyState === "success" ? " is-success" : ""}${copyState === "error" ? " is-error" : ""}`}
            onClick={handleCopyScreenshot}
          >
            {screenshotLabel}
          </button>
        </div>
        <span className="mobile-settlement-page__caption">
          {currentPreset.label} 기준 {currentPreset.sizeLabel}
        </span>
      </div>

      <section
        className={`mobile-settlement mobile-settlement--${currentPreset.id}`}
        aria-labelledby="mobile-settlement-title"
        style={
          {
            "--device-width": `${currentPreset.width}px`,
            "--device-height": `${currentPreset.height}px`,
          } as CSSProperties
        }
      >
        <header className="mobile-settlement__header">
          <strong id="mobile-settlement-title">모바일 후불 정산</strong>
        </header>

        <div className={`mobile-settlement__body${resultContent ? " mobile-settlement__body--result" : ""}`}>
          {resultContent ? (
            <>
              <section className={`mobile-settlement__section mobile-settlement__section--result ${resultContent.toneClassName}`}>
                <div className="mobile-settlement__resultContent">
                  <div className={`mobile-settlement__resultIcon ${resultContent.toneClassName}`} aria-hidden="true">
                    {resultContent.icon === "success" ? (
                      <Check size={44} strokeWidth={3.2} />
                    ) : (
                      <span className="mobile-settlement__resultIconGlyph">!</span>
                    )}
                  </div>
                  <strong className="mobile-settlement__resultTitle">{resultContent.title}</strong>
                  <p className={`mobile-settlement__resultDescription ${resultContent.toneClassName}`}>
                    {resultContent.description}
                  </p>
                </div>
              </section>
              <div className="mobile-settlement__resultAction">
                <button type="button" className="mobile-settlement__secondaryButton" onClick={resetSettlement}>
                  추가 정산하기
                </button>
              </div>
            </>
          ) : (
            <>
              <section className="mobile-settlement__section">
                <div className="mobile-settlement__sectionHead">
                  <h2>키밴드 조회</h2>
                </div>

                <form className="mobile-settlement__search" onSubmit={handleSubmit}>
                  <label className="mobile-settlement__searchField">
                    <Search size={18} />
                    <input
                      type="text"
                      value={query}
                      readOnly={isPrefilledReservation}
                      placeholder="키밴드 번호를 입력하세요"
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  </label>
                  <div className="mobile-settlement__searchActions">
                    <button type="submit" className="mobile-settlement__searchButton">
                      조회
                    </button>
                    <button type="button" className="mobile-settlement__resetButton" onClick={resetSettlement}>
                      초기화
                    </button>
                  </div>
                </form>
              </section>

              <section className="mobile-settlement__section mobile-settlement__section--results">
                <div className="mobile-settlement__sectionHead">
                  <h2>조회 내역 리스트</h2>
                  <span>{results.length}건</span>
                </div>

                <div className="mobile-settlement__results">
                  {results.length === 0 ? (
                    <div className="mobile-settlement__empty">조회 결과가 없습니다.</div>
                  ) : (
                    results.map((row) => (
                      <article key={row.id} className="mobile-settlement__card">
                        <div className="mobile-settlement__cardBar">
                          <strong>{row.bandNo}</strong>
                          <button
                            type="button"
                            className="mobile-settlement__remove"
                            onClick={() => handleRemoveRow(row.id)}
                            aria-label={`${row.bandNo} 조회 내역 제거`}
                          >
                            X
                          </button>
                        </div>

                        <div className="mobile-settlement__itemHead" role="row">
                          <span>상품명</span>
                          <span>권종명</span>
                          <span>수량</span>
                          <span>금액</span>
                        </div>

                        <div className="mobile-settlement__items">
                          {row.items.map((item) => (
                            <div key={item.id} className="mobile-settlement__item">
                              <strong>{item.productName}</strong>
                              <span>{item.ticketName}</span>
                              <span>{item.quantity}개</span>
                              <span>{getItemDisplayAmount(item.price, item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>

              <section className="mobile-settlement__payment">
                <div className="mobile-settlement__paymentSummary">
                  <span>결제 예정 금액</span>
                  <strong>{totalAmount.toLocaleString()}원</strong>
                </div>
                <button type="button" className="mobile-settlement__payButton" onClick={handlePay}>
                  결제 하기
                </button>
              </section>
            </>
          )}
        </div>

        <footer className="mobile-settlement__footer">Copyright ⓒ smartix Corporation. All right reserved</footer>
      </section>
    </main>
  );
}
