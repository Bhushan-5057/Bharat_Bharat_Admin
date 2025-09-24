"use client";
import React, { JSX, useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { useDropzone } from "react-dropzone";
import { showError, showSuccess } from "@/lib/utils/toast";
import { MESSAGES } from "@/components/common/constants/utlis";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/redux/store";
import { CreatePhotoPayload, UpdatePhotoPayload, Photo } from "@/store/api/photoApi";
import { addPhoto, editPhoto, getPhotos } from "@/store/redux/slice/photoSlice";
import { Upload } from "lucide-react";


const mainVariant = { initial: { x: 0, y: 0 }, animate: { x: 20, y: -20, opacity: 0.9 } };


interface PhotoUploadProps {
  onChange?: (files: File[]) => void;
  onSuccess?: () => void;
  mode?: "add" | "edit";
  initialPhoto?: Photo; 
}

export const PhotoUploadForm: React.FC<PhotoUploadProps> = ({
  onChange,
  onSuccess,
  mode = "add",
  initialPhoto = null,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewFiles, setPreviewFiles] = useState<Photo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    if (mode === "edit" && initialPhoto) {
      setPreviewFiles([initialPhoto]);
    }
  }, [mode, initialPhoto]);



const handleFileChange = (newFiles: File[]) => {
  if (!newFiles || newFiles.length === 0) return;

  const validFiles: File[] = [];
  const invalidFiles: File[] = [];

  newFiles.forEach((file) => {
    if (
      file.type.startsWith("image/") &&
      file.type !== "image/svg+xml" &&
      file.type !== "image/gif"
    ) {
      validFiles.push(file);
    } else {
      invalidFiles.push(file);
    }
  });

  if (invalidFiles.length > 0) {
    setError("Only JPG, PNG, WEBP etc. are allowed (SVG & GIF are not supported).");
  } else {
    setError(null);
  }

  if (validFiles.length > 0) {
    setFiles(validFiles);
    setPreviewFiles([]);
    onChange?.(validFiles);
  }
};



  const handleClick = () => fileInputRef.current?.click();

  const { getRootProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: true,
    onDrop: handleFileChange,
  });

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (files.length === 0 && mode !== "edit") {
    setError("Please select at least one photo");
    return;
  }

  try {
    setUploading(true);


if (mode === "edit" && initialPhoto) {
  if (files.length === 0) {
    showError("Please select a new photo to update");
    return;
  }

  const payload: UpdatePhotoPayload = {
  file: files[0],     
  
};

  const resultAction = await dispatch(editPhoto({ id: String(initialPhoto.id), payload }));

  if (editPhoto.fulfilled.match(resultAction)) {
    showSuccess(MESSAGES.EDIT_SUCCESS);
    router.push("/gallery/photos-table");
    onSuccess?.(); 
  } else {
    showError(resultAction.payload as string);
  }
}
 else {

      for (const file of files) {
        const payload: CreatePhotoPayload = {
          title: "New Photo",
          description: "",
          status: "active",
        };
        const resultAction = await dispatch(addPhoto({ file, payload }));
          await dispatch(getPhotos());

        if (addPhoto.fulfilled.match(resultAction)) {
          showSuccess("Photo uploaded successfully");
        } else {
          showError(resultAction.payload as string);
        }
      }
      router.push("/gallery/photos-table"); 
      setFiles([]);
      setPreviewFiles([]);
    }

    onSuccess?.();
  } catch (err) {
    console.error("❌ Upload/Update failed", err);
    showError("Failed to save photos");
  } finally {
    setUploading(false);
  }
};




  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto bg-white dark:bg-neutral-900 shadow-md rounded-lg p-6 space-y-6"
    >
    
      <div className="w-full" {...getRootProps()}>
        <motion.div
          onClick={handleClick}
          whileHover="animate"
          className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
            className="hidden"
          />
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
            <GridPattern />
          </div>

          <div className="flex flex-col items-center justify-center">
            <p className="relative z-20 font-bold text-neutral-700 dark:text-neutral-300 text-base">
              Upload Photos
            </p>
            <p className="relative z-20 text-neutral-400 mt-2">
              Drag & drop or click to upload
            </p>

            {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

            <div className="mt-4 flex flex-wrap gap-4 justify-center">
              {files.map((file, idx) => (
                <div key={idx} className="relative w-28 h-28 border rounded-md overflow-hidden">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFiles((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {previewFiles.map((photo, idx) => (
                <div key={`prev-${idx}`} className="relative w-28 h-28 border rounded-md overflow-hidden">
                  <Image
                    src={`data:image/png;base64,${photo.data}`}
                    alt={photo.file_name || "Photo"}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPreviewFiles([])}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {files.length === 0 && previewFiles.length === 0 && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative group-hover/file:shadow-2xl bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md shadow"
              >
                {isDragActive ? (
                  <motion.p className="text-neutral-600 flex flex-col items-center">
                    Drop it
                    <Upload className="h-4 w-4" />
                  </motion.p>
                ) : (
                  <Upload className="h-6 w-6 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-md"
      >
        {uploading ? (mode === "edit" ? "Updating..." : "Uploading...") : mode === "edit" ? "Update Photo" : "Save Photos"}
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
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
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
