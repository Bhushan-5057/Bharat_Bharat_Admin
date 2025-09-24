"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/redux/store";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import Button from "@/components/ui/button/Button";
import { useDropzone } from "react-dropzone";
import { motion } from "motion/react";
import { showError, showSuccess } from "@/lib/utils/toast";
import { createServiceSchema, CreateServiceFormData } from "@/validations/serviceSchema";
import { updateServiceThunk, fetchAllServicesThunk } from "@/store/redux/slice/serviceSlice";
import { UpdateServicePayload } from "@/store/api/serviceApi";
import { MESSAGES } from "@/components/common/constants/utlis";
import Image from "next/image";
import { X } from "lucide-react";

interface EditServiceFormProps {
  service: {
    id: string;
    title: string;
    description?: string;
    file_name?: string;
    data?: string;
  };
  closeModal?: () => void;
}

export default function EditServiceForm({ service, closeModal }: EditServiceFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | null>(
    service.data ? `data:image/svg+xml;base64,${service.data}` : service.file_name ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${service.file_name}` : null
  );
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CreateServiceFormData>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      title: service.title || "",
      description: service.description || "",
      file_name: undefined,
      existingImage: !!service.file_name || !!service.data,
    },
  });

  useEffect(() => {
    reset({
      title: service.title,
      description: service.description,
      existingImage: !!service.file_name || !!service.data,
    });
  }, [service, reset]);

  const handleFileChange = (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    const file: File = newFiles[0];

    if (file.type !== "image/svg+xml") {
      setError("Only SVG files are allowed");
      setFiles([]);
      setPreview(null);
      setValue("file_name", undefined, { shouldValidate: true });
      return;
    }

    setFiles([file]);
    setValue("file_name", [file], { shouldValidate: true });
    setError(null);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    accept: { "image/svg+xml": [] },
    onDrop: handleFileChange,
  });

  const handleClick = () => fileInputRef.current?.click();

  const onSubmit = async (data: CreateServiceFormData) => {
    if (files.length === 0 && !service.file_name && !service.data) {
      setError("Please select a file or keep existing image");
      return;
    }

    try {
      const payload: UpdateServicePayload = {
        id: service.id,
        title: data.title,
        description: data.description || "",
        file_name: files[0] || service.file_name,
      };

      await dispatch(updateServiceThunk(payload)).unwrap();
      await dispatch(fetchAllServicesThunk());

      showSuccess(MESSAGES.EDIT_SUCCESS);
      closeModal?.();
      setFiles([]);
      setPreview(service.data ? `data:image/svg+xml;base64,${service.data}` : service.file_name ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${service.file_name}` : null);
      reset({
        title: data.title,
        description: data.description,
        existingImage: !!service.file_name || !!service.data,
      });
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "message" in err
        ? (err as { message: string }).message
        : MESSAGES.EDIT_ERROR;
      console.error("Service update failed", message);
      showError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Enter service title" {...register("title")} />
        {errors.title && <p className="text-red-600 text-sm">{errors.title?.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          placeholder="Enter service description"
          className="w-full border rounded-md p-2 text-sm"
          {...register("description")}
        />
        {errors.description && <p className="text-red-600 text-sm">{errors.description?.message}</p>}
      </div>

      <div {...getRootProps()} className="space-y-2">
        <Label>Image (SVG only)</Label>
        <div onClick={handleClick} className="cursor-pointer">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/svg+xml"
            onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
            className="hidden"
          />
          <motion.div className="relative w-40 h-40 border rounded-md flex items-center justify-center">
            {preview ? (
              <div className="relative w-full h-full">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-contain rounded-md"
                  unoptimized={true}
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFiles([]);
                    setPreview(null);
                    setValue("file_name", undefined, { shouldValidate: true });
                    setError(null);
                    fileInputRef.current?.click();
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : isDragActive ? (
              <p>Drop the SVG here...</p>
            ) : (
              <p>Click or drag SVG</p>
            )}
          </motion.div>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {errors.file_name?.message && (
          <p className="text-red-600 text-sm">{String(errors.file_name.message)}</p>
        )}
      </div>


      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={closeModal} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update"}
        </Button>
      </div>
    </form>
  );
}
