"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import Image from "next/image";

import { AppDispatch } from "@/store/redux/store";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import Button from "@/components/ui/button/Button";
import { Textarea } from "@/components/ui/textarea/textarea";
import { FormField } from "@/components/ui/form-field";

import { showApiError, showError, showSuccess } from "@/lib/utils/toast";
import { MESSAGES } from "@/components/common/constants/utlis";
import { cn } from "@/lib/utils";

import {
  CreateEventFormData,
  createEventSchema,
} from "@/validations/eventSchema";

import {
  deleteEventImageThunk,
  editEventImageThunk,
  fetchAllEventsThunk,
  updateEventThunk,
} from "@/store/redux/slice/eventSlice";

import { Event, EventImage, UpdateEventePayload } from "@/types/eventTypes";
import { getDisplayImageUrl, getMediaUrl } from "@/utils/mediaUrl";
import { timeToHHMM } from "@/utils/time";
import StateCityFields from "@/components/form/StateCityFields";

import {
  EventDatePicker,
  EventTimePicker,
} from "./EventDateTimePickers";

const getInitialImages = (event: Event): EventImage[] => {
  if (event.images && event.images.length > 0) return event.images;
  const legacyUrl = getDisplayImageUrl(event);
  if (!legacyUrl) return [];
  return [
    {
      id: 0,
      file_name: event.file_name,
      url: event.url || legacyUrl,
      cloudinary_url: event.cloudinary_url,
      data: typeof event.data === "string" ? event.data : null,
      is_main: true,
    },
  ];
};

interface EditEventFormProps {
  event: Event;
  closeModal?: () => void;
}

