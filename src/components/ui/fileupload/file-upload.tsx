"use client";
import React, { JSX, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { imageSchema } from "@/validations/imageSchema";
import { showError, showSuccess } from "@/lib/utils/toast";
import { uploadBanner, updateBanner } from "@/store/api/bannerApi";
import { MESSAGES } from "@/components/common/constants/utlis";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadCloud } from "lucide-react";


const mainVariant = { initial: { x: 0, y: 0 }, animate: { x: 20, y: -20, opacity: 0.9 } };



interface FileUploadProps {
  onChange?: (files: File[], type: string) => void;
  mode?: "create" | "edit";
  initialBanner?: {
    id: number;
    title: string;
    description?: string;
    status?: string;
    data?: string;
    file_name?: string;
  };
  onSuccess?: () => void;
}


export const FileUpload: React.FC<FileUploadProps> = ({
  onChange,
  mode = "create",
  initialBanner,
  onSuccess,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [type] = useState<string>("banner");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();


  const validateFile = async (file: File): Promise<boolean> => {
    try {
      await imageSchema.parseAsync({ image: file });
      setError(null);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) setError(err.errors[0].message);
      return false;
    }
  };


  const handleFileChange = async (newFiles: File[]) => {
    const validFiles: File[] = [];
    for (const file of newFiles) if (await validateFile(file)) validFiles.push(file);
    if (validFiles.length > 0) {
      setFiles(validFiles);
      onChange?.(validFiles, type);
    }
  };

  const handleClick = () => fileInputRef.current?.click();

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "create" && files.length === 0) {
      setError("Please select a file");
      return;
    }

    try {
      setUploading(true);
      const title = initialBanner?.title || "My Banner";
      const description = initialBanner?.description;
      const status = initialBanner?.status;

      if (mode === "edit" && initialBanner) {
        await updateBanner(initialBanner.id, {
          title,
          description,
          status,
          file: files[0],
        });
      } else {
        await uploadBanner(files[0], { title, description, status });
      }

      showSuccess(mode === "edit" ? MESSAGES.EDIT_SUCCESS : MESSAGES.ADD_SUCCESS);
      router.push("/banner-table");
      onSuccess?.();
      setFiles([]);
    }
    catch (err: unknown) {
      console.error("Upload failed", err);
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Failed to upload banner";
      showError(errorMessage);
    }

    finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.push("/banner-table");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [router]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto bg-white dark:bg-neutral-900 shadow-md rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-center text-neutral-800 dark:text-neutral-200">
        Upload Form
      </h2>

      <div className="w-full" {...getRootProps()}>
        <motion.div
          onClick={handleClick}
          whileHover="animate"
          className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
            className="hidden"
          />
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
            <GridPattern />
          </div>

          <div className="flex flex-col items-center justify-center">
            <p className="relative z-20 font-bold text-neutral-700 dark:text-neutral-300 text-base">
              Upload file
            </p>
            <p className="relative z-20 text-neutral-400 mt-2">
              Drag or drop your files here or click to upload
            </p>

            {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

            <div className="relative w-full mt-10 max-w-xl mx-auto">
              {files.length > 0 ? (
                files.map((file, idx) => (
                  <motion.div
                    key={idx}
                    layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                    className="relative overflow-hidden bg-white dark:bg-neutral-900 flex flex-col p-4 mt-4 w-full rounded-md shadow-sm"
                  >
                    <div className="flex justify-between w-full items-center gap-4">
                      <p className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs">{file.name}</p>
                      <p className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : mode === "edit" && initialBanner?.data ? (
                <div className="mt-4 flex flex-col items-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Current Image</p>
                  <Image
                    src={`data:image/png;base64,${initialBanner.data}`}
                    alt={initialBanner.title || "Banner image"}
                    fill
                    className="object-cover rounded-md border"
                  />
                </div>
              ) : (
                <motion.div
                  layoutId="file-upload"
                  variants={mainVariant}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative group-hover/file:shadow-2xl bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                >
                  {isDragActive ? (
                    <motion.p className="text-neutral-600 flex flex-col items-center">
                      Drop it
                      <UploadCloud className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
                    </motion.p>
                  ) : (
                    <UploadCloud className="h-6 w-6 text-neutral-600 dark:text-neutral-300" />
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-md"
      >
        {uploading ? "Uploading..." : "Upload Files"}
      </button>
    </form>
  );
};


export function GridPattern(): JSX.Element {
  const columns = 41;
  const rows = 11;

  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${index % 2 === 0
                ? "bg-gray-50 dark:bg-neutral-950"
                : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
                }`}
            />
          );
        })
      )}
    </div>
  );
}
