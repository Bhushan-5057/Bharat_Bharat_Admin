"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Event } from "@/types/eventTypes";

interface Props {
  event: Event | null;
  onClose: () => void;
}

export default function EventView({
  event,
  onClose,
}: Props) {
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  if (!event) return null;

  const formattedDate = (() => {
    if (!event.event_date) return "N/A";

    const parsedDate = new Date(
      event.event_date
    );

    if (
      Number.isNaN(parsedDate.getTime())
    ) {
      return event.event_date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  })();

  const imageSrc = event.data
    ? `data:image/${
        event.file_name?.endsWith(".svg")
          ? "svg+xml"
          : "png"
      };base64,${event.data}`
    : "/placeholder.png";

  const formatTime = (value?: string) => {
    if (!value) return "N/A";
    const [hourText = "0", minuteText = "0"] = value.split(":");
    const hour = Number(hourText);
    const minute = Number(minuteText);

    if (
      Number.isNaN(hour) ||
      Number.isNaN(minute) ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      return value;
    }

    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formattedTimeRange =
    event.start_time && event.end_time
      ? `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`
      : "N/A";

  return (
    <>
      {/* Main Modal */}
      <div className="relative w-full max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-gray-900 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          
          <div
            className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-xl border border-gray-200"
            onClick={() =>
              setIsModalOpen(true)
            }
          >
            <Image
              src={imageSrc}
              alt={event.title}
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-4">
          
          {event.description && (
            <div>
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                Description
              </p>

              <p className="mt-1 leading-7 text-gray-600 dark:text-gray-300">
                {event.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            
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
                Time
              </p>

              <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
                {formattedTimeRange}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Venue
              </p>

              <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
                {event.venue || "N/A"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                File Name
              </p>

              <p className="mt-1 text-base font-medium text-gray-800 dark:text-white break-all">
                {event.file_name || "N/A"}
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800 sm:col-span-2">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Created By
              </p>

              <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
                {event?.creator?.name || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>

      {/* Image Preview Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4"
          onClick={() =>
            setIsModalOpen(false)
          }
        >
          <div
            className="relative"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <Image
              src={imageSrc}
              alt={event.title}
              width={700}
              height={700}
              unoptimized
              className="max-h-[85vh] rounded-2xl object-contain"
            />

            <button
              onClick={() =>
                setIsModalOpen(false)
              }
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-bold text-black shadow-lg transition hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
