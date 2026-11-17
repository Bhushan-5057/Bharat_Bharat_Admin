const DEFAULT_PDF_NAME = "document.pdf";

export function sanitizePdfFileName(name?: string | null): string {
  const raw = (name || "").trim();
  const base = raw.split(/[/\\]/).pop() || "";
  const cleaned = base
    .replace(/[<>:"|?*\u0000-\u001f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return DEFAULT_PDF_NAME;
  return /\.pdf$/i.test(cleaned) ? cleaned : `${cleaned}.pdf`;
}

export function getNamedPdfViewerUrl(
  pdfUrl: string,
  fileName?: string | null
): string {
  if (!pdfUrl) return "";
  const safeName = sanitizePdfFileName(fileName);
  return `/api/pdf/${encodeURIComponent(safeName)}?src=${encodeURIComponent(pdfUrl)}`;
}

export function openPdfInNewTab(
  pdfUrl: string,
  fileName?: string | null
): boolean {
  if (!pdfUrl) return false;
  const viewerUrl = pdfUrl.startsWith("/api/pdf/")
    ? pdfUrl
    : getNamedPdfViewerUrl(pdfUrl, fileName);
  if (!viewerUrl) return false;
  window.open(viewerUrl, "_blank", "noopener,noreferrer");
  return true;
}

export function isAllowedPdfSource(src: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(src);
  } catch {
    return false;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return false;
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  if (apiBase) {
    try {
      const apiUrl = new URL(apiBase);
      if (parsed.hostname === apiUrl.hostname) return true;
    } catch {
      // ignore malformed API base
    }
  }

  const host = parsed.hostname.toLowerCase();
  const path = parsed.pathname.toLowerCase();
  if (
    host.endsWith("cloudinary.com") &&
    (path.includes("/raw/upload/") || path.endsWith(".pdf"))
  ) {
    return true;
  }

  return false;
}
