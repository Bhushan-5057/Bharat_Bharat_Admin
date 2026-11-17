"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input/input";
import { Textarea } from "@/components/ui/textarea/textarea";
import { FormField, FormSection } from "@/components/ui/form-field";
import Button from "@/components/ui/button/Button";
import { showApiError, showSuccess } from "@/lib/utils/toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/redux/store";
import { CreateServiceFormData, createServiceSchema } from "@/validations/serviceSchema";
import { MESSAGES } from "@/components/common/constants/utlis";
import { createServiceThunk, fetchAllServicesThunk } from "@/store/redux/slice/serviceSlice";
import Image from "next/image";

export default function AddServiceForm({ closeModal }: { closeModal?: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateServiceFormData>({
    resolver: zodResolver(createServiceSchema),
  });

  const watchFile = watch("file_name");
  useEffect(() => {
    if (watchFile && watchFile.length > 0) {
      setPreview(URL.createObjectURL(watchFile[0]));
    } else {
      setPreview(null);
    }
  }, [watchFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file: File = e.target.files[0];

    if (file.type !== "image/svg+xml") {
      setError("file_name", { type: "manual", message: "Only SVG files are allowed." });
      return;
    }

    setValue("file_name", [file], { shouldValidate: true });
  };

  const onSubmit = async (data: CreateServiceFormData) => {
    if (!data.file_name || data.file_name.length === 0) {
      setError("file_name", { type: "manual", message: "Please select a file." });
      return;
    }

    try {
      const payload = {
        title: data.title || "",
        description: data.description || "",
        file_name: data.file_name[0],
      };

      await dispatch(createServiceThunk(payload)).unwrap();
      await dispatch(fetchAllServicesThunk());

      showSuccess(MESSAGES.ADD_SUCCESS);
      closeModal?.();
      reset();
      setPreview(null);
    } catch (err: unknown) {
      console.error("Add service failed:", err);
      showApiError(err, MESSAGES.ADD_ERROR);
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
      <FormField label="Image" htmlFor="file_name" required hint="SVG only" error={errors.file_name?.message ? String(errors.file_name.message) : undefined}>
        <Input id="file_name" type="file" accept="image/svg+xml" onChange={handleFileChange} />
        {preview ? (
          <div className="relative mt-2 h-28 w-28 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <Image
              src={preview}
              alt="Selected image preview"
              fill
              className="object-contain p-2"
              unoptimized={true}
            />
          </div>
        ) : (
          <p className="text-xs text-gray-500">No image selected</p>
        )}
      </FormField>
      </FormSection>

      <div className="flex justify-end gap-2">
        {closeModal ? (
          <Button variant="outline" type="button" onClick={closeModal} disabled={isSubmitting}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
