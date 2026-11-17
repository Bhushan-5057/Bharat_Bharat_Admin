"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/redux/store";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { Textarea } from "@/components/ui/textarea/textarea";
import { FormField, FormSection } from "@/components/ui/form-field";
import Button from "@/components/ui/button/Button";
import { showApiError, showError, showSuccess } from "@/lib/utils/toast";
import Image from "next/image";
import { editBlog, getAllBlogs } from "@/store/redux/slice/blogSlice";
import { useRouter } from "next/navigation";
import { Blog } from "@/types/blogTypes";
import { CreateBlogFormData, createBlogSchema } from "@/validations/blogSchema";
import { MESSAGES } from "@/components/common/constants/utlis";
import { X } from "lucide-react";
import { getMediaUrl } from "@/utils/mediaUrl";

type EditBlogFormProps = {
    blog: Blog;
    onClose?: () => void;
};

export default function EditBlogForm({ blog, onClose }: EditBlogFormProps) {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [preview, setPreview] = useState<string | null>(() => getMediaUrl(blog) || null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateBlogFormData>({
        resolver: zodResolver(createBlogSchema),
        defaultValues: {
            title: blog.title,
            slug: blog.slug,
            meta_title: blog.meta_title,
            meta_description: blog.meta_description,
            content: blog.content,
            tags: blog.tags,
            category: blog.category,
            file_name: undefined,
            existingImage: !!getMediaUrl(blog),
        },
    });

    const watchFile = watch("file_name");

    useEffect(() => {
        if (watchFile && watchFile.length > 0) {
            setPreview(URL.createObjectURL(watchFile[0]));
            setValue("existingImage", false);
        } else {
            const existingSrc = getMediaUrl(blog);
            if (existingSrc) {
                setPreview(existingSrc);
                setValue("existingImage", true);
            } else {
                setPreview(null);
                setValue("existingImage", false);
            }
        }
    }, [watchFile, blog, setValue]);

    const handleFileChange = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        if (!file.type.startsWith("image/")) {
            showError("Only image files are allowed.");
            return;
        }
        setValue("file_name", [file], { shouldValidate: true });
        setPreview(URL.createObjectURL(file));
        setValue("existingImage", false);
    };

    const handleRemoveImage = () => {
        setValue("file_name", undefined, { shouldValidate: true });
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const onSubmit: SubmitHandler<CreateBlogFormData> = async (data) => {
        try {
            if (!data.file_name || data.file_name.length === 0) {
                data.existingImage = !!getMediaUrl(blog);
            }

            const payload = {
                id: blog.id,
                title: data.title,
                slug: data.slug,
                meta_title: data.meta_title,
                meta_description: data.meta_description,
                content: data.content,
                tags: data.tags,
                category: data.category,
                file: data.file_name?.[0] || undefined,
            };

            await dispatch(editBlog(payload)).unwrap();
            await dispatch(getAllBlogs());
            showSuccess(MESSAGES.EDIT_SUCCESS);
            onClose?.();
            router.push("/blogs-table");
            reset();
            setPreview(null);
        } catch (err) {
            console.error(err);
            showApiError(err, MESSAGES.EDIT_ERROR);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4">
            <FormSection title="Basic information">
            <FormField label="Title" htmlFor="title" required error={errors.title?.message}>
                <Input id="title" placeholder="Enter blog title" {...register("title")} />
            </FormField>
            <FormField label="Slug" htmlFor="slug" required error={errors.slug?.message}>
                <Input id="slug" placeholder="Enter URL slug" {...register("slug")} />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Category" htmlFor="category" error={errors.category?.message}>
                    <Input id="category" placeholder="Enter category" {...register("category")} />
                </FormField>
                <FormField label="Tags" htmlFor="tags" hint="Comma-separated" error={errors.tags?.message}>
                    <Input id="tags" placeholder="education, culture, news" {...register("tags")} />
                </FormField>
            </div>
            </FormSection>

            <FormSection title="SEO">
            <FormField label="Meta title" htmlFor="meta_title" error={errors.meta_title?.message}>
                <Input id="meta_title" placeholder="Enter meta title" {...register("meta_title")} />
            </FormField>
            <FormField label="Meta description" htmlFor="meta_description" error={errors.meta_description?.message}>
                <Textarea
                    id="meta_description"
                    fieldSize="sm"
                    placeholder="Enter a short summary for search results"
                    {...register("meta_description")}
                />
            </FormField>
            </FormSection>

            <FormSection title="Content">
            <FormField label="Content" htmlFor="content" required error={errors.content?.message}>
                <Textarea
                    id="content"
                    fieldSize="lg"
                    placeholder="Write the full blog content"
                    {...register("content")}
                />
            </FormField>
            </FormSection>

            <FormSection title="Media">
            <div className="space-y-2">
                <Label>Blog image</Label>
                <p className="text-xs text-gray-500">
                    {getMediaUrl(blog) && !watch("file_name")?.length ? "Current saved image. Click to replace." : "Upload or replace the blog image."}
                </p>
                <div
                    className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-32 cursor-pointer hover:border-blue-500 transition"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {!preview ? (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                            <span>Drag & drop or click to upload</span>
                        </div>
                    ) : (
                        <div className="relative w-full h-full">
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="rounded-md object-cover"
                                unoptimized
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => handleFileChange(e.target.files)}
                    />
                </div>
                {errors.file_name && <p className="text-red-600 text-sm">{errors.file_name.message}</p>}
            </div>
            </FormSection>

            <div className="flex justify-end gap-2">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                </Button>
            </div>
        </form>
    );
}
