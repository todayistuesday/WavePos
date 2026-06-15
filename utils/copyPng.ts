import html2canvas from "html2canvas";

export async function copyElementPng(selector: string) {
  if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
    throw new Error("PNG 복사를 지원하지 않는 브라우저입니다.");
  }

  const target = document.querySelector(selector);

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
