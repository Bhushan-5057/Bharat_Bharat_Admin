"use client";

import React, { useEffect, useState } from "react";
import { Achievement } from "@/types/achievementTypes";
import { Label } from "@/components/ui/label/label";
import Image from "next/image";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { getMediaUrl } from "@/utils/mediaUrl";

type AchievementViewProps = {
  achievement: Achievement;
  onClose: () => void;
};

export default function AchievementView({ achievement }: AchievementViewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Backspace") {
        router.push("/achievements-table");
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
          <Label className="text-gray-500 dark:text-gray-400">
            Achievement Title
          </Label>
          <p className="text-gray-900 dark:text-gray-200">
            {achievement.title || "N/A"}
          </p>
        </div>

        <div className="space-y-1">
          <Label className="text-gray-500 dark:text-gray-400">Description</Label>
          <p className="whitespace-pre-wrap break-words text-gray-900 dark:text-gray-200">
            {achievement.description || "N/A"}
          </p>
        </div>

        <div className="space-y-1">
          <Label className="text-gray-500 dark:text-gray-400">Address</Label>
          <p className="whitespace-pre-wrap break-words text-gray-900 dark:text-gray-200">
            {achievement.address || "Not Provided"}
          </p>
        </div>

        <div className="space-y-1">
          <Label className="text-gray-500 dark:text-gray-400">Created By</Label>
          <p className="text-gray-900 dark:text-gray-200">
            {achievement.creator?.name || "N/A"}
          </p>
        </div>

        <div className="space-y-1">
          <Label className="text-gray-500 dark:text-gray-400">Images</Label>
          {achievement.images && achievement.images.length > 0 ? (
            <div className="mt-2 flex gap-3 overflow-x-auto pb-2">
              {achievement.images.map((img, i) => {
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
                      alt={`achievement-image-${i}`}
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
                alt="Selected Achievement"
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
