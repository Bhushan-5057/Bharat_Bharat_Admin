"use client";

import { Label } from "@/components/ui/label/label";
import Button from "@/components/ui/button/Button";
import { Publication } from "@/types/publicationTypes";
import {
  getCertificatePdfUrl,
  getCertificateViewerHref,
  isViewablePdfUrl,
  openCertificatePdf,
} from "@/utils/certificateUrl";
import { ExternalLink } from "lucide-react";

type CertificateViewProps = {
  certificate: Publication;
};

export default function CertificateView({ certificate }: CertificateViewProps) {
  const pdfUrl = getCertificatePdfUrl(certificate);
  const viewerHref = getCertificateViewerHref(certificate);
  const canOpen = Boolean(viewerHref) && isViewablePdfUrl(pdfUrl);

  const openPdf = () => {
    if (!canOpen) return;
    openCertificatePdf(certificate);
  };

  return (
    <div className="relative w-full rounded-2xl bg-white p-5 dark:bg-gray-900 sm:p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Certificate Details
      </h2>

      <div className="mt-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            <Label className="text-gray-500 dark:text-gray-400">File Name</Label>
            <p className="mt-1 break-all text-base font-medium text-gray-800 dark:text-white">
              {certificate.file_name || "N/A"}
              {canOpen ? (
                <>
                  {" "}
                  <a
                    href={viewerHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-normal text-blue-600 underline dark:text-blue-400"
                  >
                    Open in new tab
                  </a>
                </>
              ) : null}
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            <Label className="text-gray-500 dark:text-gray-400">Created By</Label>
            <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
              {certificate.creator?.name || "N/A"}
            </p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-lg font-semibold text-gray-800 dark:text-white">
            Certificate PDF
          </p>
          {canOpen ? (
            <Button
              type="button"
              startIcon={<ExternalLink className="h-4 w-4" />}
              onClick={openPdf}
            >
              View PDF
            </Button>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No PDF document available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
