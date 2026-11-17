"use client";

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/redux/store";
import { cn } from "@/lib/utils";
import {
  editAchievement,
  editAchievementImage,
  getAllAchievements,
  getAchievementImages,
  removeAchievementImage,
} from "@/store/redux/slice/achievementSlice";
import { Label } from "@/components/ui/label/label";
import { Input } from "@/components/ui/input/input";
import Button from "@/components/ui/button/Button";
import {
  AchievementFormValues,
  achievementSchema,
} from "@/validations/achievementSchema";
import { showApiError, showSuccess } from "@/lib/utils/toast";
import { MESSAGES } from "@/components/common/constants/utlis";
import Image from "next/image";
import { Achievement, AchievementImage } from "@/types/achievementTypes";
import { getMediaUrl } from "@/utils/mediaUrl";
import { Textarea } from "@/components/ui/textarea/textarea";
import { FormField } from "@/components/ui/form-field";

type EditAchievementFormProps = {
  achievement: Achievement;
  onClose: () => void;
};

export default function EditAchievementForm({
  achievement,
  onClose,
}: EditAchievementFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.achievements);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<AchievementImage[]>(
    achievement.images || []
  );

  const [mainImageIndex, setMainImageIndex] = useState<number | null>(
    existingImages.findIndex((img) => img.is_main) >= 0
      ? existingImages.findIndex((img) => img.is_main)
      : 0
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: achievement.title,
      description: achievement.description,
      address: achievement.address ?? "",
      file_name: [],
      existingImage: existingImages.length > 0,
    },
  });

  const handleSetMainImage = async (imageId: number) => {
    try {
      await dispatch(
        editAchievementImage({ id: imageId, is_main: true })
      ).unwrap();
      await dispatch(getAchievementImages(achievement.id));
      await dispatch(getAllAchievements());
      setExistingImages((prev) =>
        prev.map((img) => ({ ...img, is_main: img.id === imageId }))
      );
      showSuccess(MESSAGES.ADD_MAIN);
    } catch (err: unknown) {
      console.error(err);
      showApiError(err, MESSAGES.DELETE_ERROR);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    const existingFiles = (watch("file_name") || []) as File[];
    const updatedFiles = [...existingFiles, ...files];

    setValue("file_name", updatedFiles as [File, ...File[]], {
      shouldValidate: true,
    });

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    if (files.length > 0) setMainImageIndex(existingImages.length);
  };

  const handleDeleteImage = async (i: number) => {
    if (i < existingImages.length) {
      const imageToDelete = existingImages[i];
      if (imageToDelete && imageToDelete.id) {
        try {
          await dispatch(removeAchievementImage(imageToDelete.id)).unwrap();
          await dispatch(getAchievementImages(achievement.id));
          await dispatch(getAllAchievements());
          setExistingImages((prev) => {
            const next = prev.filter((_, idx) => idx !== i);
            setValue("existingImage", next.length > 0 || imagePreviews.length > 0);
            return next;
          });
          showSuccess(MESSAGES.DELETE_SUCCESS);

          if (mainImageIndex === i) setMainImageIndex(0);
          else if (mainImageIndex && mainImageIndex > i)
            setMainImageIndex(mainImageIndex - 1);
        } catch (err: unknown) {
          console.error(err);
          showApiError(err, MESSAGES.DELETE_ERROR);
        }
      }
    } else {
      const previewIndex = i - existingImages.length;
      setImagePreviews((prev) => prev.filter((_, idx) => idx !== previewIndex));
      const currentFiles = (watch("file_name") || []) as File[];
      setValue(
        "file_name",
        currentFiles.filter((_, idx) => idx !== previewIndex)
      );

      if (mainImageIndex === i) setMainImageIndex(0);
      else if (mainImageIndex && mainImageIndex > i)
        setMainImageIndex(mainImageIndex - 1);
    }
  };

  const onSubmit: SubmitHandler<AchievementFormValues> = async (data) => {
    const payload = {
      title: data.title,
      description: data.description,
      address: data.address?.trim() ? data.address.trim() : "",
      images: [
        ...existingImages.map((img, index) => ({
          achievement_id: img.id,
          is_main: index === mainImageIndex,
        })),
        ...(data.file_name || []).map((file, index) => ({
          achievement_id: undefined,
          is_main: existingImages.length + index === mainImageIndex,
          data: file,
        })),
      ],
    };

    try {
      await dispatch(
        editAchievement({ id: achievement.id, payload })
      ).unwrap();
      await dispatch(getAllAchievements());
      showSuccess("Achievement updated successfully");
      onClose();
    } catch (err) {
      console.error("Failed to update achievement:", err);
      showApiError(err, "Failed to update achievement");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 mt-4 overflow-y-hidden p-6 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 max-w-3xl mx-auto w-full"
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
        {(existingImages.length > 0 || imagePreviews.length > 0) && (
          <div className="mt-2 flex flex-wrap gap-4">
            {[...existingImages, ...imagePreviews].map((img, i) => {
              let src = "";

              if (typeof img === "string") {
                src = img;
              } else {
                src = getMediaUrl(img);
              }

              if (!src) return null;

              return (
                <div key={i} className="relative group w-28">
                  <div className="w-28 h-28 relative">
                    <Image
                      src={src}
                      alt={`image-${i}`}
                      width={112}
                      height={112}
                      className="rounded-md object-cover border w-full h-full"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(i)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex items-center justify-center mt-1">
                    <input
                      type="radio"
                      name="mainImage"
                      checked={mainImageIndex === i}
                      onChange={() => {
                        setMainImageIndex(i);
                        if (typeof img !== "string" && "id" in img) {
                          handleSetMainImage(img.id);
                        }
                      }}
                      className="mr-1"
                    />
                    <span className="text-xs">Main</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Achievement"}
        </Button>
      </div>
    </form>
  );
}
