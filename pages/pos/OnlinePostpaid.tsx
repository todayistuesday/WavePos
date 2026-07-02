import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";

import { copyElementPng } from "../../utils/copyPng";

const devicePresets = [
  { id: "ios", label: "iOS", sizeLabel: "390 x 844", width: 390, height: 844 },
  { id: "android", label: "Android", sizeLabel: "360 x 800", width: 360, height: 800 },
  { id: "tablet", label: "태블릿", sizeLabel: "768 x 1024", width: 768, height: 1024 },
] as const;

type CopyState = "idle" | "success" | "error";

type TicketMainRow = {
  label: string;
  value: string;
  accent?: string;
};

type TicketSummaryRow = {
  label: string;
  value: string;
};

type TicketSlide = {
  id: string;
  titleLines: string[];
  qrLabel: string;
  watermark: string;
  mainRows: TicketMainRow[];
  inspectionTitle: string;
  inspectionButtonLabel: string;
  inspectionCaption: string;
  settlementReservationNo: string;
  summaryRows: TicketSummaryRow[];
};

const ticketSceneImage =
  "radial-gradient(circle at 18% 28%, rgba(255,255,255,0.22) 0 8%, transparent 8.5%), radial-gradient(circle at 34% 30%, rgba(255,255,255,0.16) 0 10%, transparent 10.5%), radial-gradient(circle at 64% 24%, rgba(255,255,255,0.2) 0 11%, transparent 11.5%), radial-gradient(circle at 78% 32%, rgba(255,255,255,0.16) 0 9%, transparent 9.5%), radial-gradient(circle at 24% 68%, rgba(255,255,255,0.18) 0 10%, transparent 10.5%), radial-gradient(circle at 50% 74%, rgba(255,255,255,0.14) 0 12%, transparent 12.5%), radial-gradient(circle at 82% 70%, rgba(255,255,255,0.16) 0 11%, transparent 11.5%), linear-gradient(135deg, #666666 0%, #8a8a8a 52%, #5e5e5e 100%)";

const sharedInspectionTitle = "키 밴드 사용 이력을 확인하고 정산해 주세요.";
const sharedInspectionButtonLabel = "정산 하기";
const sharedInspectionCaption = "정산 완료 후 키 밴드를 반납해 주세요.";
const sharedSettlementReservationNo = "RS26000021603";

