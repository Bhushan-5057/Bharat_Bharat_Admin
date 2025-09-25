"use client";

import React, { useEffect, useState } from "react";
import { Education } from "@/types/educationTypes";
import { Label } from "@/components/ui/label/label";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

type EducationViewProps = {
  education: Education;
  onClose: () => void;
};

export default function EducationView({ education }: EducationViewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();


  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === 'Backspace') {
        router.push("/education-table");
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
          <Label className="text-gray-500 dark:text-gray-400">Title</Label>
          <p className="text-gray-900 dark:text-gray-200">{education.title || "N/A"}</p>
        </div>

        <div className="space-y-1">
          <Label className="text-gray-500 dark:text-gray-400">Description</Label>
          <p className="text-gray-900 dark:text-gray-200">{education.description || "N/A"}</p>
        </div>
        <div className="space-y-1">
          <Label className="text-gray-500 dark:text-gray-400">Type</Label>
          {education.type ? (
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                education.type === "school"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
              )}
            >
              {education.type}
            </span>
          ) : (
            <span className="text-gray-400">Not Provided</span>
          )}
        </div>
        {education.type === "school" && (
          <div className="space-y-1">
            <Label className="text-gray-500 dark:text-gray-400">School Address</Label>
            <p className="text-gray-900 dark:text-gray-200">
              {education.school_address || "Not Provided"}
            </p>
          </div>
        )}


        <div className="space-y-1">
          <Label className="text-gray-500 dark:text-gray-400">Created By</Label>
          <p className="text-gray-900 dark:text-gray-200">
            {education.creator?.name || "N/A"}
          </p>
        </div>


        <div className="space-y-1">
          <Label className="text-gray-500 dark:text-gray-400">Images</Label>
          {education.images && education.images.length > 0 ? (
            <div className="mt-2 flex gap-3 overflow-x-auto pb-2">
              {education.images.map((img, i) => {
                const src = img.data
                  ? `data:image/png;base64,${img.data}`
                  : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${img.file_name}`;
                return (
                  <div
                    key={i}
                    className="relative w-28 h-28 flex-shrink-0 cursor-pointer"
                    onClick={() => setSelectedImage(src)}
                  >
                    <Image
                      src={src}
                      alt={`education-image-${i}`}
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
                alt="Selected Education"
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
    </div>

  );
}