export default function EditEventForm({
  event,
  closeModal,
}: EditEventFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [existingImages, setExistingImages] = useState<EventImage[]>(
    getInitialImages(event)
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
    reset,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    mode: "onChange",
    defaultValues: {
      title: event.title || "",
      description: event.description || "",
      state: event.state || "",
      venue: event.venue || "",
      event_date: event.event_date || "",
      end_date: event.end_date || "",
      start_time: timeToHHMM(event.start_time),
      end_time: timeToHHMM(event.end_time),
      file_name: [],
      existingImage: getInitialImages(event).length > 0,
    },
  });

  const watchDate = watch("event_date");
  const watchEndDate = watch("end_date");
  const watchStartTime = watch("start_time");
  const watchEndTime = watch("end_time");

  useEffect(() => {
    const images = getInitialImages(event);
    reset({
      title: event.title || "",
      description: event.description || "",
      state: event.state || "",
      venue: event.venue || "",
      event_date: event.event_date || "",
      end_date: event.end_date || "",
      start_time: timeToHHMM(event.start_time),
      end_time: timeToHHMM(event.end_time),
      file_name: [],
      existingImage: images.length > 0,
    });
    setExistingImages(images);
    setImagePreviews([]);
  }, [event, reset]);

  useEffect(() => {
    if (watchStartTime && watchEndTime) {
      trigger(["start_time", "end_time", "end_date"]);
    }
  }, [watchStartTime, watchEndTime, watchEndDate, trigger]);

  const handleSetMainImage = async (imageId: number) => {
    if (!imageId) return;
    try {
      await dispatch(editEventImageThunk({ id: imageId, is_main: true })).unwrap();
      setExistingImages((prev) =>
        prev.map((img) => ({ ...img, is_main: img.id === imageId }))
      );
      showSuccess(MESSAGES.ADD_MAIN);
    } catch (err) {
      console.error(err);
      showApiError(err, MESSAGES.ADD_ERROR);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const invalidFile = files.find((file) => !file.type.startsWith("image/"));
    if (invalidFile) {
      showError("Only image files are allowed");
      return;
    }

    const existingFiles = (watch("file_name") || []) as File[];
    const updatedFiles = [...existingFiles, ...files];
    setValue("file_name", updatedFiles as [File, ...File[]], { shouldValidate: true });
    setValue("existingImage", true, { shouldValidate: true });
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    if (mainImageIndex === null) {
      setMainImageIndex(existingImages.length);
    }
  };

  const handleDeleteImage = async (i: number) => {
    if (i < existingImages.length) {
      const imageToDelete = existingImages[i];
      if (!imageToDelete?.id) return;
      try {
        await dispatch(deleteEventImageThunk(imageToDelete.id)).unwrap();
        const next = existingImages.filter((_, idx) => idx !== i);
        setExistingImages(next);
        setValue("existingImage", next.length > 0 || imagePreviews.length > 0);
        showSuccess(MESSAGES.DELETE_SUCCESS);
        if (mainImageIndex === i) setMainImageIndex(next.length > 0 ? 0 : null);
        else if (mainImageIndex && mainImageIndex > i)
          setMainImageIndex(mainImageIndex - 1);
      } catch (err) {
        console.error(err);
        showApiError(err, MESSAGES.DELETE_ERROR);
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
      setValue("existingImage", existingImages.length > 0 || nextPreviews.length > 0);
      if (mainImageIndex === i) setMainImageIndex(0);
      else if (mainImageIndex && mainImageIndex > i)
        setMainImageIndex(mainImageIndex - 1);
    }
  };

  const onSubmit = async (data: CreateEventFormData) => {
    try {
      const isMultiDay =
        Boolean(data.end_date) &&
        Boolean(data.event_date) &&
        data.end_date! > data.event_date;

      if (!isMultiDay && data.start_time === data.end_time) {
        showError("Start time and end time cannot be the same.");
        return;
      }

      const newFiles = data.file_name || [];
      const newMainIndex =
        mainImageIndex != null && mainImageIndex >= existingImages.length
          ? mainImageIndex - existingImages.length
          : undefined;

      const payload: UpdateEventePayload = {
        id: event.id,
        title: data.title,
        description: data.description || "",
        state: data.state || "",
        venue: data.venue || "",
        event_date: data.event_date,
        end_date: data.end_date || "",
        start_time: timeToHHMM(data.start_time),
        end_time: timeToHHMM(data.end_time),
        file_name: newFiles,
        mainImageIndex: newMainIndex,
      };

      await dispatch(updateEventThunk(payload)).unwrap();
      await dispatch(fetchAllEventsThunk());

      showSuccess("Event updated successfully");
      closeModal?.();
    } catch (err: unknown) {
      console.error("Event update failed:", err);
      showApiError(err, MESSAGES.EDIT_ERROR);
    }
  };

  return (
    <div className="relative w-full rounded-xl bg-white dark:bg-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-2 w-full space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter event title"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <FormField label="Description" htmlFor="description" error={errors.description?.message}>
          <Textarea
            id="description"
            fieldSize="md"
            placeholder="Enter a detailed description of the event"
            {...register("description")}
          />
        </FormField>

        <div className="space-y-2">
          <Label htmlFor="event_date">Start Date</Label>
          <input type="hidden" {...register("event_date")} />
          <EventDatePicker
            id="event_date"
            value={watchDate}
            onChange={(nextDate: string) =>
              setValue("event_date", nextDate, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
          {errors.event_date && (
            <p className="text-sm text-red-600">{errors.event_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <input type="hidden" {...register("end_date")} />
          <EventDatePicker
            id="end_date"
            value={watchEndDate}
            minDate={watchDate || undefined}
            onChange={(nextDate: string) =>
              setValue("end_date", nextDate, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
          {errors.end_date && (
            <p className="text-sm text-red-600">{errors.end_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_time">Start Time</Label>
          <input type="hidden" {...register("start_time")} />
          <EventTimePicker
            id="start_time"
            value={watchStartTime}
            onChange={async (nextTime: string) => {
              setValue("start_time", nextTime, {
                shouldDirty: true,
                shouldValidate: true,
              });
              await trigger(["start_time"]);
            }}
          />
          {errors.start_time && (
            <p className="text-sm text-red-600">{errors.start_time.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">End Time</Label>
          <input type="hidden" {...register("end_time")} />
          <EventTimePicker
            id="end_time"
            value={watchEndTime}
            onChange={async (nextTime: string) => {
              setValue("end_time", nextTime, {
                shouldDirty: true,
                shouldValidate: true,
              });
              await trigger(["start_time", "end_time"]);
            }}
          />
          {errors.end_time && (
            <p className="text-sm text-red-600">{errors.end_time.message}</p>
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
              id="event-edit-images"
            />
            <label htmlFor="event-edit-images" className="cursor-pointer text-center w-full">
              <div className="text-purple-600 font-medium">Click to upload</div>
              <p className="text-sm text-gray-500">or drag and drop</p>
            </label>
          </div>
          {errors.file_name?.message && (
            <p className="text-sm text-red-600 mt-1">
              {String(errors.file_name.message)}
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

        <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
          <Button
            variant="outline"
            type="button"
            onClick={closeModal}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
}
