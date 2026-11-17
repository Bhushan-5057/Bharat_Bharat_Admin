"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/redux/store";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { Textarea } from "@/components/ui/textarea/textarea";
import { FormField, FormSection } from "@/components/ui/form-field";
import Button from "@/components/ui/button/Button";
import { useDropzone } from "react-dropzone";
import { motion } from "motion/react";
import { showApiError, showSuccess } from "@/lib/utils/toast";
import { createServiceSchema, CreateServiceFormData } from "@/validations/serviceSchema";
import { updateServiceThunk, fetchAllServicesThunk } from "@/store/redux/slice/serviceSlice";
import { UpdateServicePayload } from "@/store/api/serviceApi";
import { MESSAGES } from "@/components/common/constants/utlis";
import Image from "next/image";
import { X } from "lucide-react";
import { getMediaUrl } from "@/utils/mediaUrl";

interface EditServiceFormProps {
  service: {
    id: string;
    title: string;
    description?: string;
    file_name?: string;
    url?: string | null;
    data?: string | null;
    cloudinary_url?: string | null;
  };
  closeModal?: () => void;
}

export default function EditServiceForm({ service, closeModal }: EditServiceFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string | null>(getMediaUrl(service) || null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CreateServiceFormData>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      title: service.title || "",
      description: service.description || "",
      file_name: undefined,
      existingImage: !!getMediaUrl(service),
    },
  });

  useEffect(() => {
    reset({
      title: service.title,
      description: service.description,
      existingImage: !!getMediaUrl(service),
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
    if (files.length === 0 && !getMediaUrl(service)) {
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
      setPreview(getMediaUrl(service) || null);
      reset({
        title: data.title,
        description: data.description,
        existingImage: !!getMediaUrl(service),
      });
    } catch (err: unknown) {
      console.error("Service update failed", err);
      showApiError(err, MESSAGES.EDIT_ERROR);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4">
      <FormSection title="Basic information">
      <FormField label="Title" htmlFor="title" required error={errors.title?.message}>
        <Input id="title" placeholder="Enter service title" {...register("title")} />
      </FormField>

      <FormField label="Description" htmlFor="description" error={errors.description?.message}>
        <Textarea
          id="description"
          fieldSize="md"
          placeholder="Enter a detailed description of the service, including key features"
          {...register("description")}
        />
      </FormField>
      </FormSection>

      <FormSection title="Media">
      <div {...getRootProps()} className="space-y-2">
        <Label>Image (SVG only)</Label>
        <p className="text-xs text-gray-500">
          {getMediaUrl(service) && files.length === 0 ? "Current saved image" : "Replace or upload an SVG"}
        </p>
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
              <p className="px-3 text-center text-sm text-gray-500">No image uploaded. Click or drag an SVG.</p>
            )}
          </motion.div>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {errors.file_name?.message && (
          <p className="text-red-600 text-sm">{String(errors.file_name.message)}</p>
        )}
      </div>
      </FormSection>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={closeModal} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
