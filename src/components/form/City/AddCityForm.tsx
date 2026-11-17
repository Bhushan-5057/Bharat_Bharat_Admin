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
import { CreateCityFormData, createCitySchema } from "@/validations/citySchema";
import {
    createCityThunk,
    fetchAllCitiesThunk,
} from "@/store/redux/slice/citySlice";
import { cn } from "@/lib/utils";
import CityContactPersons from "./CityContactPersons";
import { applyCityApiFieldErrors, minimumCityContacts, toCityContactPayload } from "./cityContacts";
import { INDIAN_STATES, stateSelectClassName } from "@/constants/indianStates";

export default function AddCityForm({
    closeModal,
}: {
    closeModal?: () => void;
}) {
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
        control,
        formState: { errors, isSubmitting },
    } = useForm<CreateCityFormData>({
        resolver: zodResolver(createCitySchema),
        defaultValues: {
            state: "",
            contacts: minimumCityContacts(),
        },
    });

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        const invalidFile = files.find((file) => !file.type.startsWith("image/"));

        if (invalidFile) {
            setError("file_name", {
                type: "manual",
                message: "Only image files are allowed.",
            });
            return;
        }

        const existingFiles = (watch("file_name") || []) as File[];

        const updatedFiles = [...existingFiles, ...files];

        setValue("file_name", updatedFiles as [File, ...File[]], { shouldValidate: true });
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews]);

        if (mainImageIndex === null) {

            setMainImageIndex(0);
        };
    };

    const onSubmit = async (data: CreateCityFormData) => {
        if (!data.file_name || data.file_name.length === 0) {
            setError("file_name", {
                type: "manual",
                message: "Please select at least one image.",
            });
            return;
        }

        try {
            const contacts = toCityContactPayload(data.contacts);
            const payload = {
                state: data.state || "",
                title: data.title || "",
                description: data.description || "",
                file_name: data.file_name,
                mainImageIndex: mainImageIndex ?? 0,
                contacts,
            };

            await dispatch(createCityThunk(payload)).unwrap();
            await dispatch(fetchAllCitiesThunk());

            showSuccess(MESSAGES.ADD_SUCCESS);
            reset({ state: "", contacts: minimumCityContacts() });
            setImagePreviews([]);
            setMainImageIndex(null);
            closeModal?.();
        } catch (err: unknown) {
            console.error("Add city failed:", err);
            applyCityApiFieldErrors(err, setError);
            showApiError(err, MESSAGES.ADD_ERROR);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 p-4 sm:p-6 rounded-xl border border-gray-200 bg-white max-w-2xl mx-auto w-full"
        >
            <FormField label="State" htmlFor="state" required error={errors.state?.message}>
                <select id="state" className={stateSelectClassName} {...register("state")}>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((name) => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            </FormField>
            <FormField label="Name" htmlFor="title" required error={errors.title?.message}>
                    <Input
                        id="title"
                        placeholder="Enter city name"
                        {...register("title")}
                        className="w-full"
                    />
            </FormField>
            <FormField label="Description" htmlFor="description" required error={errors.description?.message}>
                    <Textarea
                        id="description"
                        fieldSize="md"
                        placeholder="Enter a detailed description of the city"
                        {...register("description")}
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
                    <label
                        htmlFor="images"
                        className="cursor-pointer text-center w-full"
                    >
                        <div className="text-purple-600 font-medium">Click to upload</div>
                        <p className="text-sm text-gray-500">or drag and drop</p>
                    </label>
                </div>
                {errors.file_name && (
                    <p className="text-sm text-red-500 mt-1">
                        {errors.file_name.message as string}
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

            <CityContactPersons
                control={control}
                register={register}
                errors={errors}
            />

            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Save City"}
                </Button>
            </div>
        </form>
    );
}
