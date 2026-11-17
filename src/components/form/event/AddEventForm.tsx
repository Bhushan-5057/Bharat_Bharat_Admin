"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { Textarea } from "@/components/ui/textarea/textarea";
import { FormField } from "@/components/ui/form-field";
import Button from "@/components/ui/button/Button";
import { showApiError, showSuccess } from "@/lib/utils/toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/redux/store";
import { MESSAGES } from "@/components/common/constants/utlis";
import Image from "next/image";
import { CreateEventFormData, createEventSchema } from "@/validations/eventSchema";
import { createEventThunk, fetchAllEventsThunk } from "@/store/redux/slice/eventSlice";
import { EventDatePicker, EventTimePicker } from "./EventDateTimePickers";
import { cn } from "@/lib/utils";
import { timeToHHMM } from "@/utils/time";
import StateCityFields from "@/components/form/StateCityFields";


export default function AddEventForm({ closeModal }: { closeModal?: () => void }) {
    const dispatch = useDispatch<AppDispatch>();
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        watch,
        setValue,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<CreateEventFormData>({
        resolver: zodResolver(createEventSchema),
        mode: "onChange",
        defaultValues: {
            state: "",
            venue: "",
            file_name: [],
            existingImage: false,
        },
    });

    const watchDate = watch("event_date");
    const watchEndDate = watch("end_date");
    const watchStartTime = watch("start_time");
    const watchEndTime = watch("end_time");

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        const invalidFile = files.find((file) => !file.type.startsWith("image/"));

        if (invalidFile) {
            setError("file_name", { type: "manual", message: "Only image files are allowed." });
            return;
        }

        const existingFiles = (watch("file_name") || []) as File[];
        const updatedFiles = [...existingFiles, ...files];

        setValue("file_name", updatedFiles as [File, ...File[]], { shouldValidate: true });
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews]);

        if (mainImageIndex === null) {
            setMainImageIndex(0);
        }
    };

    const onSubmit = async (data: CreateEventFormData) => {
        if (!data.file_name || data.file_name.length === 0) {
            setError("file_name", { type: "manual", message: "Please select at least one image." });
            return;
        }

        try {
            const payload = {
                title: data.title || "",
                description: data.description || "",
                state: data.state || "",
                venue: data.venue || "",
                event_date: data.event_date || "",
                end_date: data.end_date || undefined,
                start_time: timeToHHMM(data.start_time),
                end_time: timeToHHMM(data.end_time),
                file_name: data.file_name,
                mainImageIndex: mainImageIndex ?? 0,
            };

            await dispatch(createEventThunk(payload)).unwrap();
            await dispatch(fetchAllEventsThunk());

            showSuccess("Event created successfully");
            closeModal?.();
            reset();
            setImagePreviews([]);
            setMainImageIndex(null);
        } catch (err: unknown) {
            console.error("Add event failed:", err);
            showApiError(err, MESSAGES.ADD_ERROR);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 w-full space-y-4">
            <FormField label="Title" htmlFor="title" required error={errors.title?.message}>
                <Input id="title" placeholder="Enter event title" {...register("title")} />
            </FormField>

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
                    onChange={(nextDate) =>
                        setValue("event_date", nextDate, { shouldDirty: true, shouldValidate: true })
                    }
                />
                {errors.event_date && <p className="text-red-600 text-sm">{errors.event_date?.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <input type="hidden" {...register("end_date")} />
                <EventDatePicker
                    id="end_date"
                    value={watchEndDate}
                    minDate={watchDate || undefined}
                    onChange={(nextDate) =>
                        setValue("end_date", nextDate, { shouldDirty: true, shouldValidate: true })
                    }
                />
                {errors.end_date && <p className="text-red-600 text-sm">{errors.end_date?.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="start_time">Start Time</Label>
                <input type="hidden" {...register("start_time")} />
                <EventTimePicker
                    id="start_time"
                    value={watchStartTime}
                    onChange={async (nextTime) => {
                        setValue("start_time", nextTime, { shouldDirty: true });
                        await trigger(["start_time", "end_time"]);
                    }}
                />
                {errors.start_time && <p className="text-red-600 text-sm">{errors.start_time?.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="end_time">End Time</Label>
                <input type="hidden" {...register("end_time")} />
                <EventTimePicker
                    id="end_time"
                    value={watchEndTime}
                    onChange={async (nextTime) => {
                        setValue("end_time", nextTime, { shouldDirty: true });
                        await trigger(["start_time", "end_time"]);
                    }}
                />
                {errors.end_time && <p className="text-red-600 text-sm">{errors.end_time?.message}</p>}
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
                        id="event-images"
                    />
                    <label htmlFor="event-images" className="cursor-pointer text-center w-full">
                        <div className="text-purple-600 font-medium">Click to upload</div>
                        <p className="text-sm text-gray-500">or drag and drop</p>
                    </label>
                </div>
                {errors.file_name?.message && (
                    <p className="text-red-600 text-sm mt-1">{String(errors.file_name.message)}</p>
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

            <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
                {closeModal ? (
                    <Button variant="outline" type="button" onClick={closeModal} disabled={isSubmitting}>
                        Cancel
                    </Button>
                ) : null}
                <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
            </div>
        </form>
    );
}
