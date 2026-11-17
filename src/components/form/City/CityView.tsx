"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label/label";
import Image from "next/image";
import { X } from "lucide-react";
import { City } from "@/types/cityTypes";
import { useRouter } from "next/navigation";
import { getMediaUrl } from "@/utils/mediaUrl";

type CityViewProps = {
  city: City;
  onClose: () => void;
};

export default function CityView({ city }: CityViewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === 'Backspace') {
        router.push("/city-table");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [router]);

  return (
    <div className="">
      <div className="space-y-6">
        <div className="space-y-1">
          <Label className="text-gray-500 dark:text-gray-400">State</Label>
          <p className="text-gray-900 dark:text-gray-200">{city.state || "N/A"}</p>
        </div>
        <div className="space-y-1">
          <Label className="text-gray-500 dark:text-gray-400">Name</Label>
          <p className="text-gray-900 dark:text-gray-200">{city.title || "N/A"}</p>
        </div>
        <div className="space-y-1">
          <Label className="text-gray-500 dark:text-gray-400">Description</Label>
          <p className="whitespace-pre-wrap break-words text-gray-900 dark:text-gray-200">{city.description || "N/A"}</p>
        </div>
        <div className="space-y-1">
          <Label className="text-gray-500 dark:text-gray-400">Created By</Label>
          <p className="text-gray-900 dark:text-gray-200">
            {city.creator?.name || "N/A"}
          </p>
        </div>
        <div className="space-y-1">
          <Label className="text-gray-500 dark:text-gray-400">Contact persons</Label>
          {city.contacts && city.contacts.length > 0 ? (
            <div className="mt-2 space-y-3">
              {city.contacts.map((contact, index) => (
                <div
                  key={contact.id ?? index}
                  className="rounded-lg border border-gray-200 p-3 dark:border-white/[0.08]"
                >
                  <p className="text-gray-900 dark:text-gray-200">
                    {contact.person_name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {contact.contact_number || "N/A"}
                    {contact.email ? ` · ${contact.email}` : ""}
                  </p>
                  {contact.designation ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {contact.designation}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No contact persons</p>
          )}
        </div>
        <div className="space-y-1">
          <Label className="text-gray-500 dark:text-gray-400">Images</Label>
          {city.images && city.images.length > 0 ? (
            <div className="mt-2 flex gap-3 overflow-x-auto pb-2">
              {city.images.map((img, i) => {
                const src = getMediaUrl(img);
                if (!src) return null;
                return (
                  <div
                    key={i}
                    className="relative w-28 h-28 flex-shrink-0 cursor-pointer"
                    onClick={() => setSelectedImage(src)}
                  >
                    <Image
                      src={src}
                      alt={`city-image-${i}`}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400">No Images</p>
          )}
        </div>
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 bg-white/10 dark:bg-black/60 z-40 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[80vh] flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Selected City"
              width={400}
              height={300}
              className="rounded-lg object-contain shadow-md"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 bg-gray-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

    </div>

  );
}
