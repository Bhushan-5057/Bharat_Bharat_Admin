"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/redux/store";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { Textarea } from "@/components/ui/textarea/textarea";
import { FormField } from "@/components/ui/form-field";
import Button from "@/components/ui/button/Button";
import { showApiError, showError, showSuccess } from "@/lib/utils/toast";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MESSAGES } from "@/components/common/constants/utlis";

import {
  CreateActivityFormData,
  createActivitySchema,
} from "@/validations/activitySchema";

import {
  deleteActivityImageThunk,
  editActivityImageThunk,
  fetchAllActivitiesThunk,
  updateActivityThunk,
} from "@/store/redux/slice/activitySlice";

import { Activity, ActivityImage } from "@/types/activityTypes";
import ActivityDateTimePickers from "@/components/form/Activity/ActivityDateTimePickers";
import { getDisplayImageUrl, getMediaUrl } from "@/utils/mediaUrl";
import { timeToHHMM } from "@/utils/time";
import StateCityFields from "@/components/form/StateCityFields";

interface EditEventFormProps {
  activity: Activity;
  closeModal?: () => void;
}

const normalizeDateForForm = (dateValue: string | undefined | null): string => {
  if (!dateValue) return "";
  const input = dateValue.trim();
  if (!input) return "";

  const ymdMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymdMatch) {
    return `${ymdMatch[1]}-${ymdMatch[2]}-${ymdMatch[3]}`;
  }

  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getInitialImages = (activity: Activity): ActivityImage[] => {
  if (activity.images && activity.images.length > 0) return activity.images;
  const legacyUrl = getDisplayImageUrl(activity);
  if (!legacyUrl) return [];
  return [
    {
      id: 0,
      file_name: activity.file_name,
      url: activity.url || legacyUrl,
      cloudinary_url: activity.cloudinary_url,
      data: activity.data,
      is_main: true,
    },
  ];
};

