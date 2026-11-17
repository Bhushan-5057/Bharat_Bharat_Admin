"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Event } from "@/types/eventTypes";
import { getDisplayImageUrl, getMediaUrl } from "@/utils/mediaUrl";
import { formatTime12h } from "@/utils/time";
import ImagePreviewModal from "@/components/common/ImagePreviewModal";

interface Props {
  event: Event | null;
  onClose?: () => void;
}

export default function EventView({
  event,
}: Props) {
  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  if (!event) return null;

  const formatDisplayDate = (value?: string | null) => {
    if (!value) return null;

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formattedDate = (() => {
    const start = formatDisplayDate(event.event_date);
    if (!start) return "N/A";

    const end = formatDisplayDate(event.end_date);
    if (!end || end === start) return start;
    return `${start} - ${end}`;
  })();

  const galleryImages =
    event.images && event.images.length > 0
      ? event.images
      : getDisplayImageUrl(event)
        ? [
            {
              id: 0,
              url: getDisplayImageUrl(event),
              file_name: event.file_name,
            },
          ]
        : [];

  return (
    <>
      <div className="relative w-full rounded-2xl bg-white p-5 dark:bg-gray-900 sm:p-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {event.title}
          </h2>
        </div>

        <div className="mt-6 space-y-4">
          {event.description && (
            <div>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                Description
              </p>
              <p className="mt-1 whitespace-pre-wrap break-words leading-7 text-gray-600 dark:text-gray-300">
                {event.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                State / City
              </p>
              <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
                {[event.state, event.venue].filter(Boolean).join(" · ") || "N/A"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Date
              </p>
              <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
                {formattedDate}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Start Time
              </p>
              <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
                {formatTime12h(event.start_time, "N/A")}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                End Time
              </p>
              <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
                {formatTime12h(event.end_time, "N/A")}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                File Name
              </p>
              <p className="mt-1 break-all text-base font-medium text-gray-800 dark:text-white">
                {event.file_name || "N/A"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Created By
              </p>
              <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
                {event?.creator?.name || "N/A"}
              </p>
            </div>
          </div>

          {galleryImages.length > 0 && (
            <div>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                Images
              </p>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {galleryImages.map((img, i) => {
                  const src = getMediaUrl(img);
                  if (!src) return null;
                  return (
                    <button
                      key={img.id || i}
                      type="button"
                      onClick={() => setSelectedImage(src)}
                      className="relative h-48 w-full cursor-pointer overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 transition hover:opacity-90"
                      aria-label={`View ${event.title} image ${i + 1}`}
                    >
                      <Image
                        src={src}
                        alt={event.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <ImagePreviewModal
        src={selectedImage}
        alt={event.title}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}
