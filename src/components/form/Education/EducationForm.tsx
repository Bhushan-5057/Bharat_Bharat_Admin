"use client";

import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/redux/store";

import { cn } from "@/lib/utils";
import { addEducation, getAllEducations } from "@/store/redux/slice/educationSlice";
import { Label } from "@/components/ui/label/label";
import { Input } from "@/components/ui/input/input";
import Button from "@/components/ui/button/Button";
import { EducationFormValues, educationSchema } from "@/validations/educationSchema";
import { CreateEducationPayload } from "@/types/educationTypes";
import { showError, showSuccess } from "@/lib/utils/toast";
import { MESSAGES } from "@/components/common/constants/utlis";
import Image from "next/image";

type EducationFormProps = {
  closeModal?: () => void;
};

export default function EducationForm({ closeModal }: EducationFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.education);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);
  const [allowMultiple, setAllowMultiple] = useState(false);

  useEffect(() => {
    dispatch(getAllEducations());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: { type: undefined },
  });

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    let files = Array.from(e.target.files);

    if (!allowMultiple) files = files.slice(0, 1);

    const existingFiles = (watch("file_name") || []) as File[];
    const updatedFiles = [...existingFiles, ...files];

    setValue("file_name", updatedFiles as [File, ...File[]], { shouldValidate: true });
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    if (mainImageIndex === null) {

      setMainImageIndex(0);
    }
  };

  const onSubmit: SubmitHandler<EducationFormValues> = async (data) => {
    if (!data.file_name || data.file_name.length === 0) {
      showError("Please select at least one image.");
      return;
    }

    const payload: CreateEducationPayload = {
      title: data.title,
      description: data.description,
      type: data.type!,
      school_address: data.school_address,
      file_name: data.file_name || [],
      mainImageIndex: mainImageIndex ?? 0,
    };


    try {
      await dispatch(addEducation(payload)).unwrap();
      await dispatch(getAllEducations());
      showSuccess(MESSAGES.ADD_SUCCESS);
      reset();
      setImagePreviews([]);
      setMainImageIndex(null);
      setAllowMultiple(false);
      if (closeModal) closeModal();
    } catch (err: unknown) {
      console.error("Failed to save education:", err);
      let message = MESSAGES.ADD_ERROR;
      if (err instanceof Error) message = err.message;
      showError(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 mt-4 overflow-y-hidden p-6 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 max-w-3xl mx-auto w-full"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <Label htmlFor="title" className="sm:w-1/4">Title</Label>
        <div className="flex-1">
          <Input id="title" placeholder="Enter title" {...register("title")} className="mt-1 w-full" />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <Label htmlFor="description" className="sm:w-1/4">Description</Label>
        <div className="flex-1">
          <Input id="description" placeholder="Enter description" {...register("description")} className="mt-1 w-full" />
          {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <label htmlFor="type" className="sm:w-1/4 font-medium">Type</label>
        <div className="flex-1">
          <select
            id="type"
            {...register("type")}
            onChange={(e) => {
              const value = e.target.value as "education" | "school";
              setValue("type", value);
              setAllowMultiple(value === "school");
              setImagePreviews([]);
              setMainImageIndex(null);
            }}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">Select type</option>
            <option value="education">Education</option>
            <option value="school">School</option>
          </select>
          {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>}
        </div>
      </div>

      {watch("type") === "school" && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <Label htmlFor="school_address" className="sm:w-1/4">School Address</Label>
          <div className="flex-1">
            <Input
              id="school_address"
              placeholder="Enter address"
              {...register("school_address")}
              className="mt-1 w-full"
            />
            {errors.school_address && <p className="text-sm text-red-500 mt-1">{errors.school_address.message}</p>}
          </div>
        </div>
      )}
      <div>
        <Label>Upload {allowMultiple ? "Multiple Images" : "Single Image"}</Label>
        <div
          className={cn(
            "mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 cursor-pointer hover:border-purple-500 transition w-full"
          )}
        >
          <input
            type="file"
            accept="image/*"
            multiple={allowMultiple}
            onChange={handleImagesChange}
            className="hidden"
            id="images"
          />
          <label htmlFor="images" className="cursor-pointer text-center w-full">
            <div className="text-purple-600 font-medium">Click to upload</div>
            <p className="text-sm text-gray-500">or drag and drop</p>
          </label>
        </div>

        <div className="mt-2 flex flex-wrap gap-4">
          {imagePreviews.map((src, i) => (
            <div key={i} className="relative group w-28">
              <div className="w-28 h-28 relative">
                <Image
                  src={src}
                  alt={`preview-${i}`}
                  width={112}
                  height={112}
                  className="rounded-md object-cover border w-full h-full"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreviews((prev) => prev.filter((_, index) => index !== i));
                    const currentFiles = (watch("file_name") || []) as File[];
                    const newFiles = currentFiles.filter((_, index) => index !== i);
                    if (newFiles.length > 0) {
                      setValue("file_name", newFiles as [File, ...File[]], { shouldValidate: true });
                    } else {
                      setValue("file_name", undefined, { shouldValidate: true });
                    }

                    if (mainImageIndex === i) {
                      setMainImageIndex(newFiles.length > 0 ? 0 : null);
                    }
                  }}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  &times;
                </button>
              </div>
              <div className="flex items-center justify-center mt-1">
                <input
                  type="radio"
                  name="mainImage"
                  checked={mainImageIndex === i}
                  onChange={() => setMainImageIndex(i)}
                  className="mr-1"
                />
                <span className="text-xs">Main</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Education"}
        </Button>
      </div>
    </form>
  );
}
