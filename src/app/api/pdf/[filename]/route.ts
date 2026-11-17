import { NextRequest, NextResponse } from "next/server";
import { isAllowedPdfSource, sanitizePdfFileName } from "@/utils/pdfView";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function contentDisposition(fileName: string): string {
  const asciiName = fileName.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "");
  const encoded = encodeURIComponent(fileName);
  return `inline; filename="${asciiName || "document.pdf"}"; filename*=UTF-8''${encoded}`;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename: rawFilename } = await context.params;
  const src = request.nextUrl.searchParams.get("src");

  if (!src || !isAllowedPdfSource(src)) {
    return NextResponse.json({ message: "Invalid PDF source" }, { status: 400 });
  }

  let fileName = rawFilename;
  try {
    fileName = sanitizePdfFileName(decodeURIComponent(rawFilename));
  } catch {
    fileName = sanitizePdfFileName(rawFilename);
  }
  const upstreamHeaders = new Headers();
  const range = request.headers.get("range");
  if (range) upstreamHeaders.set("Range", range);

  const upstream = await fetch(src, {
    headers: upstreamHeaders,
    cache: "no-store",
  });

  if (!upstream.ok && upstream.status !== 206) {
    return NextResponse.json(
      { message: "Unable to load PDF" },
      { status: upstream.status || 502 }
    );
  }

  if (!upstream.body) {
    return NextResponse.json({ message: "Unable to load PDF" }, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") || "application/pdf";
  const headers = new Headers();
  headers.set(
    "Content-Type",
    contentType.toLowerCase().includes("pdf") ? "application/pdf" : "application/pdf"
  );
  headers.set("Content-Disposition", contentDisposition(fileName));
  headers.set("Cache-Control", "private, max-age=300");

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);
  const contentRange = upstream.headers.get("content-range");
  if (contentRange) headers.set("Content-Range", contentRange);
  const acceptRanges = upstream.headers.get("accept-ranges");
  if (acceptRanges) headers.set("Accept-Ranges", acceptRanges);

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });
}