const ticketSlides: TicketSlide[] = [
  {
    id: "ticket-1",
    titleLines: ["테마파크 입장권 + 스마트레스토랑", "링"],
    qrLabel: "돈가스",
    watermark: "1",
    mainRows: [
      { label: "티켓번호", value: "26006986524-1" },
      { label: "상품일시", value: "스마트 레스토랑·12:00~18:00" },
      { label: "개별 티켓명", value: "돈가스" },
      { label: "패키지 티켓", value: "입장 소인 + 돈가스" },
      { label: "사용여부", value: "예매완료", accent: "(정상 티켓)" },
    ],
    inspectionTitle: sharedInspectionTitle,
    inspectionButtonLabel: sharedInspectionButtonLabel,
    inspectionCaption: sharedInspectionCaption,
    settlementReservationNo: sharedSettlementReservationNo,
    summaryRows: [
      { label: "상품명", value: "테마파크 입장권 + 스마트레스토랑" },
      { label: "상품일자", value: "2026-05-29(금)" },
      { label: "예매번호", value: "RS26005775638" },
      { label: "결제 금액", value: "600 원" },
      { label: "결제수단", value: "전화예약" },
    ],
  },
  {
    id: "ticket-2",
    titleLines: ["테마파크 입장권 + 스마트레스토랑", "링"],
    qrLabel: "파스타",
    watermark: "2",
    mainRows: [
      { label: "티켓번호", value: "26006986524-2" },
      { label: "상품일시", value: "스마트 레스토랑·12:00~18:00" },
      { label: "개별 티켓명", value: "파스타" },
      { label: "패키지 티켓", value: "입장 대인 + 파스타" },
      { label: "사용여부", value: "예매완료", accent: "(정상 티켓)" },
    ],
    inspectionTitle: sharedInspectionTitle,
    inspectionButtonLabel: sharedInspectionButtonLabel,
    inspectionCaption: sharedInspectionCaption,
    settlementReservationNo: sharedSettlementReservationNo,
    summaryRows: [
      { label: "상품명", value: "테마파크 입장권 + 스마트레스토랑" },
      { label: "상품일자", value: "2026-05-29(금)" },
      { label: "예매번호", value: "RS26005775639" },
      { label: "결제 금액", value: "700 원" },
      { label: "결제수단", value: "전화예약" },
    ],
  },
  {
    id: "ticket-3",
    titleLines: ["테마파크 입장권 + 스마트레스토랑", "링"],
    qrLabel: "피자",
    watermark: "3",
    mainRows: [
      { label: "티켓번호", value: "26006986524-3" },
      { label: "상품일시", value: "스마트 레스토랑·12:00~18:00" },
      { label: "개별 티켓명", value: "피자" },
      { label: "패키지 티켓", value: "입장 소인 + 피자" },
      { label: "사용여부", value: "예매완료", accent: "(정상 티켓)" },
    ],
    inspectionTitle: sharedInspectionTitle,
    inspectionButtonLabel: sharedInspectionButtonLabel,
    inspectionCaption: sharedInspectionCaption,
    settlementReservationNo: sharedSettlementReservationNo,
    summaryRows: [
      { label: "상품명", value: "테마파크 입장권 + 스마트레스토랑" },
      { label: "상품일자", value: "2026-05-29(금)" },
      { label: "예매번호", value: "RS26005775640" },
      { label: "결제 금액", value: "800 원" },
      { label: "결제수단", value: "전화예약" },
    ],
  },
  {
    id: "ticket-4",
    titleLines: ["테마파크 입장권 + 스마트레스토랑", "링"],
    qrLabel: "소인 입장권",
    watermark: "4",
    mainRows: [
      { label: "티켓번호", value: "26006986505-1" },
      { label: "상품일시", value: "테마파크·00:00~00:00" },
      { label: "개별 티켓명", value: "소인 입장권" },
      { label: "패키지 티켓", value: "입장 소인 + 돈가스" },
      { label: "사용여부", value: "예매완료", accent: "(정상 티켓)" },
    ],
    inspectionTitle: sharedInspectionTitle,
    inspectionButtonLabel: sharedInspectionButtonLabel,
    inspectionCaption: sharedInspectionCaption,
    settlementReservationNo: sharedSettlementReservationNo,
    summaryRows: [
      { label: "상품명", value: "테마파크 입장권 + 스마트레스토랑" },
      { label: "상품일자", value: "2026-05-29(금)" },
      { label: "예매번호", value: "RS26000021603" },
      { label: "결제 금액", value: "600 원" },
      { label: "결제수단", value: "전화예약" },
    ],
  },
];

function TicketQrCode() {
  return (
    <svg viewBox="0 0 92 92" aria-hidden="true" style={{ width: 78, height: 78, display: "block" }}>
      <rect width="92" height="92" fill="#fff" />
      <rect x="4" y="4" width="28" height="28" fill="none" stroke="#111" strokeWidth="4" />
      <rect x="11" y="11" width="14" height="14" fill="#111" />
      <rect x="60" y="4" width="28" height="28" fill="none" stroke="#111" strokeWidth="4" />
      <rect x="67" y="11" width="14" height="14" fill="#111" />
      <rect x="4" y="60" width="28" height="28" fill="none" stroke="#111" strokeWidth="4" />
      <rect x="11" y="67" width="14" height="14" fill="#111" />
      <rect x="40" y="10" width="6" height="6" fill="#111" />
      <rect x="46" y="16" width="6" height="6" fill="#111" />
      <rect x="40" y="22" width="6" height="6" fill="#111" />
      <rect x="34" y="28" width="6" height="6" fill="#111" />
      <rect x="46" y="28" width="6" height="6" fill="#111" />
      <rect x="40" y="34" width="6" height="6" fill="#111" />
      <rect x="52" y="34" width="6" height="6" fill="#111" />
      <rect x="58" y="40" width="6" height="6" fill="#111" />
      <rect x="64" y="46" width="6" height="6" fill="#111" />
      <rect x="52" y="46" width="6" height="6" fill="#111" />
      <rect x="40" y="46" width="6" height="6" fill="#111" />
      <rect x="34" y="52" width="6" height="6" fill="#111" />
      <rect x="46" y="52" width="6" height="6" fill="#111" />
      <rect x="58" y="52" width="6" height="6" fill="#111" />
      <rect x="40" y="58" width="6" height="6" fill="#111" />
      <rect x="52" y="58" width="6" height="6" fill="#111" />
      <rect x="64" y="58" width="6" height="6" fill="#111" />
      <rect x="34" y="64" width="6" height="6" fill="#111" />
      <rect x="46" y="64" width="6" height="6" fill="#111" />
      <rect x="58" y="64" width="6" height="6" fill="#111" />
      <rect x="70" y="64" width="6" height="6" fill="#111" />
      <rect x="40" y="70" width="6" height="6" fill="#111" />
      <rect x="52" y="70" width="6" height="6" fill="#111" />
      <rect x="64" y="70" width="6" height="6" fill="#111" />
      <rect x="76" y="70" width="6" height="6" fill="#111" />
      <rect x="34" y="76" width="6" height="6" fill="#111" />
      <rect x="46" y="76" width="6" height="6" fill="#111" />
      <rect x="58" y="76" width="6" height="6" fill="#111" />
      <rect x="70" y="76" width="6" height="6" fill="#111" />
    </svg>
  );
}

