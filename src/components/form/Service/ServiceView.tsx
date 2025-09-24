"use client";

import React from "react";
import Image from "next/image";
import { Service } from "@/types/serviceTypes";

interface Props {
  service: Service | null;
  onClose: () => void;
}

export default function ServiceView({ service, onClose }: Props) {
  if (!service) return null;


  const imageSrc = service.data
    ? `data:image/${service.file_name?.endsWith(".svg") ? "svg+xml" : "png"};base64,${service.data}`
    : "/placeholder.png"; 

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
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-semibold text-gray-800 dark:text-white">Description:</span>{" "}
            {service.description}
          </p>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-gray-800 dark:text-white">File name:</span>{" "}
          {service.file_name || "N/A"}
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
    </div>
  );
}
