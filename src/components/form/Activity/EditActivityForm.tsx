"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/redux/store";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import Button from "@/components/ui/button/Button";
import { showError, showSuccess } from "@/lib/utils/toast";
import Image from "next/image";
import { X } from "lucide-react";

import {
  CreateActivityFormData,
  createActivitySchema,
} from "@/validations/activitySchema";

import {
  fetchAllActivitiesThunk,
  updateActivityThunk,
} from "@/store/redux/slice/activitySlice";

import { Activity } from "@/types/activityTypes";
import ActivityDateTimePickers from "@/components/form/Activity/ActivityDateTimePickers";

interface EditEventFormProps {
  activity: Activity;
  closeModal?: () => void;
}

const formatToHHMM = (timeStr: string | undefined | null): string => {
  if (!timeStr) return "";

  // If it's already HH:MM format (e.g. "10:30")
  if (/^\d{2}:\d{2}$/.test(timeStr)) {
    return timeStr;
  }

  // If it's in format "HH:MM:SS" (e.g. "10:30:00")
  if (/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) {
    return timeStr.slice(0, 5);
  }

  // Try parsing with Date (handles full ISO/Locale strings)
  const parsedDate = new Date(timeStr);
  if (!isNaN(parsedDate.getTime())) {
    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  // Fallback: search for HH:MM pattern anywhere in the string
  const match = timeStr.match(/(\d{2}):(\d{2})/);
  if (match) {
    return `${match[1]}:${match[2]}`;
  }

  return "";
};

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

const formatTimeForPayload = (timeStr: string | undefined | null): string => {
  if (!timeStr) return "";

  const plainTimeMatch = timeStr.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
  if (plainTimeMatch) {
    return `${plainTimeMatch[1]}:${plainTimeMatch[2]}`;
  }

  if (timeStr.includes("T")) {
    const isoTimeMatch = timeStr.match(/T(\d{2}):(\d{2})/);
    if (isoTimeMatch) {
      return `${isoTimeMatch[1]}:${isoTimeMatch[2]}`;
    }
  }

  try {
    const parsed = new Date(timeStr);
    if (!Number.isNaN(parsed.getTime())) {
      const hh = String(parsed.getHours()).padStart(2, "0");
      const mm = String(parsed.getMinutes()).padStart(2, "0");
      return `${hh}:${mm}`;
    }
  } catch (e) {
    console.error("Error formatting time:", e);
  }

  return "";
};

export default function EditActivityForm({
  activity,
  closeModal,
}: EditEventFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  const [preview, setPreview] = useState<string | null>(
    activity.data
      ? `data:image/*;base64,${activity.data}`
      : activity.file_name
      ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${activity.file_name}`
      : null
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<CreateActivityFormData>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      title: activity.title || "",
      description: activity.description || "",
      venue: activity.venue || "",
      date: normalizeDateForForm(activity.date),
      start_time: formatToHHMM(activity.start_time),
      end_time: formatToHHMM(activity.end_time),
      file_name: undefined,
    },
  });

  useEffect(() => {
    const hasExistingImage = !!(activity.data || activity.file_name);
    
    // Explicitly resetting with existing dynamic data properties
    reset({
      title: activity.title || "",
      description: activity.description || "",
      venue: activity.venue || "",
      date: normalizeDateForForm(activity.date),
      start_time: formatToHHMM(activity.start_time),
      end_time: formatToHHMM(activity.end_time),
    });

    // Forced registration to ensure watchers capture the change immediately
    if (activity.date) setValue("date", normalizeDateForForm(activity.date));
    if (activity.start_time) setValue("start_time", formatToHHMM(activity.start_time));
    if (activity.end_time) setValue("end_time", formatToHHMM(activity.end_time));

    if (hasExistingImage) {
      const mockFile = new File([""], "existing_image.png", { type: "image/png" });
      setValue("file_name", [mockFile], { shouldValidate: false });
      clearErrors("file_name");
    }
    
    setPreview(
      activity.data
        ? `data:image/*;base64,${activity.data}`
        : activity.file_name
        ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${activity.file_name}`
        : null
    );
  }, [activity, reset, setValue, clearErrors]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFiles([file]);
    setPreview(URL.createObjectURL(file));
    setValue("file_name", [file], { shouldValidate: true });
  };

  const handleClearImage = () => {
    setFiles([]);
    setPreview(null);
    setValue("file_name", [] as unknown as [File], { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

const onSubmit = async (data: CreateActivityFormData) => {
  try {
    const payload = {
      id: String(activity.id),

      title: data.title,
      description: data.description,
      venue: data.venue,
      date: normalizeDateForForm(data.date),

      start_time: formatTimeForPayload(data.start_time),
      end_time: formatTimeForPayload(data.end_time),

      file_name: files[0] || activity.file_name,
    };

    console.log("UPDATE PAYLOAD:", payload);

    await dispatch(updateActivityThunk(payload)).unwrap();
    await dispatch(fetchAllActivitiesThunk());

    showSuccess("Updated successfully");
    closeModal?.();
  } catch (err) {
    console.error(err);
    showError("Update failed");
  }
};

  return (
    <div className="w-full max-w-2xl mx-auto max-h-[80vh] overflow-y-auto px-4 py-2 touch-pan-y scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pr-1">

        {/* TITLE */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Title</Label>
          <Input {...register("title")} className="w-full" />
          {errors.title && (
            <p className="text-red-600 text-xs sm:text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Description</Label>
          <textarea
            className="w-full border rounded-md p-2 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-600 text-xs sm:text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* DATE + TIME PICKER */}
        <div className="w-full">
          <input type="hidden" {...register("date")} />
          <input type="hidden" {...register("start_time")} />
          <input type="hidden" {...register("end_time")} />
          <ActivityDateTimePickers
            date={watch("date") || ""}
            start_time={watch("start_time") || ""}
            end_time={watch("end_time") || ""}
            onDateChange={(val: string) => setValue("date", val, { shouldValidate: true, shouldDirty: true })}
            onStartTimeChange={(val: string) => setValue("start_time", val, { shouldValidate: true, shouldDirty: true })}
            onEndTimeChange={(val: string) => setValue("end_time", val, { shouldValidate: true, shouldDirty: true })}
          />
          {(errors.date || errors.start_time || errors.end_time) && (
            <p className="text-red-600 text-xs sm:text-sm mt-1.5">
              {errors.date?.message || errors.start_time?.message || errors.end_time?.message}
            </p>
          )}
        </div>

        {/* VENUE */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Venue</Label>
          <Input {...register("venue")} className="w-full" />
          {errors.venue && (
            <p className="text-red-600 text-xs sm:text-sm">{errors.venue.message}</p>
          )}
        </div>

        {/* IMAGE */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Image</Label>
          <Input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef}
            className="w-full file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold cursor-pointer"
            onChange={handleFileChange} 
          />
          {errors.file_name && (
            <p className="text-red-600 text-xs sm:text-sm">
              {errors.file_name.message as string}
            </p>
          )}

          {preview && (
            <div className="relative mt-4 h-24 w-24 border rounded-lg bg-gray-50 flex items-center justify-center shadow-sm">
              <Image
                src={preview}
                alt="preview"
                fill
                className="object-contain p-2"
                unoptimized
              />
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center hover:bg-red-700 transition active:scale-95 shadow-md z-10"
                title="Remove image"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-3 sticky bottom-0 bg-white/90 backdrop-blur-sm pb-1 flex justify-end">
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