export function OnlinePostpaidPage() {
  const [devicePreset, setDevicePreset] = useState<(typeof devicePresets)[number]["id"]>("ios");
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [currentTicketIndex, setCurrentTicketIndex] = useState(ticketSlides.length - 1);

  const currentPreset = devicePresets.find((preset) => preset.id === devicePreset) ?? devicePresets[0];
  const currentTicket = ticketSlides[currentTicketIndex] ?? ticketSlides[0];
  const screenshotLabel =
    copyState === "success" ? "PNG 복사됨" : copyState === "error" ? "복사 실패" : "스크린샷";

  useEffect(() => {
    if (copyState === "idle") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCopyState("idle");
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [copyState]);

  const handleCopyScreenshot = async () => {
    try {
      await copyElementPng(".online-postpaid");
      setCopyState("success");
    } catch (error) {
      console.error(error);
      setCopyState("error");
    }
  };

  const moveTicket = (direction: "prev" | "next") => {
    setCurrentTicketIndex((current) => {
      if (direction === "prev") {
        return current === 0 ? ticketSlides.length - 1 : current - 1;
      }

      return current === ticketSlides.length - 1 ? 0 : current + 1;
    });
  };

  const handleSettlementClick = () => {
    window.location.hash = `/mobile-settlement?reservationNo=${encodeURIComponent(currentTicket.settlementReservationNo)}`;
  };

  const frameWidth = `${currentPreset.width}px`;
  const frameHeight = `${currentPreset.height}px`;
  const isTablet = currentPreset.id === "tablet";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: "28px 20px",
        background: "linear-gradient(180deg, #edf1f5 0%, #d8d8d8 100%)",
      }}
    >
      <div style={{ display: "grid", justifyItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            role="tablist"
            aria-label="기기 프리셋"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              width: 320,
              padding: 4,
              border: "1px solid #cfd4dd",
              borderRadius: 999,
              background: "rgba(255, 255, 255, 0.84)",
              boxShadow: "0 10px 24px rgba(31, 42, 58, 0.08)",
            }}
          >
            {devicePresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                role="tab"
                aria-selected={preset.id === devicePreset}
                onClick={() => setDevicePreset(preset.id)}
                style={{
                  height: 38,
                  border: 0,
                  borderRadius: 999,
                  background: preset.id === devicePreset ? "#1f2a3a" : "transparent",
                  color: preset.id === devicePreset ? "#fff" : "#5b6880",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopyScreenshot}
            style={{
              height: 46,
              minWidth: 110,
              padding: "0 16px",
              border: `1px solid ${copyState === "success" ? "#22a447" : copyState === "error" ? "#d34646" : "#cfd4dd"}`,
              borderRadius: 999,
              background:
                copyState === "success" ? "#f3fff7" : copyState === "error" ? "#fff6f6" : "rgba(255, 255, 255, 0.9)",
              color: copyState === "success" ? "#146d2d" : copyState === "error" ? "#b12727" : "#334154",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {screenshotLabel}
          </button>
        </div>

        <span style={{ fontSize: 13, fontWeight: 700, color: "#607089" }}>
          {currentPreset.label} 기준 {currentPreset.sizeLabel}
        </span>
      </div>

      <section
        className="online-postpaid"
        aria-labelledby="online-postpaid-title"
        style={{
          width: frameWidth,
          height: frameHeight,
          maxWidth: "100vw",
          maxHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "linear-gradient(180deg, #dadada 0%, #d3d3d3 100%)",
        }}
      >
        <div style={{ width: 82, height: 7, margin: "0 auto", borderRadius: "0 0 8px 8px", background: "#d91057", flex: "0 0 auto" }} />

        <div
          style={{
            position: "relative",
            height: isTablet ? 246 : 206,
            overflow: "hidden",
            backgroundImage: ticketSceneImage,
            backgroundPosition: "center",
            backgroundSize: "cover",
            flex: "0 0 auto",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "rgba(0, 0, 0, 0.42)" }} />
          <h1
            id="online-postpaid-title"
            style={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              margin: 0,
              display: "grid",
              alignContent: "center",
              justifyItems: "center",
              padding: isTablet ? "12px 72px 0" : "8px 36px 0",
              color: "#fff",
              fontSize: isTablet ? 38 : 25,
              lineHeight: 1.02,
              fontWeight: 800,
              letterSpacing: "-0.06em",
              textAlign: "center",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.28)",
            }}
          >
            {currentTicket.titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
        </div>

        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: isTablet ? "138px minmax(0, 1fr)" : "96px minmax(0, 1fr)",
            alignItems: "center",
            marginTop: -4,
            paddingLeft: isTablet ? 56 : 34,
            minHeight: isTablet ? 88 : 74,
            flex: "0 0 auto",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.62,
              filter: "grayscale(1)",
              backgroundImage: ticketSceneImage,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: isTablet ? 126 : 84,
              height: isTablet ? 126 : 84,
              background: "#fff",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 6px 18px rgba(0, 0, 0, 0.12)",
            }}
          >
            <TicketQrCode />
          </div>

          <span
            style={{
              position: "relative",
              zIndex: 1,
              paddingLeft: isTablet ? 24 : 14,
              color: "rgba(255, 255, 255, 0.88)",
              fontSize: isTablet ? 28 : 18,
              fontWeight: 500,
              textShadow: "0 1px 5px rgba(0, 0, 0, 0.25)",
            }}
          >
            {currentTicket.qrLabel}
          </span>
        </div>

        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", background: "linear-gradient(180deg, #dedede 0%, #d5d5d5 100%)" }}>
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => moveTicket("prev")}
                aria-label="이전 티켓"
                style={{
                  position: "absolute",
                  left: 0,
                  top: isTablet ? 160 : 104,
                  zIndex: 3,
                  width: isTablet ? 42 : 25,
                  height: isTablet ? 82 : 54,
                  border: 0,
                  borderRadius: "0 10px 10px 0",
                  background: "#efefef",
                  color: "#2c2c2c",
                  display: "grid",
                  placeItems: "center",
                  boxShadow: "0 3px 10px rgba(70, 70, 70, 0.15)",
                  cursor: "pointer",
                }}
              >
                <ChevronLeft size={24} strokeWidth={2.8} />
              </button>

              <button
                type="button"
                onClick={() => moveTicket("next")}
                aria-label="다음 티켓"
                style={{
                  position: "absolute",
                  right: 0,
                  top: isTablet ? 160 : 104,
                  zIndex: 3,
                  width: isTablet ? 42 : 25,
                  height: isTablet ? 82 : 54,
                  border: 0,
                  borderRadius: "10px 0 0 10px",
                  background: "#df124f",
                  color: "#fff",
                  display: "grid",
                  placeItems: "center",
                  boxShadow: "0 3px 10px rgba(70, 70, 70, 0.15)",
                  cursor: "pointer",
                }}
              >
                <ChevronRight size={24} strokeWidth={2.8} />
              </button>

              <section
                style={{
                  position: "relative",
                  minHeight: isTablet ? 470 : 306,
                  marginTop: -2,
                  padding: isTablet ? "62px 0 16px" : "42px 0 16px",
                  borderRadius: 16,
                  background: "#fff",
                  boxShadow: "0 8px 18px rgba(70, 70, 70, 0.08)",
                  overflow: "hidden",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: isTablet ? "78px 0 auto 0" : "54px 0 auto 0",
                    textAlign: "center",
                    fontSize: isTablet ? 240 : 154,
                    fontWeight: 700,
                    lineHeight: 1,
                    color: "rgba(244, 164, 182, 0.38)",
                    pointerEvents: "none",
                  }}
                >
                  {currentTicket.watermark}
                </span>

                <div style={{ position: "relative", zIndex: 1, display: "grid" }}>
                  {currentTicket.mainRows.map((row) => (
                    <div
                      key={row.label}
                      style={{
                        display: "grid",
                        gridTemplateColumns: isTablet ? "178px minmax(0, 1fr)" : "122px minmax(0, 1fr)",
                        alignItems: "center",
                        minHeight: isTablet ? 56 : 38,
                        padding: isTablet ? "0 28px 0 48px" : "0 18px 0 34px",
                        borderBottom: "1px solid #e8e8e8",
                      }}
                    >
                      <span style={{ position: "relative", color: "#6a6a6a", fontSize: isTablet ? 22 : 13, fontWeight: 500 }}>
                        <span
                          style={{
                            position: "absolute",
                            left: -10,
                            top: "50%",
                            width: 2,
                            height: 12,
                            background: "#ff0a54",
                            transform: "translateY(-50%)",
                          }}
                        />
                        {row.label}
                      </span>

                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: 4,
                          minWidth: 0,
                          color: "#5f5f5f",
                          fontSize: isTablet ? 22 : 13,
                          fontWeight: 500,
                          textAlign: "right",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.value}
                        {row.accent ? <em style={{ color: "#3c55ff", fontStyle: "normal" }}>{row.accent}</em> : null}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    paddingTop: isTablet ? 30 : 22,
                    color: "#888",
                    fontSize: isTablet ? 22 : 17,
                    fontWeight: 500,
                  }}
                >
                  <strong style={{ color: "#111", fontWeight: 800 }}>{currentTicketIndex + 1}</strong>
                  <span>/</span>
                  <span>{ticketSlides.length}</span>
                </div>
              </section>
            </div>

            <section style={{ padding: "10px 0 0", background: "#d5d5d5" }}>
              <div
                style={{
                  width: "calc(100% - 60px)",
                  margin: "0 auto",
                  padding: isTablet ? "28px 24px 22px" : "18px 18px 16px",
                  display: "grid",
                  justifyItems: "center",
                  gap: isTablet ? 18 : 12,
                  background: "transparent",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#f04055",
                    fontSize: isTablet ? 24 : 15,
                    fontWeight: 500,
                    lineHeight: 1.25,
                    textAlign: "center",
                  }}
                >
                  {currentTicket.inspectionTitle}
                </p>

                <button
                  type="button"
                  onClick={handleSettlementClick}
                  style={{
                    minWidth: isTablet ? 170 : 112,
                    height: isTablet ? 60 : 42,
                    border: 0,
                    borderRadius: 4,
                    background: "#df124f",
                    color: "#fff",
                    fontSize: isTablet ? 26 : 18,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {currentTicket.inspectionButtonLabel}
                </button>

                <p
                  style={{
                    margin: 0,
                    color: "#555",
                    fontSize: isTablet ? 20 : 12,
                    fontWeight: 500,
                    lineHeight: 1.35,
                    textAlign: "center",
                  }}
                >
                  {currentTicket.inspectionCaption}
                </p>
              </div>
            </section>

            <section style={{ display: "grid", alignContent: "start", padding: "10px 0 0", background: "transparent" }}>
              {currentTicket.summaryRows.map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: isTablet ? "178px minmax(0, 1fr)" : "122px minmax(0, 1fr)",
                    alignItems: "center",
                    minHeight: isTablet ? 42 : 31,
                    padding: isTablet ? "0 28px 0 48px" : "0 18px 0 34px",
                    borderBottom: "1px solid #cfcfcf",
                  }}
                >
                  <span style={{ position: "relative", color: "#6a6a6a", fontSize: isTablet ? 22 : 13, fontWeight: 500 }}>
                    <span
                      style={{
                        position: "absolute",
                        left: -10,
                        top: "50%",
                        width: 2,
                        height: 12,
                        background: "#ff0a54",
                        transform: "translateY(-50%)",
                      }}
                    />
                    {row.label}
                  </span>

                  <span
                    style={{
                      color: "#8d8d8d",
                      fontSize: isTablet ? 20 : 12,
                      fontWeight: 500,
                      textAlign: "right",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </section>
          </div>

          <footer
            style={{
              display: "grid",
              alignContent: "center",
              justifyItems: "center",
              gap: 5,
              minHeight: 108,
              padding: "14px 0 18px",
              background: "#fff",
              flex: "0 0 auto",
            }}
          >
            <div aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#f8383f" }}>
              <span
                style={{
                  position: "relative",
                  width: 18,
                  height: 22,
                  borderRadius: "7px 7px 7px 2px",
                  background: "#f8383f",
                  display: "inline-block",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 3,
                    right: 3,
                    top: 7,
                    height: 2,
                    background: "rgba(255,255,255,0.9)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: 3,
                    right: 3,
                    top: 12,
                    height: 2,
                    background: "rgba(255,255,255,0.9)",
                  }}
                />
              </span>
              <strong style={{ fontSize: isTablet ? 38 : 27, fontWeight: 500, letterSpacing: "0.02em" }}>smartix</strong>
            </div>

            <p style={{ margin: 0, color: "#202020", fontSize: isTablet ? 18 : 13, fontWeight: 600 }}>
              이 티켓은 스마틱스에서 만들었습니다.
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
