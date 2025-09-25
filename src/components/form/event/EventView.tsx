"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Event } from "@/types/eventTypes";

interface Props {
  event: Event | null;
  onClose: () => void;
}

export default function EventView({ event, onClose }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!event) return null;

  const imageSrc = event.data
    ? `data:image/${event.file_name?.endsWith(".svg") ? "svg+xml" : "png"};base64,${event.data}`
    : "/placeholder.png";

  return (
    <div
      className="space-y-4 mt-2 max-w-lg mx-auto p-4 sm:p-6 bg-white dark:bg-black dark:text-white rounded-lg overflow-auto"
      style={{ maxHeight: "90vh" }}
    >
      <div className="flex items-center gap-4">
        <Image
          src={imageSrc}
          alt={event.title}
          width={80}
          height={80}
          className="rounded-md object-cover border cursor-pointer"
          onClick={() => setIsModalOpen(true)} 
        />
        <div>
          <p className="font-medium text-gray-800 dark:text-white">{event.title}</p>
        </div>
      </div>
      <div className="space-y-2">
        {event.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-gray-800 dark:text-white">Description:</span>{" "}
            {event.description}
          </p>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-gray-800 dark:text-white">File name:</span>{" "}
          {event.file_name || "N/A"}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-gray-800 dark:text-white">Created By:</span>{" "}
          {event?.creator?.name || "N/A"}
        </p>
      </div>
      <div className="pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 
            dark:bg-gray-700 dark:hover:bg-gray-600 
            text-sm font-medium text-gray-800 dark:text-white"
        >
          Close
        </button>
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)} 
        >
          <div className="relative">
            <Image
              src={imageSrc}
              alt={event.title}
              width={600}
              height={600}
              className="rounded-lg max-h-[80vh] object-contain"
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 bg-white text-black rounded-full px-2 py-1 text-sm font-medium shadow"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
