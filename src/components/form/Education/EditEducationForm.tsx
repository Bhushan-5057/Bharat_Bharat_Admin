"use client";

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/redux/store";
import { cn } from "@/lib/utils";
import {
  editEducation,
  editEducationImage,
  getAllEducations,
  getEducationImages,
  removeEducationImage,
} from "@/store/redux/slice/educationSlice";
import { Label } from "@/components/ui/label/label";
import { Input } from "@/components/ui/input/input";
import Button from "@/components/ui/button/Button";
import {
  EducationFormValues,
  educationSchema,
} from "@/validations/educationSchema";
import { showError, showSuccess } from "@/lib/utils/toast";
import { MESSAGES } from "@/components/common/constants/utlis";
import Image from "next/image";
import { Education, EducationImage } from "@/types/educationTypes";

type EditEducationFormProps = {
  education: Education;
  onClose: () => void;
};

export default function EditEducationForm({
  education,
  onClose,
}: EditEducationFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.education);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<EducationImage[]>(
    education.images || []
  );
  const [isEducationType, setIsEducationType] = useState(
    education.type === "education"
  );

  const [mainImageIndex, setMainImageIndex] = useState<number | null>(
    existingImages.findIndex((img) => img.is_main) >= 0
      ? existingImages.findIndex((img) => img.is_main)
      : 0
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      title: education.title,
      description: education.description,
      type: education.type,
      school_address: education.school_address ?? undefined,
      file_name: [],
      existingImage: existingImages.length > 0,
    },
  });

  const handleSetMainImage = async (imageId: number) => {
    try {
      await dispatch(editEducationImage({ id: imageId, is_main: true })).unwrap();
      await dispatch(getEducationImages(education.id));
      await dispatch(getAllEducations());
      setExistingImages((prev) =>
        prev.map((img) => ({ ...img, is_main: img.id === imageId }))
      );
      showSuccess(MESSAGES.ADD_MAIN);
    }
    catch (err: unknown) {
      console.error(err);
      showError(MESSAGES.DELETE_ERROR);
    }

  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    if (isEducationType) {
      if (files[0]) {
        setValue("file_name", [files[0]]);
        setImagePreviews([URL.createObjectURL(files[0])]);
        setExistingImages([]);
        setMainImageIndex(0);
      }
    } else {

      const existingFiles = (watch("file_name") || []) as File[];
      const updatedFiles = [...existingFiles, ...files];

      setValue("file_name", updatedFiles as [File, ...File[]], { shouldValidate: true });

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      if (files.length > 0) setMainImageIndex(existingImages.length);
    }
  };

  const handleDeleteImage = async (i: number) => {
    if (i < existingImages.length) {
      const imageToDelete = existingImages[i];
      if (imageToDelete && imageToDelete.id) {
        try {
          await dispatch(removeEducationImage(imageToDelete.id)).unwrap();
          await dispatch(getEducationImages(education.id));
          await dispatch(getAllEducations());
          setExistingImages((prev) => prev.filter((_, idx) => idx !== i));
          showSuccess(MESSAGES.DELETE_SUCCESS);

          if (mainImageIndex === i) setMainImageIndex(0);
          else if (mainImageIndex && mainImageIndex > i)
            setMainImageIndex(mainImageIndex - 1);
        }
        catch (err: unknown) {
          console.error(err);
          showError(MESSAGES.DELETE_ERROR);
        }

      }
    } else {
      const previewIndex = i - existingImages.length;
      setImagePreviews((prev) =>
        prev.filter((_, idx) => idx !== previewIndex)
      );
      const currentFiles = (watch("file_name") || []) as File[];
      setValue(
        "file_name",
        currentFiles.filter((_, idx) => idx !== previewIndex)
      );

      if (mainImageIndex === i) setMainImageIndex(0);
      else if (mainImageIndex && mainImageIndex > i)
        setMainImageIndex(mainImageIndex - 1);
    }
  };

  const onSubmit: SubmitHandler<EducationFormValues> = async (data) => {
    const payload = {
      id: education.id,
      title: data.title,
      description: data.description,
      type: data.type!,
      school_address: data.school_address,
      images: [
        ...existingImages.map((img, index) => ({
          education_id: img.id,
          is_main: index === mainImageIndex,
        })),
        ...(data.file_name || []).map((file, index) => ({
          education_id: undefined,
          is_main: existingImages.length + index === mainImageIndex,
          data: file,
        })),
      ],
    };

    try {
      await dispatch(editEducation({ id: education.id, payload })).unwrap();
      await dispatch(getAllEducations());
      showSuccess(MESSAGES.EDIT_SUCCESS);
      onClose();
    } catch (err) {
      console.error("Failed to update education:", err);
      showError(MESSAGES.EDIT_ERROR);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 mt-4 overflow-y-hidden p-6 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 max-w-3xl mx-auto w-full"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <Label htmlFor="title" className="sm:w-1/4">
          Title
        </Label>
        <div className="flex-1">
          <Input
            id="title"
            placeholder="Enter title"
            {...register("title")}
            className="mt-1 w-full"
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <Label htmlFor="description" className="sm:w-1/4">
          Description
        </Label>
        <div className="flex-1">
          <Input
            id="description"
            placeholder="Enter description"
            {...register("description")}
            className="mt-1 w-full"
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <label htmlFor="type" className="sm:w-1/4 font-medium">
          Type
        </label>
        <div className="flex-1">
          <select
            id="type"
            {...register("type")}
            onChange={(e) => {
              const value = e.target.value as "education" | "school";
              setValue("type", value);
              setIsEducationType(value === "education");
              setImagePreviews([]);
              setExistingImages([]);
              setMainImageIndex(0);
            }}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">Select type</option>
            <option value={"education"}>Education</option>
            <option value={"school"}>School</option>
          </select>
          {errors.type && (
            <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
          )}
        </div>
      </div>
      {!isEducationType && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <Label htmlFor="school_address" className="sm:w-1/4">
            School Address
          </Label>
          <div className="flex-1">
            <Input
              id="school_address"
              placeholder="Enter address"
              {...register("school_address")}
              className="mt-1 w-full"
            />
            {errors.school_address && (
              <p className="text-sm text-red-500 mt-1">
                {errors.school_address.message}
              </p>
            )}
          </div>
        </div>
      )}
      <div>
        <Label>
          Upload {isEducationType ? "Single Image" : "Multiple Images"}
        </Label>
        <div
          className={cn(
            "mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 cursor-pointer hover:border-purple-500 transition w-full"
          )}
        >
          <input
            type="file"
            accept="image/*"
            multiple={!isEducationType}
            onChange={handleImagesChange}
            className="hidden"
            id="images"
          />
          <label
            htmlFor="images"
            className={cn(
              "cursor-pointer text-center w-full",
              isEducationType &&
                (existingImages.length > 0 || imagePreviews.length > 0)
                ? "opacity-50 cursor-not-allowed"
                : ""
            )}
          >
            <div className="text-purple-600 font-medium">
              {isEducationType &&
                (existingImages.length > 0 || imagePreviews.length > 0)
                ? "Remove existing image to upload"
                : "Click to upload"}
            </div>
            <p className="text-sm text-gray-500">or drag and drop</p>
          </label>
        </div>
        {(existingImages.length > 0 || imagePreviews.length > 0) && (
          <div className="mt-2 flex flex-wrap gap-4">
            {[...existingImages, ...imagePreviews].map((img, i) => {
              let src = "";

              if (typeof img === "string") {
                src = img;
              } else if ("data" in img && img.data) {
                src = `data:image/png;base64,${img.data}`;
              } else if ("file_name" in img && img.file_name) {
                src = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${img.file_name}`;
              }

              return (
                <div key={i} className="relative group w-28">
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
                          handleSetMainImage(img.id);
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
        )}
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Education"}
        </Button>
      </div>
    </form>
  );
}

