import { Circle } from "lucide-react";
import { startTransition, useEffect, useState } from "react";

import { KeybandPos } from "./pages/pos/KeybandPos";
import { MobileSettlementPage } from "./pages/pos/MobileSettlement";
import { NormalPos } from "./pages/pos/NormalPos";
import { posModes, topTabs } from "./pages/pos/posData";
import { copyElementPng } from "./utils/copyPng";

type CopyState = "idle" | "success" | "error";
type AppScreen = "pos" | "mobile-settlement";

function getAppScreenFromHash(): AppScreen {
  return window.location.hash === "#/mobile-settlement" ? "mobile-settlement" : "pos";
}

const footerModes = [
  { id: "general", label: "일반 포스" },
  { id: "keyband", label: "키밴드 정산" },
  { id: "mobile-settlement", label: "모바일 정산" },
] as const;

export default function App() {
  const [selectedTab, setSelectedTab] = useState<(typeof topTabs)[number]>(topTabs[0]);
  const [posMode, setPosMode] = useState<(typeof posModes)[number]["id"]>("general");
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [screen, setScreen] = useState<AppScreen>(() => getAppScreenFromHash());
  const isKeybandMode = posMode === "keyband";

  useEffect(() => {
    const handleHashChange = () => {
      setScreen(getAppScreenFromHash());
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (copyState === "idle") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCopyState("idle");
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [copyState]);

  const handleCopyFigmaDesign = async () => {
    try {
      await copyElementPng(".pos-shell");
      setCopyState("success");
    } catch (error) {
      console.error(error);
      setCopyState("error");
    }
  };

  const figmaButtonLabel =
    copyState === "success" ? "PNG 복사됨" : copyState === "error" ? "복사 실패" : "스크린샷";
  const deferredSummaryLabel = isKeybandMode ? null : "키밴드: 77,000원";

  if (screen === "mobile-settlement") {
    return <MobileSettlementPage />;
  }

  return (
    <div className="pos-shell">
      <header className="pos-topbar">
        <div className="pos-brand" aria-label="maketicket POS">
          <span className="pos-brand__main">maketicket</span>
          <span className="pos-brand__accent">POS</span>
        </div>

        <nav className="pos-tabs" aria-label="POS 메뉴">
          {topTabs.map((tab) => {
            const tabLabel = isKeybandMode && tab === "현장 판매" ? "키밴드 정산" : tab;

            return (
              <button
                key={tab}
                className={`pos-tab${tab === selectedTab ? " is-active" : ""}`}
                type="button"
                onClick={() => {
                  startTransition(() => {
                    setSelectedTab(tab);
                  });
                }}
              >
                {tabLabel}
              </button>
            );
          })}
        </nav>

        <div className="pos-status">
          <span className="pos-status__datetime">2026.05.29(금) 15:12</span>
          <span className="pos-status__connected">
            <Circle size={10} fill="currentColor" />
            연결됨
          </span>
        </div>
      </header>

      {isKeybandMode ? <KeybandPos /> : <NormalPos selectedTab={selectedTab} />}

      <footer className="pos-footer">
        <div className="pos-footer__left">
          <strong>05 김은화</strong>
          <span>현금: 37,000원</span>
          <span>카드: 40,000원</span>
          {deferredSummaryLabel ? <span>{deferredSummaryLabel}</span> : null}
          <span>판매 합계: 77,000원</span>
          <span>발권 수량: 4매</span>
        </div>

        <div className="pos-footer__controls">
          <div className="pos-mode-toggle pos-mode-toggle--footer" role="tablist" aria-label="POS 모드 전환">
            {footerModes.map((mode) => (
              <button
                key={mode.id}
                className={`pos-mode-toggle__button${mode.id === posMode ? " is-active" : ""}`}
                type="button"
                role="tab"
                aria-selected={mode.id === posMode}
                onClick={() => {
                  if (mode.id === "mobile-settlement") {
                    window.location.hash = "/mobile-settlement";
                    return;
                  }

                  setPosMode(mode.id);
                }}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`pos-footer__figma${copyState === "success" ? " is-success" : ""}${copyState === "error" ? " is-error" : ""}`}
            onClick={handleCopyFigmaDesign}
          >
            {figmaButtonLabel}
          </button>

          <button type="button" className="pos-footer__drawer">
            금고 열기
          </button>
        </div>
      </footer>
    </div>
  );
}
