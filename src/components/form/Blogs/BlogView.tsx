"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Blog } from "@/types/blogTypes";
import { getMediaUrl } from "@/utils/mediaUrl";
import ImagePreviewModal from "@/components/common/ImagePreviewModal";

type BlogViewProps = {
  blog: Blog;
  onClose?: () => void;
};

export default function BlogView({ blog }: BlogViewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const imageSrc = getMediaUrl(blog) || null;

  return (
    <div className="relative w-full rounded-2xl bg-white p-5 dark:bg-gray-900 sm:p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        {blog.title || "Untitled Blog"}
      </h2>

      <div className="mt-6 space-y-4">
        {imageSrc ? (
          <button
            type="button"
            onClick={() => setSelectedImage(imageSrc)}
            className="block max-w-[220px] overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-2 transition hover:opacity-90 dark:border-gray-700 dark:bg-gray-800"
            aria-label={`View ${blog.title || "blog"} image`}
          >
            <Image
              src={imageSrc}
              alt={blog.title || "Blog image"}
              width={400}
              height={280}
              unoptimized
              className="h-40 w-auto max-w-full rounded-lg object-contain"
              priority
            />
          </button>
        ) : (
          <div className="flex h-40 w-40 items-center justify-center rounded-xl bg-gray-200 text-sm text-gray-500 dark:bg-gray-700 dark:text-gray-300">
            No Image
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Category
            </p>
            <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
              {blog.category || "N/A"}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Tags
            </p>
            <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
              {blog.tags || "N/A"}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Created By
            </p>
            <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
              {blog.creator?.name || "N/A"}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Meta Title
            </p>
            <p className="mt-1 text-base font-medium text-gray-800 dark:text-white">
              {blog.meta_title || "N/A"}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800 sm:col-span-2">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Meta Description
            </p>
            <p className="mt-1 whitespace-pre-wrap break-words text-base font-medium text-gray-800 dark:text-white">
              {blog.meta_description || "N/A"}
            </p>
          </div>
        </div>

        <div>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">
            Content
          </p>
          <p className="mt-1 whitespace-pre-wrap leading-7 text-gray-600 dark:text-gray-300">
            {blog.content || "No content available."}
          </p>
        </div>
      </div>

      <ImagePreviewModal
        src={selectedImage}
        alt={blog.title || "Blog image"}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
