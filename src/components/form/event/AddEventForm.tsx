
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
import { MESSAGES } from "@/components/common/constants/utlis";
import Image from "next/image";
import { CreateEventFormData, createEventSchema } from "@/validations/eventSchema";
import { createEventThunk, fetchAllEventsThunk } from "@/store/redux/slice/eventSlice";
import { EventDatePicker, EventTimePicker } from "./EventDateTimePickers";


export default function AddEventForm({ closeModal }: { closeModal?: () => void }) {
    const dispatch = useDispatch<AppDispatch>();
    const [preview, setPreview] = useState<string | null>(null);
    const todayDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];

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
    });

    const watchFile = watch("file_name");
    const watchDate = watch("event_date");
    const watchStartTime = watch("start_time");
    const watchEndTime = watch("end_time");
    useEffect(() => {
        if (watchFile && watchFile.length > 0) {
            setPreview(URL.createObjectURL(watchFile[0]));
        } else {
            setPreview(null);
        }
    }, [watchFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const file = files[0];

        if (!file.type.startsWith("image/")) {
            setError("file_name", { type: "manual", message: "Only image files are allowed." });
            return;
        }

        setValue("file_name", [file], { shouldValidate: true });
    };

    const onSubmit = async (data: CreateEventFormData) => {
        if (!data.file_name || data.file_name.length === 0) {
            setError("file_name", { type: "manual", message: "Please select a file." });
            return;
        }

        try {
            const payload = {
                title: data.title || "",
                description: data.description || "",
                venue: data.venue || "",
                event_date: data.event_date || "",
                start_time: data.start_time || "",
                end_time: data.end_time || "",
                file_name: data.file_name[0],
            };

            await dispatch(createEventThunk(payload)).unwrap();
            await dispatch(fetchAllEventsThunk());

            showSuccess(MESSAGES.ADD_SUCCESS);
            closeModal?.();
            reset();
            setPreview(null);
        } catch (err: unknown) {
            console.error("Add event failed:", err);
            const errorMessage = err && typeof err === "object" && "message" in err
                ? (err as { message: string }).message
                : MESSAGES.ADD_ERROR;
            showError(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 w-full space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter Event title" {...register("title")} />
                {errors.title && <p className="text-red-600 text-sm">{errors.title?.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                    id="description"
                    placeholder="Enter Event description"
                    className="min-h-24 w-full resize-y rounded-md border p-2 text-sm leading-relaxed"
                    {...register("description")}
                />
                {errors.description && <p className="text-red-600 text-sm">{errors.description?.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="event_date">Date</Label>
                <input type="hidden" {...register("event_date")} />
                <EventDatePicker
                    id="event_date"
                    value={watchDate}
                    minDate={todayDate}
                    onChange={(nextDate) =>
                        setValue("event_date", nextDate, { shouldDirty: true, shouldValidate: true })
                    }
                />
                {errors.event_date && <p className="text-red-600 text-sm">{errors.event_date?.message}</p>}
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

            <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input id="venue" placeholder="Enter Event venue" {...register("venue")} />
                {errors.venue && <p className="text-red-600 text-sm">{errors.venue?.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="file_name">Image</Label>
                <Input id="file_name" type="file" accept="image/*" onChange={handleFileChange} />
                {errors.file_name?.message && <p className="text-red-600 text-sm">{String(errors.file_name.message)}</p>}

                {preview && (

                    <div className="relative mt-2 h-24 w-24 sm:h-28 sm:w-28">
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
