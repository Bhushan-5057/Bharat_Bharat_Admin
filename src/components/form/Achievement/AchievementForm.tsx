"use client";

import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/redux/store";

import { cn } from "@/lib/utils";
import {
  addAchievement,
  getAllAchievements,
} from "@/store/redux/slice/achievementSlice";
import { Label } from "@/components/ui/label/label";
import { Textarea } from "@/components/ui/textarea/textarea";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input/input";
import Button from "@/components/ui/button/Button";
import {
  AchievementFormValues,
  achievementSchema,
} from "@/validations/achievementSchema";
import { CreateAchievementPayload } from "@/types/achievementTypes";
import { showApiError, showError, showSuccess } from "@/lib/utils/toast";
import Image from "next/image";

type AchievementFormProps = {
  closeModal?: () => void;
};

export default function AchievementForm({ closeModal }: AchievementFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.achievements);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getAllAchievements());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
    },
  });

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const existingFiles = (watch("file_name") || []) as File[];
    const updatedFiles = [...existingFiles, ...files];

    setValue("file_name", updatedFiles as [File, ...File[]], {
      shouldValidate: true,
    });
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    if (mainImageIndex === null) {
      setMainImageIndex(0);
    }
  };

  const onSubmit: SubmitHandler<AchievementFormValues> = async (data) => {
    if (!data.file_name || data.file_name.length === 0) {
      showError("Please select at least one image.");
      return;
    }

    const payload: CreateAchievementPayload = {
      title: data.title,
      description: data.description,
      address: data.address?.trim() ? data.address.trim() : undefined,
      file_name: data.file_name || [],
      mainImageIndex: mainImageIndex ?? 0,
    };

    try {
      await dispatch(addAchievement(payload)).unwrap();
      await dispatch(getAllAchievements());
      showSuccess("Achievement created successfully");
      reset();
      setImagePreviews([]);
      setMainImageIndex(null);
      if (closeModal) closeModal();
    } catch (err: unknown) {
      console.error("Failed to save achievement:", err);
      showApiError(err, "Failed to create achievement");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 mt-4 overflow-y-auto p-4 sm:p-6 rounded-xl border border-gray-200 bg-white max-w-3xl mx-auto w-full"
    >
      <FormField
        label="Achievement Title"
        htmlFor="title"
        required
        error={errors.title?.message}
      >
        <Input
          id="title"
          placeholder="Enter achievement title"
          {...register("title")}
          className="w-full"
        />
      </FormField>
      <FormField
        label="Description"
        htmlFor="description"
        required
        error={errors.description?.message}
      >
        <Textarea
          id="description"
          fieldSize="md"
          placeholder="Enter a detailed description"
          {...register("description")}
        />
      </FormField>
      <FormField
        label="Address"
        htmlFor="address"
        error={errors.address?.message}
      >
        <Textarea
          id="address"
          fieldSize="sm"
          placeholder="Enter address (optional)"
          {...register("address")}
        />
      </FormField>
      <div>
        <Label>Upload Images</Label>
        <div
          className={cn(
            "mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 cursor-pointer hover:border-purple-500 transition w-full"
          )}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            className="hidden"
            id="images"
          />
          <label htmlFor="images" className="cursor-pointer text-center w-full">
            <div className="text-purple-600 font-medium">Click to upload</div>
            <p className="text-sm text-gray-500">or drag and drop</p>
          </label>
        </div>
        {errors.file_name?.message && (
          <p className="text-sm text-red-500 mt-1">
            {String(errors.file_name.message)}
          </p>
        )}

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
                    setImagePreviews((prev) =>
                      prev.filter((_, index) => index !== i)
                    );
                    const currentFiles = (watch("file_name") || []) as File[];
                    const newFiles = currentFiles.filter(
                      (_, index) => index !== i
                    );
                    if (newFiles.length > 0) {
                      setValue("file_name", newFiles as [File, ...File[]], {
                        shouldValidate: true,
                      });
                    } else {
                      setValue("file_name", undefined, {
                        shouldValidate: true,
                      });
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
          {loading ? "Saving..." : "Save Achievement"}
        </Button>
      </div>
    </form>
  );
}
