"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { Textarea } from "@/components/ui/textarea/textarea";
import { FormField, FormSection } from "@/components/ui/form-field";
import Button from "@/components/ui/button/Button";
import { showApiError, showError, showSuccess } from "@/lib/utils/toast";
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
      showApiError(err, MESSAGES.ADD_ERROR);
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
        <Label htmlFor="fileInput">Blog image</Label>
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
      </FormSection>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
