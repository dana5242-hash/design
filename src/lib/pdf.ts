import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

interface ClaudeDownloadsCapability {
  save: (request: { filename: string; data: string | Blob | ArrayBuffer | ArrayBufferView }) => Promise<{ status: "saved" }>;
}

declare global {
  interface Window {
    claude?: {
      use: (name: string) => Promise<unknown>;
    };
  }
}

async function getClaudeDownloads(): Promise<ClaudeDownloadsCapability | null> {
  if (typeof window === "undefined" || !window.claude?.use) return null;
  try {
    const capability = await window.claude.use("downloads");
    return (capability as ClaudeDownloadsCapability) ?? null;
  } catch {
    return null;
  }
}

export type PdfExportResult = "saved" | "declined";

export async function exportElementToPdf(element: HTMLElement, filename: string): Promise<PdfExportResult> {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.92);
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // Inside a Claude Artifact, script-driven downloads are inert — use the
  // viewer's file-save capability instead when it's available.
  const downloads = await getClaudeDownloads();
  if (downloads) {
    try {
      const blob = pdf.output("blob");
      await downloads.save({ filename, data: blob });
      return "saved";
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code === "declined") return "declined";
      throw err;
    }
  }

  pdf.save(filename);
  return "saved";
}
