"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/redux/store";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import Button from "@/components/ui/button/Button";
import { showError, showSuccess } from "@/lib/utils/toast";
import Image from "next/image";
import { editBlog, getAllBlogs } from "@/store/redux/slice/blogSlice";
import { useRouter } from "next/navigation";
import { Blog } from "@/types/blogTypes";
import { CreateBlogFormData, createBlogSchema } from "@/validations/blogSchema";
import { MESSAGES } from "@/components/common/constants/utlis";
import { X } from "lucide-react";

type EditBlogFormProps = {
    blog: Blog;
    onClose?: () => void;
};

export default function EditBlogForm({ blog, onClose }: EditBlogFormProps) {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [preview, setPreview] = useState<string | null>(() => {
        if (blog.data) return `data:image/png;base64,${blog.data}`;
        if (blog.file_name) return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${blog.file_name}`;
        return null;
    });

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
            existingImage: !!blog.data || !!blog.file_name,
        },
    });

    const watchFile = watch("file_name");

    useEffect(() => {
        if (watchFile && watchFile.length > 0) {
            setPreview(URL.createObjectURL(watchFile[0]));
            setValue("existingImage", false);
        } else {
            if (blog.data) {
                setPreview(`data:image/png;base64,${blog.data}`);
                setValue("existingImage", true);
            } else if (blog.file_name) {
                setPreview(`${process.env.NEXT_PUBLIC_API_URL}/uploads/${blog.file_name}`);
                setValue("existingImage", true);
            } else {
                setPreview(null);
                setValue("existingImage", false);
            }
        }
    }, [watchFile, blog.data, blog.file_name, setValue]);

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
                data.existingImage = !!blog.data || !!blog.file_name;
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
            showError(MESSAGES.EDIT_ERROR);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")} />
                {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" {...register("slug")} />
                {errors.slug && <p className="text-red-600 text-sm">{errors.slug.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input id="meta_title" {...register("meta_title")} />
                {errors.meta_title && <p className="text-red-600 text-sm">{errors.meta_title.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <textarea
                    id="meta_description"
                    {...register("meta_description")}
                    className="w-full border rounded-md p-2 text-sm"
                />
                {errors.meta_description && (
                    <p className="text-red-600 text-sm">{errors.meta_description.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <textarea
                    id="content"
                    {...register("content")}
                    className="w-full border rounded-md p-2 text-sm"
                />
                {errors.content && <p className="text-red-600 text-sm">{errors.content.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" {...register("tags")} />
                {errors.tags && <p className="text-red-600 text-sm">{errors.tags.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" {...register("category")} />
                {errors.category && <p className="text-red-600 text-sm">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
                <Label>Blog Image</Label>
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

            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Update Blog"}
                </Button>
            </div>
        </form>
    );
}
