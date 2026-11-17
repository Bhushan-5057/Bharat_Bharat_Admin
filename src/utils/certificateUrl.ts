import { Publication } from "@/types/publicationTypes";
import { getNamedPdfViewerUrl, openPdfInNewTab } from "@/utils/pdfView";

type CertificateLike = Pick<
  Publication,
  | "url"
  | "cloudinary_url"
  | "cloudinary_public_id"
  | "cloudinary_resource_type"
  | "data"
  | "file_name"
> & { id?: number | string | null };

function apiCertificateStreamUrl(id: number | string): string {
  const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
  if (!base) return "";
  return `${base}/certificate/get/${id}`;
}

export function isViewablePdfUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/**
 * Browser-viewable certificate PDF URL.
 * Prefer the API inline stream (`record.url` / GET /certificate/get/:id)
 * so the browser displays the PDF instead of downloading it.
 */
export function getCertificatePdfUrl(
  record?: CertificateLike | null
): string {
  if (!record) return "";

  const directUrl = typeof record.url === "string" ? record.url.trim() : "";
  if (directUrl) return directUrl;

  if (record.id != null && String(record.id) !== "") {
    const streamUrl = apiCertificateStreamUrl(record.id);
    if (streamUrl) return streamUrl;
  }

  const cloudinaryUrl =
    typeof record.cloudinary_url === "string" ? record.cloudinary_url.trim() : "";
  if (cloudinaryUrl.includes("/raw/upload/")) return cloudinaryUrl;

  return "";
}

export function getCertificateViewerHref(
  record?: CertificateLike | null
): string {
  const pdfUrl = getCertificatePdfUrl(record);
  if (!pdfUrl) return "";
  return getNamedPdfViewerUrl(pdfUrl, record?.file_name);
}

export function openCertificatePdf(record?: CertificateLike | null): boolean {
  const pdfUrl = getCertificatePdfUrl(record);
  if (!pdfUrl) return false;
  return openPdfInNewTab(pdfUrl, record?.file_name);
}
