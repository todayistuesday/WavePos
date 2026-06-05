
import { Circle } from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import { KeybandPos } from "./keybandpos";
import { NormalPos } from "./normalpos";
import { posModes, topTabs } from "./posData";

type CopyState = "idle" | "success" | "error";

/**
 * 현재 브라우저 URL을 클립보드에 복사.
 * html.to.design 플러그인의 "Import via URL" 필드에 붙여넣어 사용.
 */
async function copyUrlForFigma() {
  if (!navigator.clipboard) {
    throw new Error("Clipboard API를 지원하지 않는 브라우저입니다.");
  }
  await navigator.clipboard.writeText(window.location.href);
}

export default function App() {
  const [selectedTab, setSelectedTab] = useState<(typeof topTabs)[number]>(topTabs[0]);
  const [posMode, setPosMode] = useState<(typeof posModes)[number]["id"]>("general");
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const isKeybandMode = posMode === "keyband";

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
      await copyUrlForFigma();
      setCopyState("success");
    } catch (error) {
      console.error(error);
      setCopyState("error");
    }
  };

  const figmaButtonLabel =
    copyState === "success" ? "URL 복사됨" : copyState === "error" ? "복사 실패" : "피그마 디자인";

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
          <span>후불: 77,000원</span>
          <span>판매 합계: 77,000원</span>
          <span>발권 수량: 4매</span>
        </div>

        <div className="pos-footer__controls">
          <div className="pos-mode-toggle pos-mode-toggle--footer" role="tablist" aria-label="POS 모드 전환">
            {posModes.map((mode) => (
              <button
                key={mode.id}
                className={`pos-mode-toggle__button${mode.id === posMode ? " is-active" : ""}`}
                type="button"
                role="tab"
                aria-selected={mode.id === posMode}
                onClick={() => setPosMode(mode.id)}
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
