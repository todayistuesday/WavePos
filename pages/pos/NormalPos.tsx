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
  { title: "?덊듃?⑦궎吏", price: "9,000??" },
  { title: "蹂대뱶?⑦궎吏", price: "18,000??" },
  { title: "?좊쿋???⑦궎吏", price: "19,000??" },
  { title: "移대컮???⑦궎吏", price: "24,000??" },
] as const;

const lessonSuitBoardPackageTicketOptions = [
  { title: "?깆씤 ?⑦궎吏", price: "24,000??" },
  { title: "?대┛???⑦궎吏", price: "18,000??" },
] as const;

const miocostaLifejacketPackageTicketOptions = [
  { title: "?깆씤 ?낆옣 ?⑦궎吏", price: "18,000" },
  { title: "?뚯씤 ?낆옣 ?⑦궎吏", price: "13,000" },
  { title: "二쇰쭚 ?깆씤 ?낆옣 ?⑦궎吏", price: "21,000" },
  { title: "二쇰쭚 ?뚯씤 ?낆옣 ?⑦궎吏", price: "18,000" },
] as const;

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
    paymentNo: "李쎄뎄 01",
    paymentMethod: "?ㅻ객??",
    issuedAt: "2026-05-29 09:59:06",
    ticketNo: "20260529-01-3",
    qty: "2",
    paymentAmount: "10,000??",
    cardOrCashNo: "0000000",
    approvalNo: "0000000",
    cashReceipt: "Y",
  },
];

