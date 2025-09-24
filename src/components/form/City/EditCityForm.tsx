"use client";

import React, { useState } from "react";
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
import { CreateCityFormData, createCitySchema } from "@/validations/citySchema";
import {
    deleteCityImageThunk,
    fetchAllCitiesThunk,
    updateCityThunk,
    editCitiesImageThunk,
} from "@/store/redux/slice/citySlice";
import { cn } from "@/lib/utils";
import { City } from "@/types/cityTypes";


interface EditCityFormProps {
    city: City;
    closeModal?: () => void;
}

export default function EditCityForm({ city, closeModal }: EditCityFormProps) {
    const dispatch = useDispatch<AppDispatch>();

    const [existingImages, setExistingImages] = useState(city.images || []);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    const [mainImageIndex, setMainImageIndex] = useState<number | null>(
        city.images?.findIndex((img) => img.is_main) ?? 0
    );

    const {
        register,
        handleSubmit,
        reset,
        setError,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CreateCityFormData>({
        resolver: zodResolver(createCitySchema),
        defaultValues: {
            title: city.title,
            description: city.description,
            file_name: undefined,
            existingImage: true,
        },
    });

    const handleSetMainImage = async (imageId: number) => {
        try {
            await dispatch(editCitiesImageThunk({ id: imageId, is_main: true })).unwrap();
            setExistingImages((prev) =>
                prev.map((img) => ({ ...img, is_main: Number(img.id) === imageId }))
            );
            showSuccess(MESSAGES.ADD_MAIN);
        } catch (err) {
            console.log("error in setting main image", err);
            showError(MESSAGES.ADD_ERROR);
        }
    };

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

        const existingFiles=(watch("file_name") || []) as File[];
        const updatedFiles=[...existingFiles,...files];

        setValue("file_name", updatedFiles as [File, ...File[]], { shouldValidate: true });
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setNewImagePreviews((prev)=>[...prev,...newPreviews]);

        if (mainImageIndex === null) {
            setMainImageIndex(existingImages.length);
        }
    };

    const handleDeleteImage = async (i: number) => {
        if (i < existingImages.length) {
            const imageToDelete = existingImages[i];
            try {
                await dispatch(deleteCityImageThunk(imageToDelete.id)).unwrap();
                setExistingImages((prev) => prev.filter((_, idx) => idx !== i));
                showSuccess("Image deleted successfully");

                if (mainImageIndex === i) setMainImageIndex(0);
                else if (mainImageIndex && mainImageIndex > i)
                    setMainImageIndex(mainImageIndex - 1);
            } catch (err) {
                console.log("error in deleting image", err);
                showError("Failed to delete image");
            }
        } else {
            const previewIndex = i - existingImages.length;
            setNewImagePreviews((prev) =>
                prev.filter((_, idx) => idx !== previewIndex)
            );
            const currentFiles = ((
                (document.getElementById("images") as HTMLInputElement)
                    ?.files || []
            ) as FileList);
            const newFiles = Array.from(currentFiles).filter((_, idx) => idx !== previewIndex);
            if (newFiles.length > 0) {
                setValue("file_name", newFiles as [File, ...File[]], { shouldValidate: true });
            } else {
                setValue("file_name", undefined, { shouldValidate: true });
            }

            if (mainImageIndex === i) setMainImageIndex(0);
            else if (mainImageIndex && mainImageIndex > i)
                setMainImageIndex(mainImageIndex - 1);
        }
    };

    const onSubmit = async (data: CreateCityFormData) => {
        const payload = {
            id: city.id,
            title: data.title,
            description: data.description,
            images: [
                ...existingImages.map((img, index) => ({
                    city_id: img.id,
                    file_name: img.file_name,
                    is_main: index === mainImageIndex,
                    data: img.data || null,
                })),
                ...(data.file_name || []).map((file, index) => ({
                    city_id: null,
                    file_name: file.name,
                    is_main: existingImages.length + index === mainImageIndex,
                    data: file,
                })),
            ],
        };


        try {
            await dispatch(updateCityThunk({ id: city.id, payload })).unwrap();
            await dispatch(fetchAllCitiesThunk());
            showSuccess(MESSAGES.EDIT_SUCCESS);
            reset();
            setNewImagePreviews([]);
            closeModal?.();
        } catch (err) {
            console.log("error in updating city", err);
            showError(MESSAGES.EDIT_ERROR);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 p-6 rounded-xl border border-gray-200 bg-white 
        dark:border-gray-700 dark:bg-gray-900 max-w-2xl mx-auto w-full overflow-auto"
            style={{ maxHeight: "90vh" }}
        >

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <Label htmlFor="title" className="sm:w-1/4">Name</Label>
                <div className="flex-1">
                    <Input id="title" {...register("title")} placeholder="Enter city name" />
                    {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
                </div>
            </div>


            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <Label htmlFor="description" className="sm:w-1/4">Description</Label>
                <div className="flex-1">
                    <textarea
                        id="description"
                        {...register("description")}
                        placeholder="Enter city description"
                        className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                    />
                    {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
                </div>
            </div>

            <div>
                <Label>Upload Images</Label>
                <div
                    className={cn(
                        "mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 cursor-pointer hover:border-purple-500 transition w-full"
                    )}
                >
                    <input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImagesChange}
                        className="hidden"
                    />
                    <label htmlFor="images" className="cursor-pointer text-center w-full">
                        <div className="text-purple-600 font-medium">Click to upload</div>
                        <p className="text-sm text-gray-500">or drag and drop</p>
                    </label>
                </div>

                <div className="mt-4 flex flex-wrap gap-4">
                    {[...existingImages, ...newImagePreviews].map((img, i) => {
                        let src = "";
                        if (typeof img === "string") src = img;
                        else if ("data" in img && img.data)
                            src = `data:image/png;base64,${img.data}`;
                        else if ("file_name" in img && img.file_name)
                            src = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${img.file_name}`;

                        return (
                            <div key={i} className="relative w-28 group">
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
                                                handleSetMainImage(Number(img.id));
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
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Update City"}
                </Button>
            </div>
        </form>
    );
}
