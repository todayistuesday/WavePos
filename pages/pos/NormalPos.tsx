import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { CheckoutPanel, type CheckoutItem } from "../../components/pos/CheckoutPanel";
import {
  generalPaymentMethods,
  packageScheduleConfigs,
  productCategories,
  schedules,
  ticketOptions,
  topTabs,
} from "./posData";

type NormalPosTab = (typeof topTabs)[number];
type PackageScheduleConfig = (typeof packageScheduleConfigs)[keyof typeof packageScheduleConfigs];
type PackageScheduleItem = PackageScheduleConfig["items"][number];

const sameDatePackageTicketOptions = [
  { title: "슈트패키지", price: "9,000원" },
  { title: "보드패키지", price: "18,000원" },
  { title: "선베드 패키지", price: "19,000원" },
  { title: "카바나 패키지", price: "24,000원" },
] as const;

const lessonSuitBoardPackageTicketOptions = [
  { title: "성인 패키지", price: "24,000원" },
  { title: "어린이 패키지", price: "18,000원" },
] as const;

const miocostaLifejacketPackageTicketOptions = [
  { title: "성인 입장 패키지", price: "18,000" },
  { title: "소인 입장 패키지", price: "13,000" },
  { title: "주말 성인 입장 패키지", price: "21,000" },
  { title: "주말 소인 입장 패키지", price: "18,000" },
] as const;

const SURF_DISCOUNT_LABEL = "시흥 시민";
const SURF_DISCOUNT_AMOUNT = 1000;
const DISCOUNT_ENABLED_CATEGORY_IDS = new Set(["surf", "package-same-date"]);

interface RefundSummaryRow {
  date: string;
  paymentNo: string;
  paymentMethod: string;
  issuedAt: string;
  ticketNo: string;
  qty: string;
  paymentAmount: string;
  cardOrCashNo: string;
  approvalNo: string;
  cashReceipt: string;
}

interface RefundDetailRow {
  ticketNo: string;
  status: string;
  date: string;
  time: string;
  product: string;
  session: string;
  ticketType: string;
  inspected: string;
  inspectedAt: string;
  tcmNo: string;
}

const refundSummaryRows: RefundSummaryRow[] = [
  {
    date: "2026-05-29",
    paymentNo: "창구 01",
    paymentMethod: "키밴드",
    issuedAt: "2026-05-29 09:59:06",
    ticketNo: "20260529-01-3",
    qty: "2",
    paymentAmount: "10,000원",
    cardOrCashNo: "0000000",
    approvalNo: "0000000",
    cashReceipt: "Y",
  },
];

const refundDetailRows: RefundDetailRow[] = [
  {
    ticketNo: "20260529-05-2",
    status: "발권 완료",
    date: "2026-05-29",
    time: "09:59:06",
    product: "서핑 장비",
    session: "1세션 (1시간)",
    ticketType: "소프트 보드 1시간",
    inspected: "N",
    inspectedAt: "-",
    tcmNo: "-",
  },
  {
    ticketNo: "20260529-05-1",
    status: "발권 완료",
    date: "2026-05-29",
    time: "09:59:06",
    product: "타월",
    session: "2026-05-21 ~\n2026-12-31",
    ticketType: "비치타월",
    inspected: "N",
    inspectedAt: "-",
    tcmNo: "-",
  },
];

const hiddenProductCategoryIds = new Set(["snorkel", "tube", "cabana", "bed"]);

function normalizeKeybandTag(value: string) {
  return value.trim().toUpperCase();
}

function getPackageColumnCount(itemCount: number) {
  if (itemCount <= 1) {
    return 1;
  }

  if (itemCount === 2) {
    return 2;
  }

  return itemCount % 2 === 0 ? 2 : 3;
}

