"use client";

import { EmptyState } from "@/components/ui/empty-state";
import Button from "@/components/ui/button/Button";
import { isViewablePdfUrl } from "@/utils/certificateUrl";
import { openPdfInNewTab } from "@/utils/pdfView";
import { ExternalLink } from "lucide-react";

type PdfViewerProps = {
  src?: string | null;
  title?: string;
  fileName?: string | null;
};

export default function PdfViewer({
  src,
  title = "PDF Viewer",
  fileName,
}: PdfViewerProps) {
  if (!src) {
    return (
      <EmptyState
        title="No PDF document available."
        className="dark:border-white/[0.08] dark:bg-gray-800"
      />
    );
  }

  if (!isViewablePdfUrl(src) && !src.startsWith("/api/pdf/")) {
    return (
      <EmptyState
        title="Unable to load the PDF document."
        className="dark:border-white/[0.08] dark:bg-gray-800"
      />
    );
  }

  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-white/[0.08] dark:bg-gray-900">
      <p className="text-sm font-medium text-gray-800 dark:text-white">{title}</p>
      <Button
        type="button"
        startIcon={<ExternalLink className="h-4 w-4" />}
        onClick={() => openPdfInNewTab(src, fileName || title)}
      >
        Open PDF
      </Button>
    </div>
  );
}
