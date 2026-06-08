import { Circle } from "lucide-react";
import html2canvas from "html2canvas";
import { startTransition, useEffect, useState } from "react";

import { KeybandPos } from "./pages/pos/KeybandPos";
import { NormalPos } from "./pages/pos/NormalPos";
import { posModes, topTabs } from "./pages/pos/posData";

type CopyState = "idle" | "success" | "error";

async function copyPngForFigma() {
  if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
    throw new Error("PNG 복사를 지원하지 않는 브라우저입니다.");
  }

  const target = document.querySelector(".pos-shell");

  if (!(target instanceof HTMLElement)) {
    throw new Error("스크린샷 대상을 찾을 수 없습니다.");
  }

  const canvas = await html2canvas(target, {
    backgroundColor: "#ffffff",
    scale: window.devicePixelRatio || 1,
    useCORS: true,
    logging: false,
    scrollX: 0,
    scrollY: 0,
    windowWidth: target.scrollWidth,
    windowHeight: target.scrollHeight,
    onclone: (clonedDocument) => {
      clonedDocument.documentElement.scrollTo(0, 0);
      clonedDocument.body.scrollTo(0, 0);
    },
  });

  const pngBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("PNG 생성에 실패했습니다."));
        return;
      }
      resolve(blob);
    }, "image/png");
  });

  await navigator.clipboard.write([
    new ClipboardItem({
      "image/png": pngBlob,
    }),
  ]);
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
      await copyPngForFigma();
      setCopyState("success");
    } catch (error) {
      console.error(error);
      setCopyState("error");
    }
  };

  const figmaButtonLabel =
    copyState === "success" ? "PNG 복사됨" : copyState === "error" ? "복사 실패" : "스크린샷";
  const deferredSummaryLabel = isKeybandMode ? null : "키밴드: 77,000원";

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
