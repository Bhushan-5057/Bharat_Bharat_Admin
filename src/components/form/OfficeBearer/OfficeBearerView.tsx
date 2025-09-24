"use client";

import React, { useState } from "react";
import Image from "next/image";
import { OfficeBearer } from "@/types/officeBearerTypes";

interface Props {
  bearer: OfficeBearer | null;
  onClose: () => void;
}

export default function OfficeBearerView({ bearer, onClose }: Props) {
  const [isImageOpen, setIsImageOpen] = useState(false);

  if (!bearer) return null;

  const imageSrc = bearer.data
    ? `data:image/png;base64,${bearer.data}`
    : bearer.file_name
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${bearer.file_name}`
    : "/placeholder.png";

  return (
    <div className="space-y-4 p-4 max-w-md mx-auto bg-white dark:bg-black dark:text-white rounded-lg overflow-auto">
      {/* Thumbnail + Info */}
      <div className="flex items-center gap-4">
        <Image
          src={imageSrc}
          alt={bearer.title}
          width={80}
          height={80}
          className="rounded-[25%] object-cover border cursor-pointer"
          onClick={() => setIsImageOpen(true)} // open modal
        />
        <div className="flex flex-col">
          <p className="font-medium text-gray-800 dark:text-white">{bearer.title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">{bearer.designation}</p>
        </div>
      </div>

      {/* Quotes */}
      {bearer.quotes && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-gray-800 dark:text-white">Quotes:</span>{" "}
          {bearer.quotes}
        </p>
      )}

      {/* Social Links */}
      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
        {bearer.gmail && (
          <p>
            <span className="font-semibold text-gray-800 dark:text-white">Email:</span>{" "}
            {bearer.gmail}
          </p>
        )}
        {bearer.facebook && (
          <p>
            <span className="font-semibold text-gray-800 dark:text-white">Facebook:</span>{" "}
            <a
              href={bearer.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {bearer.facebook}
            </a>
          </p>
        )}
        {bearer.twitter && (
          <p>
            <span className="font-semibold text-gray-800 dark:text-white">Twitter:</span>{" "}
            <a
              href={bearer.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {bearer.twitter}
            </a>
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 
                     dark:bg-gray-700 dark:hover:bg-gray-600 
                     text-sm font-medium text-gray-800 dark:text-white"
        >
          Close
        </button>
      </div>

      {/* Image Modal */}
      {isImageOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative">
            <Image
              src={imageSrc}
              alt="Expanded Office Bearer"
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
