"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Activity } from "@/types/activityTypes";

interface Props {
  activity: Activity | null;
  onClose: () => void;
}

export default function ActivityView({ activity, onClose }: Props) {
  const [isImageOpen, setIsImageOpen] = useState(false);

  if (!activity) return null;

  const imageSrc = activity.data
    ? `data:image/${activity.file_name?.endsWith(".svg") ? "svg+xml" : "png"};base64,${activity.data}`
    : "/placeholder.png";

  return (
    <div
      className="space-y-4 mt-2 max-w-lg mx-auto p-4 sm:p-6 bg-white dark:bg-black dark:text-white rounded-lg overflow-auto"
      style={{ maxHeight: "90vh" }}
    >
      <div className="flex items-center gap-4">
        <Image
          src={imageSrc}
          alt={activity.title}
          width={80}
          height={80}
          className="rounded-md object-cover border cursor-pointer"
          onClick={() => setIsImageOpen(true)} 
        />
        <div>
          <p className="font-medium text-gray-800 dark:text-white">
            {activity.title}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        {activity.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-gray-800 dark:text-white">
              Description:
            </span>{" "}
            {activity.description}
          </p>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-gray-800 dark:text-white">
            File name:
          </span>{" "}
          {activity.file_name || "N/A"}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-gray-800 dark:text-white">
            Created By:
          </span>{" "}
          {activity?.creator?.name || "N/A"}
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
      {isImageOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative">
            <Image
              src={imageSrc}
              alt="Expanded Activity Image"
              width={600}
              height={600}
              className="rounded-lg object-contain max-h-[80vh] max-w-[90vw]"
            />
            <button
              onClick={() => setIsImageOpen(false)}
              className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg text-gray-800 dark:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
