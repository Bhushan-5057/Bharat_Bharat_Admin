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
import { createBearerSchema, CreateBearerFormData } from "@/validations/officeBearerSchema";
import { addOfficeBearer, getAllOfficeBearers } from "@/store/redux/slice/officeBearerSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AddBearerForm({ closeModal }: { closeModal?: () => void }) {
    const dispatch = useDispatch<AppDispatch>();
    const [preview, setPreview] = useState<string | null>(null);

    const { register, handleSubmit, reset, watch, setError, setValue, formState: { errors, isSubmitting } } = useForm<CreateBearerFormData>({
        resolver: zodResolver(createBearerSchema),
    });

    const router = useRouter();

    const watchFile = watch("file_name");
    useEffect(() => {
        if (watchFile && watchFile.length > 0) setPreview(URL.createObjectURL(watchFile[0]));
        else setPreview(null);
    }, [watchFile]);

    const handleFileChange = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];

        if (!file.type.startsWith("image/")) {
            setError("file_name", { type: "manual", message: "Only image files are allowed." });
            return;
        }

        setValue("file_name", [file], { shouldValidate: true });
    };

    const onSubmit = async (data: CreateBearerFormData) => {
        try {

            const payload = {
                title: data.title || "",
                designation: data.designation || "",
                quotes: data.quotes || "",
                gmail: data.gmail || "",
                facebook: data.facebook || undefined,
                twitter: data.twitter || undefined,
                file_name: data.file_name?.[0],
            };

            await dispatch(addOfficeBearer(payload)).unwrap();
            await dispatch(getAllOfficeBearers());

            showSuccess(MESSAGES.ADD_SUCCESS);
            router.push("/bearer-table");
            closeModal?.();
            reset();
            setPreview(null);
        } catch (err: unknown) {
            console.error("Add bearer failed:", err);
            const errorMessage = err && typeof err === "object" && "message" in err
                ? (err as { message: string }).message
                : MESSAGES.ADD_ERROR;
            showError(errorMessage);
        }
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                router.push("/bearer-table");
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [router]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">

            <div className="space-y-2">
                <Label htmlFor="title">Name</Label>
                <Input id="title" placeholder="Enter name" {...register("title")} />
                {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input id="designation" placeholder="Enter designation" {...register("designation")} />
                {errors.designation && <p className="text-red-600 text-sm">{errors.designation.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="quotes">Quotes</Label>
                <textarea
                    id="quotes"
                    placeholder="Enter quotes"
                    className="w-full border rounded-md p-2 text-sm"
                    {...register("quotes")}
                />
                {errors.quotes && <p className="text-red-600 text-sm">{errors.quotes.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="gmail">Email</Label>
                <Input id="gmail" type="email" placeholder="Enter email" {...register("gmail")} />
                {errors.gmail && <p className="text-red-600 text-sm">{errors.gmail.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="facebook">Facebook URL</Label>
                <Input id="facebook" placeholder="Enter Facebook profile URL" {...register("facebook")} />
                {errors.facebook && <p className="text-red-600 text-sm">{errors.facebook.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="twitter">Twitter URL</Label>
                <Input id="twitter" placeholder="Enter Twitter profile URL" {...register("twitter")} />
                {errors.twitter && <p className="text-red-600 text-sm">{errors.twitter.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                <div
                    className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-32 cursor-pointer hover:border-blue-500 transition"
                    onClick={() => document.getElementById("fileInput")?.click()}
                >
                    {!preview ? (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v8m0 0l-4-4m4 4l4-4m-4-8V4m0 0l-4 4m4-4l4 4" />
                            </svg>
                            <span>Drag & drop or click to upload</span>
                        </div>
                    ) : (
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="rounded-md object-cover"
                            unoptimized={true}
                        />
                    )}
                    <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => handleFileChange(e.target.files)}
                    />
                </div>
                {errors.file_name && <p className="text-red-600 text-sm">{errors.file_name.message}</p>}
            </div>

            <div className="flex justify-end">
                <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
            </div>
        </form>
    );
}
