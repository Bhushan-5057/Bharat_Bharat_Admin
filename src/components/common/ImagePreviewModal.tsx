"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

type ImagePreviewModalProps = {
  src: string | null;
  alt: string;
  onClose: () => void;
};

export default function ImagePreviewModal({
  src,
  alt,
  onClose,
}: ImagePreviewModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!src) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [src, onClose]);

  if (!src || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          unoptimized
          className="max-h-[85vh] w-auto max-w-[90vw] rounded-2xl object-contain"
        />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-bold text-black shadow-lg transition hover:bg-gray-200"
          aria-label="Close image preview"
        >
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
}