export default function EditActivityForm({
  activity,
  closeModal,
}: EditEventFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [existingImages, setExistingImages] = useState<ActivityImage[]>(
    getInitialImages(activity)
  );
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(
    existingImages.findIndex((img) => img.is_main) >= 0
      ? existingImages.findIndex((img) => img.is_main)
      : existingImages.length > 0
        ? 0
        : null
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateActivityFormData>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      title: activity.title || "",
      description: activity.description || "",
      state: activity.state || "",
      venue: activity.venue || "",
      date: normalizeDateForForm(activity.date),
      end_date: normalizeDateForForm(activity.end_date),
      start_time: timeToHHMM(activity.start_time),
      end_time: timeToHHMM(activity.end_time),
      file_name: [],
      existingImage: getInitialImages(activity).length > 0,
    },
  });

  const handleSetMainImage = async (imageId: number) => {
    if (!imageId) return;
    try {
      await dispatch(
        editActivityImageThunk({ id: imageId, is_main: true })
      ).unwrap();
      setExistingImages((prev) =>
        prev.map((img) => ({ ...img, is_main: img.id === imageId }))
      );
      showSuccess(MESSAGES.ADD_MAIN);
    } catch (err: unknown) {
      console.error(err);
      showApiError(err, MESSAGES.ADD_ERROR);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const existingFiles = (watch("file_name") || []) as File[];
    const updatedFiles = [...existingFiles, ...files];

    setValue("file_name", updatedFiles as [File, ...File[]], {
      shouldValidate: true,
    });
    setValue("existingImage", true, { shouldValidate: true });

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    if (mainImageIndex === null && (existingImages.length > 0 || files.length > 0)) {
      setMainImageIndex(existingImages.length);
    }
  };

  const handleDeleteImage = async (i: number) => {
    if (i < existingImages.length) {
      const imageToDelete = existingImages[i];
      if (imageToDelete?.id) {
        try {
          await dispatch(deleteActivityImageThunk(imageToDelete.id)).unwrap();
          const next = existingImages.filter((_, idx) => idx !== i);
          setExistingImages(next);
          setValue(
            "existingImage",
            next.length > 0 || imagePreviews.length > 0
          );
          showSuccess(MESSAGES.DELETE_SUCCESS);

          if (mainImageIndex === i) setMainImageIndex(next.length > 0 ? 0 : null);
          else if (mainImageIndex && mainImageIndex > i)
            setMainImageIndex(mainImageIndex - 1);
        } catch (err: unknown) {
          console.error(err);
          showApiError(err, MESSAGES.DELETE_ERROR);
        }
      }
    } else {
      const previewIndex = i - existingImages.length;
      const nextPreviews = imagePreviews.filter((_, idx) => idx !== previewIndex);
      setImagePreviews(nextPreviews);
      const currentFiles = (watch("file_name") || []) as File[];
      const newFiles = currentFiles.filter((_, idx) => idx !== previewIndex);
      setValue("file_name", newFiles.length ? newFiles : undefined, {
        shouldValidate: true,
      });
      setValue(
        "existingImage",
        existingImages.length > 0 || nextPreviews.length > 0
      );

      if (mainImageIndex === i) setMainImageIndex(0);
      else if (mainImageIndex && mainImageIndex > i)
        setMainImageIndex(mainImageIndex - 1);
    }
  };

  const onSubmit = async (data: CreateActivityFormData) => {
    try {
      const newFiles = data.file_name || [];
      const newMainIndex =
        mainImageIndex != null && mainImageIndex >= existingImages.length
          ? mainImageIndex - existingImages.length
          : undefined;

      const payload = {
        id: String(activity.id),
        title: data.title,
        description: data.description,
        state: data.state,
        venue: data.venue,
        date: normalizeDateForForm(data.date),
        end_date: normalizeDateForForm(data.end_date),
        start_time: timeToHHMM(data.start_time),
        end_time: timeToHHMM(data.end_time),
        file_name: newFiles,
        mainImageIndex: newMainIndex,
      };

      await dispatch(updateActivityThunk(payload)).unwrap();
      await dispatch(fetchAllActivitiesThunk());

      showSuccess("Updated successfully");
      closeModal?.();
    } catch (err) {
      console.error(err);
      showApiError(err, "Update failed");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pr-1">
        <FormField label="Title" htmlFor="title" required error={errors.title?.message}>
          <Input id="title" placeholder="Enter activity title" {...register("title")} className="w-full" />
        </FormField>

        <FormField label="Description" htmlFor="description" error={errors.description?.message}>
          <Textarea
            id="description"
            fieldSize="md"
            placeholder="Enter a detailed description of the activity"
            {...register("description")}
          />
        </FormField>

        <div className="w-full">
          <input type="hidden" {...register("date")} />
          <input type="hidden" {...register("end_date")} />
          <input type="hidden" {...register("start_time")} />
          <input type="hidden" {...register("end_time")} />
          <ActivityDateTimePickers
            date={watch("date") || ""}
            end_date={watch("end_date") || ""}
            start_time={watch("start_time") || ""}
            end_time={watch("end_time") || ""}
            onDateChange={(val: string) => setValue("date", val, { shouldValidate: true, shouldDirty: true })}
            onEndDateChange={(val: string) => setValue("end_date", val, { shouldValidate: true, shouldDirty: true })}
            onStartTimeChange={(val: string) => setValue("start_time", val, { shouldValidate: true, shouldDirty: true })}
            onEndTimeChange={(val: string) => setValue("end_time", val, { shouldValidate: true, shouldDirty: true })}
          />
          {(errors.date || errors.end_date || errors.start_time || errors.end_time) && (
            <p className="text-red-600 text-xs sm:text-sm mt-1.5">
              {errors.date?.message || errors.end_date?.message || errors.start_time?.message || errors.end_time?.message}
            </p>
          )}
        </div>

        <StateCityFields
          stateValue={watch("state") || ""}
          cityValue={watch("venue") || ""}
          onStateChange={(value) => setValue("state", value, { shouldDirty: true, shouldValidate: true })}
          onCityChange={(value) => setValue("venue", value, { shouldDirty: true, shouldValidate: true })}
          stateError={errors.state?.message}
          cityError={errors.venue?.message}
        />

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
              id="activity-edit-images"
            />
            <label htmlFor="activity-edit-images" className="cursor-pointer text-center w-full">
              <div className="text-purple-600 font-medium">Click to upload</div>
              <p className="text-sm text-gray-500">or drag and drop</p>
            </label>
          </div>
          {errors.file_name && (
            <p className="text-red-600 text-xs sm:text-sm mt-1">
              {errors.file_name.message as string}
            </p>
          )}

          {(existingImages.length > 0 || imagePreviews.length > 0) && (
            <div className="mt-2 flex flex-wrap gap-4">
              {[...existingImages, ...imagePreviews].map((img, i) => {
                const src = typeof img === "string" ? img : getMediaUrl(img);
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
                          if (typeof img !== "string" && "id" in img && img.id) {
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

        <div className="pt-3 flex flex-col-reverse justify-end gap-2 sm:flex-row">
          {closeModal ? (
            <Button
              variant="outline"
              type="button"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          ) : null}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium"
          >
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
}
