"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import Button from "@/components/ui/button/Button";
import { showError, showSuccess } from "@/lib/utils/toast";
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
      const errorMessage = err && typeof err === "object" && "message" in err
        ? (err as { message: string }).message
        : MESSAGES.ADD_ERROR;
      showError(errorMessage);
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

      <div className="space-y-2">
        <Label htmlFor="file_name">Image (SVG only)</Label>
        <Input id="file_name" type="file" accept="image/svg+xml" onChange={handleFileChange} />
        {errors.file_name?.message && <p className="text-red-600 text-sm">{String(errors.file_name.message)}</p>}

        {preview && (

          <div className="relative mt-2 h-24 w-24">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="rounded-md object-contain border"
              unoptimized={true}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