function GeneralSalesBody() {
  const [selectedCategory, setSelectedCategory] = useState("surf");
  const [selectedSchedule, setSelectedSchedule] = useState("one-hour");
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [taggingBandNo, setTaggingBandNo] = useState("");
  const [taggingError, setTaggingError] = useState("");
  const [isTaggingModalOpen, setIsTaggingModalOpen] = useState(false);
  const [lastTaggedBandNo, setLastTaggedBandNo] = useState("");
  const [packagePresetCount, setPackagePresetCount] = useState<2 | 3 | 4>(3);
  const taggingInputRef = useRef<HTMLInputElement>(null);

  const visibleProductCategories = useMemo(
    () => productCategories.filter((item) => !hiddenProductCategoryIds.has(item.id)),
    [],
  );

  const packageScheduleEntries = useMemo(
    () => Object.entries(packageScheduleConfigs) as Array<[string, PackageScheduleConfig]>,
    [],
  );

  const [packageScheduleSelections, setPackageScheduleSelections] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      packageScheduleEntries.flatMap(([, config]) =>
        config.items.map((item) => [item.id, item.options[0]?.id ?? ""] as const),
      ),
    ),
  );

  const selectedPackageScheduleConfig = useMemo(() => {
    const matchedEntry = packageScheduleEntries.find(([categoryId]) => categoryId === selectedCategory);
    return matchedEntry?.[1] ?? null;
  }, [packageScheduleEntries, selectedCategory]);

  const visiblePackageScheduleItems = useMemo(() => {
    if (!selectedPackageScheduleConfig) {
      return [] as PackageScheduleItem[];
    }

    return selectedPackageScheduleConfig.items.slice(
      0,
      Math.min(packagePresetCount, selectedPackageScheduleConfig.items.length),
    );
  }, [packagePresetCount, selectedPackageScheduleConfig]);

  const packageColumnCount = useMemo(
    () => getPackageColumnCount(visiblePackageScheduleItems.length),
    [visiblePackageScheduleItems.length],
  );

  const selectedPackageScheduleSummary = useMemo(() => {
    if (!selectedPackageScheduleConfig) {
      return null;
    }

    return visiblePackageScheduleItems
      .map((item) => {
        const selectedOptionId = packageScheduleSelections[item.id] ?? item.options[0]?.id ?? "";
        const selectedOption = item.options.find((option) => option.id === selectedOptionId) ?? item.options[0];

        if (!selectedOption) {
          return item.productName;
        }

        return `${item.productName} ${selectedOption.title}`;
      })
      .join(" / ");
  }, [packageScheduleSelections, selectedPackageScheduleConfig, visiblePackageScheduleItems]);

  const selectedPackageDetailLines = useMemo(() => {
    if (!selectedPackageScheduleConfig) {
      return [] as string[];
    }

    return visiblePackageScheduleItems.map((item) => {
      const selectedOptionId = packageScheduleSelections[item.id] ?? item.options[0]?.id ?? "";
      const selectedOption = item.options.find((option) => option.id === selectedOptionId) ?? item.options[0];

      if (!selectedOption) {
        return item.productName;
      }

      const detailValue =
        item.kind === "period"
          ? selectedPackageScheduleConfig.periodValue ?? selectedOption.title
          : selectedOption.title;

      return `${item.productName} · ${detailValue}`;
    });
  }, [packageScheduleSelections, selectedPackageScheduleConfig, visiblePackageScheduleItems]);

  const visibleTicketOptions = useMemo(() => {
    if (selectedCategory === "package-same-date") {
      return sameDatePackageTicketOptions;
    }

    if (selectedCategory === "package-lesson-suit-board") {
      return lessonSuitBoardPackageTicketOptions;
    }

    if (selectedCategory === "package-miocosta-lifejacket") {
      return miocostaLifejacketPackageTicketOptions;
    }

    return ticketOptions;
  }, [selectedCategory]);

  const checkoutTotal = useMemo(
    () =>
      checkoutItems.reduce(
        (sum, item) => sum + Number(item.amount.replace(/[^0-9]/g, "")) * item.quantity,
        0,
      ),
    [checkoutItems],
  );

  const checkoutDiscountTotal = useMemo(
    () => checkoutItems.reduce((sum, item) => sum + (item.discountAmount ?? 0) * item.quantity, 0),
    [checkoutItems],
  );

  const checkoutPayableTotal = useMemo(
    () => Math.max(checkoutTotal - checkoutDiscountTotal, 0),
    [checkoutDiscountTotal, checkoutTotal],
  );

  const checkoutQuantity = useMemo(
    () => checkoutItems.reduce((sum, item) => sum + item.quantity, 0),
    [checkoutItems],
  );

  useEffect(() => {
    if (!isTaggingModalOpen) {
      return;
    }

    taggingInputRef.current?.focus();
  }, [isTaggingModalOpen]);

  const handleAddTicket = (ticket: { title: string; price: string }) => {
    setCheckoutItems((current) => {
      const existingItem = current.find((item) => item.id === ticket.title);
      const hasRegionalDiscount = DISCOUNT_ENABLED_CATEGORY_IDS.has(selectedCategory);

      if (existingItem) {
        return current.map((item) =>
          item.id === ticket.title ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [
        ...current,
        {
          id: ticket.title,
          title: productCategories.find((item) => item.id === selectedCategory)?.label ?? "현장 상품",
          time:
            selectedPackageScheduleConfig
              ? `구성상품 ${selectedPackageDetailLines.length}개 선택`
              : selectedPackageScheduleSummary ??
            schedules.find((schedule) => schedule.id === selectedSchedule)?.title ??
            "현장 선택",
          detail: ticket.title,
          amount: ticket.price,
          quantity: 1,
          discountAmount: hasRegionalDiscount ? SURF_DISCOUNT_AMOUNT : undefined,
          discountLabel: hasRegionalDiscount ? SURF_DISCOUNT_LABEL : undefined,
          packageDetails: selectedPackageScheduleConfig ? selectedPackageDetailLines : undefined,
        },
      ];
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCheckoutItems((current) => current.filter((item) => item.id !== itemId));
  };

  const handleClearItems = () => {
    setCheckoutItems([]);
    setLastTaggedBandNo("");
  };

  const closeTaggingModal = () => {
    setIsTaggingModalOpen(false);
    setTaggingBandNo("");
    setTaggingError("");
  };

  const handlePay = (paymentMethod: string) => {
    if (checkoutItems.length === 0) {
      return;
    }

    if (paymentMethod === "키밴드") {
      setIsTaggingModalOpen(true);
      setTaggingError("");
      return;
    }

    setCheckoutItems([]);
    setLastTaggedBandNo("");
  };

  const handleTaggingSubmit = () => {
    const normalizedBandNo = normalizeKeybandTag(taggingBandNo);

    if (!normalizedBandNo) {
      setTaggingError("키밴드를 태깅해 주세요.");
      return;
    }

    setLastTaggedBandNo(normalizedBandNo);
    setCheckoutItems([]);
    closeTaggingModal();
  };

  const handleTaggingInputChange = (value: string) => {
    setTaggingBandNo(value);

    if (taggingError) {
      setTaggingError("");
    }
  };

  const handlePackageScheduleChange = (itemId: string, optionId: string) => {
    setPackageScheduleSelections((current) => ({
      ...current,
      [itemId]: optionId,
    }));
  };

  return (
    <>
      <main className="pos-main">
        <section className="pos-left">
          <section className="panel panel--products">
            <div className="panel__header">
              <h2>상품 선택</h2>
              <div className="panel__nav">
                <button type="button" aria-label="이전 상품">
                  <ChevronLeft size={30} strokeWidth={2.2} />
                </button>
                <button type="button" aria-label="다음 상품">
                  <ChevronRight size={30} strokeWidth={2.2} />
                </button>
              </div>
            </div>

            <div className="category-grid">
              {visibleProductCategories.map((item) => {
                const isActive = item.id === selectedCategory;

                return (
                  <button
                    key={item.id}
                    className={`category-card${isActive ? " is-active" : ""}`}
                    type="button"
                    onClick={() => setSelectedCategory(item.id)}
                  >
                    <span>{item.label}</span>
                    {isActive ? <span className="category-card__check">✓</span> : null}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="panel panel--schedule">
            <div className="panel__header panel__header--package">
              <div className="panel__title-wrap">
                <h2>스케줄 선택</h2>
                {selectedPackageScheduleConfig ? (
                  <div className="package-presets">
                    {[2, 3, 4].map((count) => {
                      const isActive = packagePresetCount === count;

                      return (
                        <button
                          key={count}
                          type="button"
                          className={`package-presets__button${isActive ? " is-active" : ""}`}
                          onClick={() => setPackagePresetCount(count as 2 | 3 | 4)}
                        >
                          {`상품 ${count}개`}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
              <div className="panel__nav">
                <button type="button" aria-label="이전 스케줄">
                  <ChevronLeft size={30} strokeWidth={2.2} />
                </button>
                <button type="button" aria-label="다음 스케줄">
                  <ChevronRight size={30} strokeWidth={2.2} />
                </button>
              </div>
            </div>

            {selectedPackageScheduleConfig ? (
              <div className="package-schedule-grid" data-columns={packageColumnCount}>
                {visiblePackageScheduleItems.map((item, index) => {
                  const selectedOptionId = packageScheduleSelections[item.id] ?? item.options[0]?.id ?? "";
                  const selectedOption = item.options.find((option) => option.id === selectedOptionId) ?? item.options[0];

                  if (!selectedOption) {
                    return null;
                  }

                  return (
                    <article key={item.id} className="package-schedule-card">
                      <div className="package-schedule-card__top">
                        <div className="package-schedule-card__info">
                          <strong className="package-schedule-card__title">{item.productName}</strong>
                        </div>

                        {item.kind === "schedule" ? (
                          <label className="package-schedule-card__control">
                            <select
                              value={selectedOption.id}
                              onChange={(event) => handlePackageScheduleChange(item.id, event.target.value)}
                            >
                              {item.options.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.title}
                                </option>
                              ))}
                            </select>
                          </label>
                        ) : (
                          <div className="package-schedule-card__period-wrap">
                            <div className="package-schedule-card__period">
                              {selectedPackageScheduleConfig.periodValue ?? "2026-07-01 ~ 2026-12-31"}
                            </div>
                          </div>
                        )}
                      </div>

                      <dl className="package-schedule-card__stats">
                        {selectedOption.rows.map(([label, value]) => (
                          <div key={label}>
                            <dt>{label}</dt>
                            <dd>{label === "정원" && value === "-" ? "∞" : value}</dd>
                          </div>
                        ))}
                      </dl>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="schedule-grid">
                {schedules.map((schedule) => {
                  const isActive = schedule.id === selectedSchedule;

                  return (
                    <button
                      key={schedule.id}
                      className={`schedule-card${isActive ? " is-active" : ""}`}
                      type="button"
                      onClick={() => setSelectedSchedule(schedule.id)}
                    >
                      <div className="schedule-card__head">
                        <strong>{schedule.title}</strong>
                        {isActive ? <span className="schedule-card__check">✓</span> : null}
                      </div>
                      <dl className="schedule-card__stats">
                        {schedule.rows.map(([label, value]) => (
                          <div key={label}>
                            <dt>{label}</dt>
                            <dd>{label === "정원" && value === "-" ? "∞" : value}</dd>
                          </div>
                        ))}
                      </dl>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="panel panel--tickets">
            <div className="panel__header panel__header--inline">
              <h2>권종 선택</h2>
              <span className="panel__copy">매진포함</span>
              <div className="panel__nav">
                <button type="button" aria-label="이전 권종">
                  <ChevronLeft size={30} strokeWidth={2.2} />
                </button>
                <button type="button" aria-label="다음 권종">
                  <ChevronRight size={30} strokeWidth={2.2} />
                </button>
              </div>
            </div>

            {lastTaggedBandNo ? (
              <div className="panel__copy" aria-live="polite">
                {lastTaggedBandNo} 키밴드로 결제가 완료되었습니다.
              </div>
            ) : null}

            <div className="ticket-grid">
              {visibleTicketOptions.map((ticket) => (
                <button
                  key={ticket.title}
                  className="ticket-card"
                  type="button"
                  onClick={() => handleAddTicket(ticket)}
                >
                  <strong>{ticket.title}</strong>
                  <span>{ticket.price}</span>
                </button>
              ))}
            </div>
          </section>
        </section>

        <CheckoutPanel
          checkoutLabel={`총 ${checkoutQuantity}매 ${checkoutPayableTotal.toLocaleString()}원 결제하기`}
          items={checkoutItems}
          locked={false}
          onClear={handleClearItems}
          onRemoveItem={handleRemoveItem}
          paymentMethods={generalPaymentMethods}
          defaultFocusedPaymentMethod="키밴드"
          onPay={handlePay}
        />
      </main>

      {isTaggingModalOpen ? (
        <div className="keyband-issue" role="dialog" aria-modal="true" aria-labelledby="normal-pos-keyband-tag-title">
          <div className="keyband-issue__backdrop" onClick={closeTaggingModal} />
          <section className="keyband-issue__panel">
            <div className="keyband-issue__header">
              <div>
                <strong id="normal-pos-keyband-tag-title">키밴드 태깅</strong>
              </div>
              <button
                type="button"
                className="keyband-issue__close"
                onClick={closeTaggingModal}
                aria-label="팝업 닫기"
              >
                <X size={18} />
              </button>
            </div>

            <div className="keyband-issue__field">
              <input
                ref={taggingInputRef}
                type="text"
                value={taggingBandNo}
                placeholder="예: KB-2001"
                onChange={(event) => handleTaggingInputChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") {
                    return;
                  }

                  event.preventDefault();
                  handleTaggingSubmit();
                }}
              />
            </div>

            <div className="keyband-issue__hint">
              스캐너 입력 후 Enter가 들어오면 현재 선택 내역 전체가 해당 키밴드 결제로 완료됩니다.
            </div>

            {taggingError ? <div className="keyband-issue__error">{taggingError}</div> : null}

            <div className="keyband-issue__actions">
              <button type="button" className="keyband-issue__secondary" onClick={closeTaggingModal}>
                취소
              </button>
              <button type="button" className="keyband-issue__primary" onClick={handleTaggingSubmit}>
                키밴드 결제 완료
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function RefundBody() {
  const [hasResult, setHasResult] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [cardInputEnabled, setCardInputEnabled] = useState(false);
  const [refundQueryType, setRefundQueryType] = useState<"키 밴드" | "티켓 번호">("키 밴드");

  const summaryRows = hasResult ? refundSummaryRows : [];
  const detailRows = hasResult ? refundDetailRows : [];
  const isKeybandQuery = refundQueryType === "키 밴드";

  return (
    <main className="refund-page">
      <section className="refund-page__content">
        <section className="refund-search">
          <div className="refund-search__filters">
            <label className="refund-field refund-field--date">
              <input type="date" defaultValue="2026-05-29" />
            </label>
            <label className="refund-field refund-field--select">
              <span>상태</span>
              <select defaultValue="전체">
                <option>전체</option>
              </select>
            </label>
            <label className="refund-field refund-field--select">
              <span>결제 수단</span>
              <select defaultValue="전체">
                <option>전체</option>
              </select>
            </label>
            <label className="refund-field refund-field--select">
              <span>창구</span>
              <select defaultValue="전체">
                <option>전체</option>
              </select>
            </label>
          </div>

          <div className="refund-search__query">
            <select
              className="refund-query__type"
              value={refundQueryType}
              onChange={(event) => setRefundQueryType(event.target.value as "키 밴드" | "티켓 번호")}
            >
              <option>키 밴드</option>
              <option>티켓 번호</option>
            </select>
            <input className="refund-query__input refund-query__input--disabled" value="550019" readOnly />
            <input className="refund-query__input refund-query__input--disabled" value="05" readOnly />
            <input
              className={`refund-query__input${isKeybandQuery ? " refund-query__input--disabled" : ""}`}
              defaultValue="5"
              disabled={isKeybandQuery}
            />
            <input
              className={`refund-query__text${!isKeybandQuery ? " refund-query__input--disabled" : ""}`}
              placeholder={
                isKeybandQuery
                  ? "키 밴드를 인식해 주세요."
                  : "티켓 번호 조회 시 키 밴드 입력은 비활성화됩니다."
              }
              disabled={!isKeybandQuery}
            />
            <div className="refund-search__actions">
              <button type="button" className="refund-button refund-button--search" onClick={() => setHasResult(true)}>
                조회
              </button>
              <button
                type="button"
                className="refund-button refund-button--reset"
                onClick={() => {
                  setHasResult(false);
                  setRefundReason("");
                  setCardInputEnabled(false);
                  setRefundQueryType("키 밴드");
                }}
              >
                초기화
              </button>
            </div>
          </div>
        </section>

        <section className="refund-panel">
          <div className="refund-table refund-table--summary">
            <div className="refund-table__head refund-table__head--summary">
              <span>날짜</span>
              <span>결제 번호</span>
              <span>결제 수단</span>
              <span>발권 일시</span>
              <span>티켓 번호</span>
              <span>수량</span>
              <span>결제 금액</span>
              <span>카드번호{"\n"}현금영수증 번호</span>
              <span>승인 번호</span>
              <span>현금{"\n"}영수증</span>
            </div>
            {summaryRows.length > 0 ? (
              <div className="refund-table__body refund-table__body--summary">
                {summaryRows.map((row) => (
                  <div key={`${row.date}-${row.paymentNo}`} className="refund-table__row refund-table__row--summary">
                    <span>{row.date}</span>
                    <span>{row.paymentNo}</span>
                    <span>{row.paymentMethod}</span>
                    <span>{row.issuedAt}</span>
                    <span>{row.ticketNo}</span>
                    <span>{row.qty}</span>
                    <span>{row.paymentAmount}</span>
                    <span>{row.cardOrCashNo}</span>
                    <span>{row.approvalNo}</span>
                    <span>{row.cashReceipt}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="refund-table__empty">데이터가 존재하지 않습니다.</div>
            )}
          </div>
        </section>

        <section className="refund-panel refund-panel--detail">
          <div className="refund-table refund-table--detail">
            <div className="refund-table__head refund-table__head--detail">
              <span>티켓번호</span>
              <span>상태</span>
              <span>날짜</span>
              <span>시간</span>
              <span>상품</span>
              <span>회차</span>
              <span>권종</span>
              <span>검표 여부</span>
              <span>검표 시간</span>
              <span>TCM 예약 번호</span>
            </div>
            {detailRows.length > 0 ? (
              <div className="refund-table__body refund-table__body--detail">
                {detailRows.map((row) => (
                  <div key={row.ticketNo} className="refund-table__row refund-table__row--detail">
                    <span>{row.ticketNo}</span>
                    <span>{row.status}</span>
                    <span>{row.date}</span>
                    <span>{row.time}</span>
                    <span>{row.product}</span>
                    <span style={{ whiteSpace: "pre-line" }}>{row.session}</span>
                    <span>{row.ticketType}</span>
                    <span>{row.inspected}</span>
                    <span>{row.inspectedAt}</span>
                    <span>{row.tcmNo}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="refund-table__empty">데이터가 존재하지 않습니다.</div>
            )}
          </div>
        </section>
      </section>

      <section className="refund-bottom">
        <div className="refund-bottom__reason">
          <label className="refund-bottom__label" htmlFor="refund-reason">
            환불사유
          </label>
          <input
            id="refund-reason"
            type="text"
            placeholder="(선택 사항) 환불 사유를 입력하세요."
            value={refundReason}
            onChange={(event) => setRefundReason(event.target.value)}
          />
        </div>

        <div className="refund-bottom__right">
          <div className="refund-bottom__actions">
            <label className="refund-card-toggle">
              <input
                type="checkbox"
                checked={cardInputEnabled}
                onChange={(event) => setCardInputEnabled(event.target.checked)}
              />
              <span>카드 번호 입력</span>
            </label>

            <button type="button" className="refund-button refund-button--dark">
              티켓 재출력
            </button>
            <button type="button" className="refund-button refund-button--light">
              영수증 재출력
            </button>
            <button type="button" className="refund-button refund-button--light">
              현금 영수증 발행
            </button>
            <button type="button" className="refund-button refund-button--primary refund-button--submit">
              환불
            </button>
          </div>

          {cardInputEnabled ? <input className="refund-card-input" type="text" placeholder="카드 번호를 입력하세요." /> : null}
        </div>
      </section>
    </main>
  );
}

interface NormalPosProps {
  selectedTab: NormalPosTab;
}

export function NormalPos({ selectedTab }: NormalPosProps) {
  if (selectedTab === "환불") {
    return <RefundBody />;
  }

  return <GeneralSalesBody />;
}
