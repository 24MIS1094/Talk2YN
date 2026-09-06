import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

const PAGE_WIDTH_PX = 816; // 8.5in @ 96dpi
const PAGE_HEIGHT_PX = 1056; // 11in @ 96dpi
const PDF_WIDTH_PT = 612;
const PDF_HEIGHT_PT = 792;

/** Capture the exact rendered resume and download a Letter PDF, splitting across pages if needed. */
export async function downloadResumeFromNode(node: HTMLElement, name = "resume") {
  await document.fonts.ready;

  // Measure natural content height at the fixed page width.
  const naturalHeight = Math.max(node.scrollHeight, node.offsetHeight, PAGE_HEIGHT_PX);
  const captureHeight = Math.ceil(naturalHeight);

  const dataUrl = await toPng(node, {
    width: PAGE_WIDTH_PX,
    height: captureHeight,
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    cacheBust: true,
    fontEmbedCSS: "",
    style: {
      position: "static",
      left: "auto",
      top: "auto",
      margin: "0",
      transform: "none",
      width: `${PAGE_WIDTH_PX}px`,
      height: `${captureHeight}px`,
    },
  });

  // Load into an Image so we can slice per-page.
  const img = await loadImage(dataUrl);
  const imgW = img.width;
  const imgH = img.height;
  const pxPerPage = Math.round((PAGE_HEIGHT_PX / PAGE_WIDTH_PX) * imgW);

  // Single-page PDF: keep Letter width, extend page height to fit full content + footer breathing room.
  const contentHeightPt = (imgH / imgW) * PDF_WIDTH_PT;
  const FOOTER_PADDING_PT = 72; // ~1 inch of bottom breathing space
  const pageHeightPt = Math.max(PDF_HEIGHT_PT, contentHeightPt + FOOTER_PADDING_PT);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: [PDF_WIDTH_PT, pageHeightPt],
    compress: true,
  });

  pdf.addImage(dataUrl, "PNG", 0, 0, PDF_WIDTH_PT, contentHeightPt, undefined, "FAST");
  pdf.save(`${safeFileName(name)}.pdf`);
  void pxPerPage;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function safeFileName(value: string) {
  const cleaned = value.replace(/[\\/:*?"<>|]+/g, "_").trim();
  return cleaned || "Resume";
}
