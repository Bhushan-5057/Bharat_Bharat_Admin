"use client";

import React, { useState } from "react";
import Image from "next/image";
import { OfficeBearer } from "@/types/officeBearerTypes";
import { getMediaUrl } from "@/utils/mediaUrl";
import ImagePreviewModal from "@/components/common/ImagePreviewModal";

interface Props {
  bearer: OfficeBearer | null;
  onClose?: () => void;
}

export default function OfficeBearerView({ bearer }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!bearer) return null;

  const imageSrc = getMediaUrl(bearer) || null;

  return (
    <>
      <div className="relative w-full rounded-2xl bg-white p-5 dark:bg-gray-900 sm:p-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {bearer.title}
          </h2>
          {bearer.designation && (
            <p className="mt-1 text-base text-gray-500 dark:text-gray-400">
              {bearer.designation}
            </p>
          )}
        </div>

        <div className="mt-6 space-y-4">
          {bearer.quotes && (
            <div>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                Quotes
              </p>
              <p className="mt-1 whitespace-pre-wrap break-words leading-7 text-gray-600 dark:text-gray-300">
                {bearer.quotes}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Designation
              </p>
              <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
                {bearer.designation || "N/A"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="mt-1 break-all text-base font-medium text-gray-800 dark:text-white">
                {bearer.gmail || "N/A"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Facebook
              </p>
              {bearer.facebook ? (
                <a
                  href={bearer.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block break-all text-base font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  {bearer.facebook}
                </a>
              ) : (
                <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
                  N/A
                </p>
              )}
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Twitter
              </p>
              {bearer.twitter ? (
                <a
                  href={bearer.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block break-all text-base font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  {bearer.twitter}
                </a>
              ) : (
                <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
                  N/A
                </p>
              )}
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800 sm:col-span-2">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Created By
              </p>
              <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
                {bearer.creator?.name || "N/A"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              Image
            </p>
            {imageSrc ? (
              <button
                type="button"
                onClick={() => setSelectedImage(imageSrc)}
                className="relative mt-3 h-48 w-full max-w-sm cursor-pointer overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 transition hover:opacity-90"
                aria-label={`View ${bearer.title} image`}
              >
                <Image
                  src={imageSrc}
                  alt={bearer.title}
                  fill
                  unoptimized
                  className="object-contain bg-gray-50 dark:bg-gray-800"
                />
              </button>
            ) : (
              <div className="mt-3 flex h-48 w-full max-w-sm items-center justify-center rounded-xl bg-gray-200 text-sm text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                No Image
              </div>
            )}
          </div>
        </div>
      </div>

      <ImagePreviewModal
        src={selectedImage}
        alt={bearer.title}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}
