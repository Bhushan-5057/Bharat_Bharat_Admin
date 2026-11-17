"use client";

import React from "react";
import Image from "next/image";
import { Service } from "@/types/serviceTypes";
import { getMediaUrl } from "@/utils/mediaUrl";

interface Props {
  service: Service | null;
  onClose?: () => void;
}

export default function ServiceView({ service }: Props) {
  if (!service) return null;

  const imageSrc = getMediaUrl(service) || "/placeholder.png";

  return (
    <div className="space-y-4 p-4">

      <div className="flex items-center gap-4">
        <Image
          src={imageSrc}
          alt={service.title}
          width={80}
          height={80}
          className="rounded-md object-cover border"
        />
        <div>
          <p className="font-medium text-gray-800 dark:text-white">{service.title}</p>
        </div>
      </div>


      <div className="space-y-2">
        {service.description && (
          <p className="whitespace-pre-wrap break-words text-sm text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-gray-800 dark:text-white">Description:</span>{" "}
            {service.description}
          </p>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-gray-800 dark:text-white">File name:</span>{" "}
          {service.file_name || "N/A"}
        </p>
      </div>


    </div>
  );
}
