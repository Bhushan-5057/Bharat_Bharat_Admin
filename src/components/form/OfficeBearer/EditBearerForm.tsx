"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import Button from "@/components/ui/button/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/redux/store";
import { showError, showSuccess } from "@/lib/utils/toast";
import { createBearerSchema, CreateBearerFormData } from "@/validations/officeBearerSchema";
import { MESSAGES } from "@/components/common/constants/utlis";
import { editOfficeBearer, getAllOfficeBearers } from "@/store/redux/slice/officeBearerSlice";
import { UpdateOfficeBearerPayload } from "@/store/api/officeBearerApi";
import Image from "next/image";

export interface Bearer {
  id: string;
  title: string;
  designation: string;
  quotes?: string;
  gmail: string;
  facebook?: string;
  twitter?: string;
  file_name?: string;
  data?: string;
}

interface EditBearerFormProps {
  bearer: Bearer;
  onClose?: () => void;
}

export default function EditBearerForm({ bearer, onClose }: EditBearerFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch, setValue, setError, formState: { errors, isSubmitting } } = useForm<CreateBearerFormData>({
    resolver: zodResolver(createBearerSchema),
    defaultValues: {
      title: bearer.title || "",
      designation: bearer.designation || "",
      quotes: bearer.quotes || "",
      gmail: bearer.gmail || "",
      facebook: bearer.facebook,
      twitter: bearer.twitter,
      file_name: undefined,
    },
  });


  useEffect(() => {
    reset({
      title: bearer.title || "",
      designation: bearer.designation || "",
      quotes: bearer.quotes || "",
      gmail: bearer.gmail || "",
      facebook: bearer.facebook,
      twitter: bearer.twitter,
      file_name: undefined,
      existingImage: !!bearer.file_name || !!bearer.data,
    });

    setPreview(
      bearer.data
        ? `data:image/png;base64,${bearer.data}`
        : bearer.file_name
          ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${bearer.file_name}`
          : null
    );
  }, [bearer, reset]);

  const watchFile = watch("file_name");
  useEffect(() => {
    if (watchFile && watchFile.length > 0) {
      setPreview(URL.createObjectURL(watchFile[0]));
    }
  }, [watchFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      setError("file_name", { type: "manual", message: "Only image files are allowed." });
      return;
    }
    setValue("file_name", [file], { shouldValidate: true });
    setPreview(URL.createObjectURL(file));
  };

  const handleClick = () => fileInputRef.current?.click();

  const onSubmit = async (data: CreateBearerFormData) => {
    try {
      const payload: UpdateOfficeBearerPayload = {
        title: data.title || "",
        designation: data.designation || "",
        quotes: data.quotes || "",
        gmail: data.gmail || "",
        facebook: data.facebook || undefined,
        twitter: data.twitter || undefined,
        file_name: data.file_name?.[0],
      };

      await dispatch(editOfficeBearer({ id: bearer.id, payload })).unwrap();
      await dispatch(getAllOfficeBearers());
      showSuccess(MESSAGES.EDIT_SUCCESS);
      onClose?.();
    } catch (err: unknown) {
      console.error("Update bearer failed:", err);
      const errorMessage = err && typeof err === "object" && "message" in err
        ? (err as { message: string }).message
        : MESSAGES.EDIT_ERROR;
      showError(errorMessage);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 mt-2 max-w-lg mx-auto p-4 sm:p-6 bg-white  dark:bg-black rounded-lg overflow-auto"
      style={{ maxHeight: "90vh" }}
    >
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
          className="w-full border rounded-md p-2 text-sm resize-none sm:resize-y"
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
        <Label>Profile Image</Label>
        <div
          onClick={handleClick}
          className="cursor-pointer flex items-center justify-center border rounded-md overflow-hidden w-24 h-24 relative"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover rounded-md"
              unoptimized={true}
            />
          ) : (
            <p className="text-center px-2 text-xs">Click to select</p>
          )}
        </div>

        {errors.file_name?.message && (
          <p className="text-red-600 text-sm">{String(errors.file_name.message)}</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update"}
        </Button>
      </div>
    </form>
  );
}
