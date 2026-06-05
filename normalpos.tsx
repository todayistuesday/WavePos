import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { CheckoutPanel } from "./posShared";
import { generalPaymentMethods, productCategories, schedules, ticketOptions, topTabs } from "./posData";

type NormalPosTab = (typeof topTabs)[number];

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

function GeneralSalesBody() {
  const [selectedCategory, setSelectedCategory] = useState("surf");
  const [selectedSchedule, setSelectedSchedule] = useState("one-hour");

  return (
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
            {productCategories.map((item) => {
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
          <div className="panel__header">
            <h2>스케줄 선택</h2>
            <div className="panel__nav">
              <button type="button" aria-label="이전 스케줄">
                <ChevronLeft size={30} strokeWidth={2.2} />
              </button>
              <button type="button" aria-label="다음 스케줄">
                <ChevronRight size={30} strokeWidth={2.2} />
              </button>
            </div>
          </div>

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
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </button>
              );
            })}
          </div>
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

          <div className="ticket-grid">
            {ticketOptions.map((ticket) => (
              <button key={ticket.title} className="ticket-card" type="button">
                <strong>{ticket.title}</strong>
                <span>{ticket.price}</span>
              </button>
            ))}
          </div>
        </section>
      </section>

      <CheckoutPanel
        checkoutLabel="총 0매 0원 결제하기"
        items={[]}
        locked={false}
        onClear={() => undefined}
        paymentMethods={generalPaymentMethods}
        defaultFocusedPaymentMethod="키밴드"
      />
    </main>
  );
}

function RefundBody() {
  const [hasResult, setHasResult] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [cardInputEnabled, setCardInputEnabled] = useState(false);

  const summaryRows = hasResult ? refundSummaryRows : [];
  const detailRows = hasResult ? refundDetailRows : [];

  return (
    <main className="refund-page">
      <section className="refund-page__content">
        {/* ── 검색 카드 ── */}
        <section className="refund-search">
          {/* Row 1: 필터 */}
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

          {/* Row 2: 검색 쿼리 */}
          <div className="refund-search__query">
            <select className="refund-query__type" defaultValue="키 밴드">
              <option>키 밴드</option>
              <option>티켓 번호</option>
            </select>
            <input
              className="refund-query__input refund-query__input--disabled"
              value="550019"
              readOnly
            />
            <input
              className="refund-query__input refund-query__input--disabled"
              value="05"
              readOnly
            />
            <input className="refund-query__input" defaultValue="5" />
            <input
              className="refund-query__text"
              placeholder="키 밴드를 인식해 주세요."
            />
            <div className="refund-search__actions">
              <button
                type="button"
                className="refund-button refund-button--search"
                onClick={() => setHasResult(true)}
              >
                조회
              </button>
              <button
                type="button"
                className="refund-button refund-button--reset"
                onClick={() => {
                  setHasResult(false);
                  setRefundReason("");
                  setCardInputEnabled(false);
                }}
              >
                초기화
              </button>
            </div>
          </div>
        </section>

        {/* ── 결제 요약 테이블 ── */}
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
                  <div
                    key={`${row.date}-${row.paymentNo}`}
                    className="refund-table__row refund-table__row--summary"
                  >
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

        {/* ── 티켓 상세 테이블 ── */}
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
                  <div
                    key={row.ticketNo}
                    className="refund-table__row refund-table__row--detail"
                  >
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

      {/* ── 하단 액션 바 ── */}
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
          <button
            type="button"
            className="refund-button refund-button--primary refund-button--submit"
          >
            환불
          </button>
        </div>

        {cardInputEnabled ? (
          <input
            className="refund-card-input"
            type="text"
            placeholder="카드 번호를 입력하세요."
          />
        ) : (
          <div className="refund-card-input refund-card-input--placeholder" />
        )}
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
