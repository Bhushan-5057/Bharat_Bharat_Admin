"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Blog } from "@/types/blogTypes";
import { Button } from "@/components/ui/button";

type BlogViewProps = {
  blog: Blog;
  onClose: () => void;
};

export default function BlogView({ blog, onClose }: BlogViewProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const handleImageClick = () => {
    setImageModalOpen(true);
  };

  const handleImageClose = () => {
    setImageModalOpen(false);
  };

  const imageSrc = blog.data
    ? `data:image/png;base64,${blog.data}`
    : blog.file_name
      ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${blog.file_name}`
      : null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{blog.title || "Untitled Blog"}</h2>
      </div>
      {imageSrc ? (
        <div
          className="relative w-full h-64 rounded-md overflow-hidden cursor-pointer"
          onClick={handleImageClick}
        >
          <Image
            src={imageSrc}
            alt={blog.title}
            fill
            objectFit="cover"
            className="rounded-md"
            priority
          />
        </div>
      ) : (
        <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
          No Image
        </div>
      )}


      {imageModalOpen && imageSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={handleImageClose}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imageSrc}
              alt={blog.title}
              width={1200}
              height={800}
              className="rounded-md max-h-[90vh] object-contain"
            />
            <button
              onClick={handleImageClose}
              className="absolute top-2 right-2 z-50 w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p><strong>Category:</strong> {blog.category || "N/A"}</p>
        <p><strong>Tags:</strong> {blog.tags || "N/A"}</p>
        <p><strong>Created By:</strong> {blog.creator?.name || "N/A"}</p>
        <p><strong>Meta Title:</strong> {blog.meta_title || "N/A"}</p>
        <p><strong>Meta Description:</strong> {blog.meta_description || "N/A"}</p>
      </div>
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Content</h3>
        <p className="whitespace-pre-wrap">{blog.content || "No content available."}</p>
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}

