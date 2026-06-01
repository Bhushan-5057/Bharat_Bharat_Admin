"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";

import { useDropzone } from "react-dropzone";
import { motion } from "motion/react";
import Image from "next/image";

import { AppDispatch } from "@/store/redux/store";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import Button from "@/components/ui/button/Button";

import { showError, showSuccess } from "@/lib/utils/toast";
import { MESSAGES } from "@/components/common/constants/utlis";

import {
  CreateEventFormData,
  createEventSchema,
} from "@/validations/eventSchema";

import {
  fetchAllEventsThunk,
  updateEventThunk,
} from "@/store/redux/slice/eventSlice";

import { Event, UpdateEventePayload } from "@/types/eventTypes";

import {
  EventDatePicker,
  EventTimePicker,
} from "./EventDateTimePickers";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Normalise any time string to "HH:MM" format. */
const formatToHHMM = (timeStr: string | undefined | null): string => {
  if (!timeStr) return "";

  if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;

  if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) return timeStr.slice(0, 5);

  const parsedDate = new Date(timeStr);
  if (!isNaN(parsedDate.getTime())) {
    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const match = timeStr.match(/(\d{2}):(\d{2})/);
  if (match) return `${match[1]}:${match[2]}`;

  return "";
};

// ─── Component ──────────────────────────────────────────────────────────────

interface EditEventFormProps {
  event: Event;
  closeModal?: () => void;
}

export default function EditEventForm({
  event,
  closeModal,
}: EditEventFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const todayDate = new Date(
    Date.now() - new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];

  const initialPreview = event.data
    ? `data:image/*;base64,${event.data}`
    : event.file_name
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${event.file_name}`
    : null;

  const [preview, setPreview] = useState<string | null>(initialPreview);

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
      venue: event.venue || "",
      event_date: event.event_date || "",
      start_time: formatToHHMM(event.start_time),
      end_time: formatToHHMM(event.end_time),
      file_name: undefined,
      existingImage: !!event.file_name || !!event.data,
    },
  });

  const watchDate = watch("event_date");
  const watchStartTime = watch("start_time");
  const watchEndTime = watch("end_time");

  // Re-populate form when the event record changes (e.g. modal re-open)
  useEffect(() => {
    reset({
      title: event.title || "",
      description: event.description || "",
      venue: event.venue || "",
      event_date: event.event_date || "",
      start_time: formatToHHMM(event.start_time),
      end_time: formatToHHMM(event.end_time),
      file_name: undefined,
      existingImage: !!event.file_name || !!event.data,
    });
    setPreview(initialPreview);
    setFiles([]);
  }, [event, initialPreview, reset]);

  // Immediately validate times whenever both are set
  useEffect(() => {
    if (watchStartTime && watchEndTime) {
      trigger(["start_time", "end_time"]);
    }
  }, [watchStartTime, watchEndTime, trigger]);

  // ─── File helpers ──────────────────────────────────────────────────────

  const handleFileChange = (newFiles: File[]) => {
    if (!newFiles.length) return;
    const file = newFiles[0];

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      setFiles([]);
      setPreview(null);
      setValue("file_name", undefined, { shouldValidate: true });
      return;
    }

    setError(null);
    setFiles([file]);
    setValue("file_name", [file], { shouldValidate: true });

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFiles([]);
    setPreview(null);
    setValue("file_name", undefined, { shouldValidate: true });
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    accept: { "image/*": [] },
    onDrop: handleFileChange,
  });

  const handleClick = () => fileInputRef.current?.click();

  // ─── Submit ────────────────────────────────────────────────────────────

  const onSubmit = async (data: CreateEventFormData) => {
    try {
      if (!preview && files.length === 0) {
        setError("Please select an image");
        return;
      }

      // ONLY VALIDATE: Start time and end time cannot be identical
      if (!data.start_time || !data.end_time) {
        setError("Please select both a start time and an end time.");
        return;
      }

      if (data.start_time === data.end_time) {
        setError("Start time and end time cannot be the same.");
        return;
      }

      setError(null);

      const payload: UpdateEventePayload = {
        id: event.id,
        title: data.title,
        description: data.description || "",
        venue: data.venue || "",
        event_date: data.event_date,
        start_time: data.start_time,
        end_time: data.end_time,
      };

      if (files.length > 0) {
        payload.file_name = files[0];
      }

      await dispatch(updateEventThunk(payload)).unwrap();
      await dispatch(fetchAllEventsThunk());

      showSuccess(MESSAGES.EDIT_SUCCESS);

      reset({
        title: data.title,
        description: data.description,
        venue: data.venue,
        event_date: data.event_date,
        start_time: data.start_time,
        end_time: data.end_time,
        file_name: undefined,
        existingImage: true,
      });

      setFiles([]);
      closeModal?.();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : MESSAGES.EDIT_ERROR;

      console.error("Event update failed:", message);
      showError(message);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <div className="relative w-full max-h-[80vh] overflow-y-auto rounded-xl bg-white p-4 dark:bg-gray-900 sm:p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-2 w-full space-y-4"
      >
        {/* Title */}
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

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            placeholder="Enter event description"
            className="min-h-[96px] w-full resize-y rounded-md border p-2 text-sm leading-relaxed"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="event_date">Date</Label>
          <input type="hidden" {...register("event_date")} />
          <EventDatePicker
            id="event_date"
            value={watchDate}
            minDate={todayDate}
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

        {/* Start Time */}
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

        {/* End Time */}
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

        {/* Venue */}
        <div className="space-y-2">
          <Label htmlFor="venue">Venue</Label>
          <Input
            id="venue"
            placeholder="Enter event venue"
            {...register("venue")}
          />
          {errors.venue && (
            <p className="text-sm text-red-600">{errors.venue.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div {...getRootProps()} className="space-y-2">
          <Label>Image</Label>

          <div onClick={handleClick} className="cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleFileChange(Array.from(e.target.files || []))
              }
            />

            <motion.div className="relative flex h-36 w-full max-w-[220px] items-center justify-center rounded-md border sm:h-40">
              {preview ? (
                <>
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    unoptimized
                    className="rounded-md object-contain"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-sm text-white hover:bg-red-700"
                  >
                    ×
                  </button>
                </>
              ) : isDragActive ? (
                <p>Drop the image here...</p>
              ) : (
                <p>Click or drag image</p>
              )}
            </motion.div>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {errors.file_name?.message && (
            <p className="text-sm text-red-600">
              {String(errors.file_name.message)}
            </p>
          )}
        </div>

        {/* Buttons */}
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