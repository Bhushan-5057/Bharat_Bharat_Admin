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
import { createBlogSchema, CreateBlogFormData } from "@/validations/blogSchema";
import { addBlog, getAllBlogs } from "@/store/redux/slice/blogSlice";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AddBlogForm({ closeModal }: { closeModal?: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const [preview, setPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch, setError, setValue, formState: { errors, isSubmitting } } = useForm<CreateBlogFormData>({
    resolver: zodResolver(createBlogSchema),
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

  const onSubmit = async (data: CreateBlogFormData) => {
    try {
      const file = data.file_name?.[0];
      if (!file) { showError("Please select an image file"); return; }

      const payload = {
        title: data.title,
        slug: data.slug,
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        content: data.content,
        tags: data.tags,
        category: data.category,
        file: file,
      };

      await dispatch(addBlog(payload)).unwrap();
      await dispatch(getAllBlogs());
      showSuccess(MESSAGES.ADD_SUCCESS);
      router.push("/blogs-table");
      closeModal?.();
      reset();
      setPreview(null);
    } catch (err: unknown) {
      console.error("Add blog failed:", err);
      const errorMessage = err && typeof err === "object" && "message" in err
        ? (err as { message: string }).message
        : MESSAGES.ADD_ERROR;
      showError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Enter blog title" {...register("title")} />
        {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" placeholder="Enter slug" {...register("slug")} />
        {errors.slug && <p className="text-red-600 text-sm">{errors.slug.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="meta_title">Meta Title</Label>
        <Input id="meta_title" placeholder="Enter meta title" {...register("meta_title")} />
        {errors.meta_title && <p className="text-red-600 text-sm">{errors.meta_title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="meta_description">Meta Description</Label>
        <textarea id="meta_description" placeholder="Enter meta description" className="w-full border rounded-md p-2 text-sm" {...register("meta_description")} />
        {errors.meta_description && <p className="text-red-600 text-sm">{errors.meta_description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <textarea id="content" placeholder="Enter blog content" className="w-full border rounded-md p-2 text-sm" {...register("content")} />
        {errors.content && <p className="text-red-600 text-sm">{errors.content.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input id="tags" placeholder="Enter tags (comma separated)" {...register("tags")} />
        {errors.tags && <p className="text-red-600 text-sm">{errors.tags.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input id="category" placeholder="Enter category" {...register("category")} />
        {errors.category && <p className="text-red-600 text-sm">{errors.category.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Blog Image</label>
        <div
          className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-32 cursor-pointer hover:border-blue-500 transition"
        >
          {!preview ? (
            <div className="flex flex-col items-center justify-center text-gray-400 pointer-events-none">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v8m0 0l-4-4m4 4l4-4m-4-8V4m0 0l-4 4m4-4l4 4" />
              </svg>
              <span>Drag & drop or click to upload</span>
            </div>
          ) : (
            <Image src={preview} alt="Preview" fill className="rounded-md object-cover" unoptimized />
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