const refundDetailRows: RefundDetailRow[] = [
  {
    ticketNo: "20260529-05-2",
    status: "諛쒓텒 ?꾨즺",
    date: "2026-05-29",
    time: "09:59:06",
    product: "?쒗븨 ?λ퉬",
    session: "1?몄뀡 (1?쒓컙)",
    ticketType: "?뚰봽??蹂대뱶 1?쒓컙",
    inspected: "N",
    inspectedAt: "-",
    tcmNo: "-",
  },
  {
    ticketNo: "20260529-05-1",
    status: "諛쒓텒 ?꾨즺",
    date: "2026-05-29",
    time: "09:59:06",
    product: "???",
    session: "2026-05-21 ~\n2026-12-31",
    ticketType: "鍮꾩튂???",
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
  const [packagePresetCount, setPackagePresetCount] = useState<2 | 3 | 4 | 5>(3);
  const [hasWrappedPackageTitle, setHasWrappedPackageTitle] = useState(false);
  const taggingInputRef = useRef<HTMLInputElement>(null);
  const packageTitleRefs = useRef<Array<HTMLElement | null>>([]);

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

  const extendedPackageScheduleConfig = useMemo(() => {
    if (!selectedPackageScheduleConfig) {
      return null;
    }

    if (selectedCategory === "package-lesson-suit-board") {
      return {
        ...selectedPackageScheduleConfig,
        items: [
          ...selectedPackageScheduleConfig.items,
          {
            id: "lesson-package-item-5",
            kind: "schedule",
            productName: "援ъ꽦?곹뭹 5",
            options: [
              {
                id: "lesson-package-item-5-1100",
                title: "11:00 ~ 12:00",
                rows: [["?뺤썝", "12"], ["諛쒓텒", "3"], ["?붿뿬", "9"], ["?⑤씪???붿뿬", "4"]],
              },
              {
                id: "lesson-package-item-5-1600",
                title: "16:00 ~ 17:00",
                rows: [["?뺤썝", "12"], ["諛쒓텒", "7"], ["?붿뿬", "5"], ["?⑤씪???붿뿬", "2"]],
              },
            ],
          },
        ],
      };
    }

    if (selectedCategory === "package-miocosta-lifejacket") {
      return {
        ...selectedPackageScheduleConfig,
        items: [
          ...selectedPackageScheduleConfig.items,
          {
            id: "miocosta-package-item-5",
            kind: "period",
            productName: "援ъ꽦?곹뭹 5",
            options: [
              {
                id: "miocosta-package-item-5-all-day",
                title: "湲곌컙 ?곹뭹",
                rows: [["?뺤썝", "60"], ["諛쒓텒", "14"], ["?붿뿬", "46"], ["?⑤씪???붿뿬", "46"]],
              },
            ],
          },
        ],
      };
    }

    return selectedPackageScheduleConfig;
  }, [selectedCategory, selectedPackageScheduleConfig]);

  const visiblePackageScheduleItems = useMemo(() => {
    if (!selectedPackageScheduleConfig) {
      return [] as PackageScheduleItem[];
    }

    return extendedPackageScheduleConfig.items.slice(
      0,
      Math.min(packagePresetCount, extendedPackageScheduleConfig.items.length),
    );
  }, [extendedPackageScheduleConfig, packagePresetCount]);

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

        return item.productName + " " + selectedOption.title;
      })
      .join(" / ");
  }, [extendedPackageScheduleConfig, packageScheduleSelections, visiblePackageScheduleItems]);

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

  useEffect(() => {
    if (!selectedPackageScheduleConfig) {
      setHasWrappedPackageTitle(false);
      packageTitleRefs.current = [];
      return;
    }

    const updatePackageTitleWrapState = () => {
      const hasWrappedTitle = packageTitleRefs.current
        .slice(0, visiblePackageScheduleItems.length)
        .some((element) => {
          if (!element) {
            return false;
          }

          const lineHeight = Number.parseFloat(window.getComputedStyle(element).lineHeight);

          if (!Number.isFinite(lineHeight)) {
            return false;
          }

          return element.getBoundingClientRect().height > lineHeight * 1.5;
        });

      setHasWrappedPackageTitle(hasWrappedTitle);
    };

    updatePackageTitleWrapState();
    window.addEventListener("resize", updatePackageTitleWrapState);

    return () => {
      window.removeEventListener("resize", updatePackageTitleWrapState);
    };
  }, [selectedPackageScheduleConfig, visiblePackageScheduleItems]);

  const handleAddTicket = (ticket: { title: string; price: string }) => {
    setCheckoutItems((current) => {
      const existingItem = current.find((item) => item.id === ticket.title);

      if (existingItem) {
        return current.map((item) =>
          item.id === ticket.title ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [
        ...current,
        {
          id: ticket.title,
          title: productCategories.find((item) => item.id === selectedCategory)?.label ?? "?꾩옣 ?곹뭹",
          time:
            selectedPackageScheduleSummary ??
            schedules.find((schedule) => schedule.id === selectedSchedule)?.title ??
            "?꾩옣 ?좏깮",
          detail: ticket.title,
          amount: ticket.price,
          quantity: 1,
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

    if (paymentMethod === "?ㅻ객??") {
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
      setTaggingError("?ㅻ객?쒕? ?쒓퉭??二쇱꽭??");
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
              <h2>?곹뭹 ?좏깮</h2>
              <div className="panel__nav">
                <button type="button" aria-label="?댁쟾 ?곹뭹">
                  <ChevronLeft size={30} strokeWidth={2.2} />
                </button>
                <button type="button" aria-label="?ㅼ쓬 ?곹뭹">
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
                    className={"category-card" + (isActive ? " is-active" : "")}
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
                <h2>?ㅼ?以??좏깮</h2>
                {selectedPackageScheduleConfig ? (
                  <div className="package-presets">
                    {[2, 3, 4, 5].map((count) => {
                      const isActive = packagePresetCount === count;

                      return (
                        <button
                          key={count}
                          type="button"
                          className={"package-presets__button" + (isActive ? " is-active" : "")}
                          onClick={() => setPackagePresetCount(count as 2 | 3 | 4 | 5)}
                        >
                          {"?곹뭹 " + count + "媛?"}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
              <div className="panel__nav">
                <button type="button" aria-label="?댁쟾 ?ㅼ?以?">
                  <ChevronLeft size={30} strokeWidth={2.2} />
                </button>
                <button type="button" aria-label="?ㅼ쓬 ?ㅼ?以?">
                  <ChevronRight size={30} strokeWidth={2.2} />
                </button>
              </div>
            </div>

            {selectedPackageScheduleConfig ? (
              <div
                className={"package-schedule-grid" + (hasWrappedPackageTitle ? " has-wrapped-title" : "")}
                data-columns={packageColumnCount}
              >
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
                          <strong
                            ref={(element) => {
                              packageTitleRefs.current[index] = element;
                            }}
                            className="package-schedule-card__title"
                          >
                            {item.productName}
                          </strong>
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
                              {extendedPackageScheduleConfig?.periodValue ?? "2026-07-01 ~ 2026-12-31"}
                            </div>
                          </div>
                        )}
                      </div>

                      <dl className="package-schedule-card__stats">
                        {selectedOption.rows.map(([label, value]) => (
                          <div key={label}>
                            <dt>{label}</dt>
                            <dd>{label === "?뺤썝" && value === "-" ? "??" : value}</dd>
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
                      className={"schedule-card" + (isActive ? " is-active" : "")}
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
                            <dd>{label === "?뺤썝" && value === "-" ? "??" : value}</dd>
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
              <h2>沅뚯쥌 ?좏깮</h2>
              <span className="panel__copy">留ㅼ쭊?ы븿</span>
              <div className="panel__nav">
                <button type="button" aria-label="?댁쟾 沅뚯쥌">
                  <ChevronLeft size={30} strokeWidth={2.2} />
                </button>
                <button type="button" aria-label="?ㅼ쓬 沅뚯쥌">
                  <ChevronRight size={30} strokeWidth={2.2} />
                </button>
              </div>
            </div>

            {lastTaggedBandNo ? (
              <div className="panel__copy" aria-live="polite">
                {lastTaggedBandNo} ?ㅻ객?쒕줈 寃곗젣媛 ?꾨즺?섏뿀?듬땲??
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
          checkoutLabel={"珥?" + checkoutQuantity + "留?" + checkoutTotal.toLocaleString() + "??寃곗젣?섍린"}
          items={checkoutItems}
          locked={false}
          onClear={handleClearItems}
          onRemoveItem={handleRemoveItem}
          paymentMethods={generalPaymentMethods}
          defaultFocusedPaymentMethod="?ㅻ객??"
          onPay={handlePay}
        />
      </main>

      {isTaggingModalOpen ? (
        <div className="keyband-issue" role="dialog" aria-modal="true" aria-labelledby="normal-pos-keyband-tag-title">
          <div className="keyband-issue__backdrop" onClick={closeTaggingModal} />
          <section className="keyband-issue__panel">
            <div className="keyband-issue__header">
              <div>
                <strong id="normal-pos-keyband-tag-title">?ㅻ객???쒓퉭</strong>
              </div>
              <button
                type="button"
                className="keyband-issue__close"
                onClick={closeTaggingModal}
                aria-label="?앹뾽 ?リ린"
              >
                <X size={18} />
              </button>
            </div>

            <div className="keyband-issue__field">
              <input
                ref={taggingInputRef}
                type="text"
                value={taggingBandNo}
                placeholder="?? KB-2001"
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
              ?ㅼ틦???낅젰 ??Enter媛 ?ㅼ뼱?ㅻ㈃ ?꾩옱 ?좏깮 ?댁뿭 ?꾩껜媛 ?대떦 ?ㅻ객??寃곗젣濡??꾨즺?⑸땲??
            </div>

            {taggingError ? <div className="keyband-issue__error">{taggingError}</div> : null}

            <div className="keyband-issue__actions">
              <button type="button" className="keyband-issue__secondary" onClick={closeTaggingModal}>
                痍⑥냼
              </button>
              <button type="button" className="keyband-issue__primary" onClick={handleTaggingSubmit}>
                ?ㅻ객??寃곗젣 ?꾨즺
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
  const [refundQueryType, setRefundQueryType] = useState<"??諛대뱶" | "?곗폆 踰덊샇">("??諛대뱶");

  const summaryRows = hasResult ? refundSummaryRows : [];
  const detailRows = hasResult ? refundDetailRows : [];
  const isKeybandQuery = refundQueryType === "??諛대뱶";

  return (
    <main className="refund-page">
      <section className="refund-page__content">
        <section className="refund-search">
          <div className="refund-search__filters">
            <label className="refund-field refund-field--date">
              <input type="date" defaultValue="2026-05-29" />
            </label>
            <label className="refund-field refund-field--select">
              <span>?곹깭</span>
              <select defaultValue="?꾩껜">
                <option>?꾩껜</option>
              </select>
            </label>
            <label className="refund-field refund-field--select">
              <span>寃곗젣 ?섎떒</span>
              <select defaultValue="?꾩껜">
                <option>?꾩껜</option>
              </select>
            </label>
            <label className="refund-field refund-field--select">
              <span>李쎄뎄</span>
              <select defaultValue="?꾩껜">
                <option>?꾩껜</option>
              </select>
            </label>
          </div>

          <div className="refund-search__query">
            <select
              className="refund-query__type"
              value={refundQueryType}
              onChange={(event) => setRefundQueryType(event.target.value as "??諛대뱶" | "?곗폆 踰덊샇")}
            >
              <option>??諛대뱶</option>
              <option>?곗폆 踰덊샇</option>
            </select>
            <input className="refund-query__input refund-query__input--disabled" value="550019" readOnly />
            <input className="refund-query__input refund-query__input--disabled" value="05" readOnly />
            <input
              className={"refund-query__input" + (isKeybandQuery ? " refund-query__input--disabled" : "")}
              defaultValue="5"
              disabled={isKeybandQuery}
            />
            <input
              className={"refund-query__text" + (!isKeybandQuery ? " refund-query__input--disabled" : "")}
              placeholder={
                isKeybandQuery
                  ? "??諛대뱶瑜??몄떇??二쇱꽭??"
                  : "?곗폆 踰덊샇 議고쉶 ????諛대뱶 ?낅젰? 鍮꾪솢?깊솕?⑸땲??"
              }
              disabled={!isKeybandQuery}
            />
            <div className="refund-search__actions">
              <button type="button" className="refund-button refund-button--search" onClick={() => setHasResult(true)}>
                議고쉶
              </button>
              <button
                type="button"
                className="refund-button refund-button--reset"
                onClick={() => {
                  setHasResult(false);
                  setRefundReason("");
                  setCardInputEnabled(false);
                  setRefundQueryType("??諛대뱶");
                }}
              >
                珥덇린??
              </button>
            </div>
          </div>
        </section>

        <section className="refund-panel">
          <div className="refund-table refund-table--summary">
            <div className="refund-table__head refund-table__head--summary">
              <span>?좎쭨</span>
              <span>寃곗젣 踰덊샇</span>
              <span>寃곗젣 ?섎떒</span>
              <span>諛쒓텒 ?쇱떆</span>
              <span>?곗폆 踰덊샇</span>
              <span>?섎웾</span>
              <span>寃곗젣 湲덉븸</span>
              <span>移대뱶踰덊샇{"\n"}?꾧툑?곸닔利?踰덊샇</span>
              <span>?뱀씤 踰덊샇</span>
              <span>?꾧툑{"\n"}?곸닔利?</span>
            </div>
            {summaryRows.length > 0 ? (
              <div className="refund-table__body refund-table__body--summary">
                {summaryRows.map((row) => (
                  <div key={row.date + "-" + row.paymentNo} className="refund-table__row refund-table__row--summary">
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
              <div className="refund-table__empty">?곗씠?곌? 議댁옱?섏? ?딆뒿?덈떎.</div>
            )}
          </div>
        </section>

        <section className="refund-panel refund-panel--detail">
          <div className="refund-table refund-table--detail">
            <div className="refund-table__head refund-table__head--detail">
              <span>?곗폆踰덊샇</span>
              <span>?곹깭</span>
              <span>?좎쭨</span>
              <span>?쒓컙</span>
              <span>?곹뭹</span>
              <span>?뚯감</span>
              <span>沅뚯쥌</span>
              <span>寃???щ?</span>
              <span>寃???쒓컙</span>
              <span>TCM ?덉빟 踰덊샇</span>
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
              <div className="refund-table__empty">?곗씠?곌? 議댁옱?섏? ?딆뒿?덈떎.</div>
            )}
          </div>
        </section>
      </section>

      <section className="refund-bottom">
        <div className="refund-bottom__reason">
          <label className="refund-bottom__label" htmlFor="refund-reason">
            ?섎텋?ъ쑀
          </label>
          <input
            id="refund-reason"
            type="text"
            placeholder="(?좏깮 ?ы빆) ?섎텋 ?ъ쑀瑜??낅젰?섏꽭??"
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
              <span>移대뱶 踰덊샇 ?낅젰</span>
            </label>

            <button type="button" className="refund-button refund-button--dark">
              ?곗폆 ?ъ텧??
            </button>
            <button type="button" className="refund-button refund-button--light">
              ?곸닔利??ъ텧??
            </button>
            <button type="button" className="refund-button refund-button--light">
              ?꾧툑 ?곸닔利?諛쒗뻾
            </button>
            <button type="button" className="refund-button refund-button--primary refund-button--submit">
              ?섎텋
            </button>
          </div>

          {cardInputEnabled ? <input className="refund-card-input" type="text" placeholder="移대뱶 踰덊샇瑜??낅젰?섏꽭??" /> : null}
        </div>
      </section>
    </main>
  );
}

interface NormalPosProps {
  selectedTab: NormalPosTab;
}

export function NormalPos({ selectedTab }: NormalPosProps) {
  if (selectedTab === "?섎텋") {
    return <RefundBody />;
  }

  return <GeneralSalesBody />;
}










