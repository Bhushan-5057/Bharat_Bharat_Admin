// "use client";

// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Input } from "@/components/ui/input/input";
// import Button from "@/components/ui/button/Button";
// import { showError, showSuccess } from "@/lib/utils/toast";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/store/redux/store";
// import Image from "next/image";

// import {
//   CreateActivityFormData,
//   createActivitySchema,
// } from "@/validations/activitySchema";

// import {
//   createActivityThunk,
//   fetchAllActivitiesThunk,
// } from "@/store/redux/slice/activitySlice";

// import ActivityDateTimePickers from "@/components/form/Activity/ActivityDateTimePickers";

// const combineDateAndTime = (dateStr: string | undefined | null, timeStr: string | undefined | null): string => {
//   if (!dateStr || !timeStr) return "";
//   if (timeStr.includes("T")) return timeStr;
//   try {
//     const combinedDate = new Date(`${dateStr}T${timeStr}`);
//     if (!isNaN(combinedDate.getTime())) {
//       return combinedDate.toISOString();
//     }
//   } catch (e) {
//     console.error("Error combining date and time:", e);
//   }
//   return "";
// };

// type AddActivityFormProps = {
//   closeModal?: () => void;
// };

// const extractFile = (value: unknown): File | undefined => {
//   if (!value) return undefined;
//   if (value instanceof File) return value;
//   if (Array.isArray(value) && value[0] instanceof File) return value[0];
//   if (typeof FileList !== "undefined" && value instanceof FileList) {
//     return value[0];
//   }
//   return undefined;
// };

// export default function AddActivityForm({ closeModal }: AddActivityFormProps) {
//   const dispatch = useDispatch<AppDispatch>();

//   const [preview, setPreview] = useState<string | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     clearErrors,
//     watch,
//     setValue,
//     formState: { errors, isSubmitting },
//   } = useForm<CreateActivityFormData>({
//     resolver: zodResolver(createActivitySchema),
//     defaultValues: {
//       date: "",
//       start_time: "",
//       end_time: "",
//       file_name: [],
//       existingImage: false,
//     },
//   });

//   const watchFile = watch("file_name");

//   useEffect(() => {
//     const fileFromForm = extractFile(watchFile);
//     const file = selectedFile ?? fileFromForm;

//     if (!file) {
//       setPreview(null);
//       return;
//     }

//     const objectUrl = URL.createObjectURL(file);
//     setPreview(objectUrl);

//     return () => {
//       URL.revokeObjectURL(objectUrl);
//     };
//   }, [watchFile, selectedFile]);

//   const onSubmit = async (data: CreateActivityFormData) => {
//     const file = selectedFile ?? extractFile(data.file_name);

//     try {
//       const payload = {
//         title: data.title,
//         description: data.description,
//         venue: data.venue,
//         date: data.date,
//         start_time: combineDateAndTime(data.date, data.start_time),
//         end_time: combineDateAndTime(data.date, data.end_time),
//         file_name: file,
//       };

//       await dispatch(createActivityThunk(payload)).unwrap();
//       await dispatch(fetchAllActivitiesThunk());

//       showSuccess("Created successfully");

//       reset();
//       setSelectedFile(null);
//       setPreview(null);
//       closeModal?.();
//     } catch (err) {
//       console.error(err);
//       showError("Create failed");
//     }
//   };

//   const onInvalid = (formErrors: typeof errors) => {
//     console.error("Activity form validation errors:", formErrors);
//     showError("Please fill all required fields correctly.");
//   };

//   const fileErrorMessage =
//     typeof errors.file_name?.message === "string"
//       ? errors.file_name.message
//       : undefined;

//   return (
//     <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">

//       <Input {...register("title")} placeholder="Title" />
//       <Input {...register("description")} placeholder="Description" />
//       <Input {...register("venue")} placeholder="Venue" />

//       {/* DATE + TIME */}
//       <ActivityDateTimePickers
//         date={watch("date") || ""}
//         start_time={watch("start_time") || ""}
//         end_time={watch("end_time") || ""}
//         onDateChange={(v) => setValue("date", v)}
//         onStartTimeChange={(v) => setValue("start_time", v)}
//         onEndTimeChange={(v) => setValue("end_time", v)}
//       />

//       {/* FILE */}
//       <Input
//         type="file"
//         accept="image/*"
//         {...register("file_name", {
//           onChange: (e) => {
//             const file = e.target.files?.[0] as File | undefined;
//             const nextValue = file ? [file] : [];
//             setSelectedFile(file ?? null);
//             setValue("file_name", nextValue, {
//               shouldDirty: true,
//               shouldValidate: true,
//             });
//             setValue("existingImage", Boolean(file), { shouldValidate: true });
//             if (file) {
//               clearErrors("file_name");
//             }
//           },
//         })}
//       />

//       {fileErrorMessage && (
//         <p className="text-sm text-red-500">{fileErrorMessage}</p>
//       )}

//       {preview && (
//         <Image
//           src={preview}
//           alt="preview"
//           width={80}
//           height={80}
//           style={{ width: "auto", height: "auto" }}
//         />
//       )}

//       <Button type="submit" disabled={isSubmitting}>
//         {isSubmitting ? "Saving..." : "Submit"}
//       </Button>
//     </form>
//   );
// }



"use client";

import React, { useState } from "react";
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
import Image from "next/image";
import { cn } from "@/lib/utils";

import {
  CreateActivityFormData,
  createActivitySchema,
} from "@/validations/activitySchema";

import {
  createActivityThunk,
  fetchAllActivitiesThunk,
} from "@/store/redux/slice/activitySlice";

import ActivityDateTimePickers from "@/components/form/Activity/ActivityDateTimePickers";
import { timeToHHMM } from "@/utils/time";
import StateCityFields from "@/components/form/StateCityFields";

const normalizeDateForPayload = (dateValue: string | undefined | null): string => {
  if (!dateValue) return "";
  const input = dateValue.trim();
  if (!input) return "";

  const ymdMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymdMatch) {
    return `${ymdMatch[1]}-${ymdMatch[2]}-${ymdMatch[3]}`;
  }

  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

type AddActivityFormProps = {
  closeModal?: () => void;
};

export default function AddActivityForm({ closeModal }: AddActivityFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateActivityFormData>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      state: "",
      venue: "",
      date: "",
      end_date: "",
      start_time: "",
      end_time: "",
      file_name: [],
      existingImage: false,
    },
  });

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const existingFiles = (watch("file_name") || []) as File[];
    const updatedFiles = [...existingFiles, ...files];

    setValue("file_name", updatedFiles as [File, ...File[]], {
      shouldValidate: true,
    });
    setValue("existingImage", updatedFiles.length > 0, { shouldValidate: true });
    clearErrors("file_name");
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    if (mainImageIndex === null) {
      setMainImageIndex(0);
    }
  };

  const onSubmit = async (data: CreateActivityFormData) => {
    if (!data.file_name || data.file_name.length === 0) {
      showError("Please select at least one image.");
      return;
    }

    try {
      const payload = {
        title: data.title,
        description: data.description,
        state: data.state,
        venue: data.venue,
        date: normalizeDateForPayload(data.date),
        end_date: normalizeDateForPayload(data.end_date) || undefined,
        start_time: timeToHHMM(data.start_time),
        end_time: timeToHHMM(data.end_time),
        file_name: data.file_name,
        mainImageIndex: mainImageIndex ?? 0,
      };

      await dispatch(createActivityThunk(payload)).unwrap();
      await dispatch(fetchAllActivitiesThunk());

      showSuccess("Created successfully");

      reset();
      setImagePreviews([]);
      setMainImageIndex(null);
      closeModal?.();
    } catch (err) {
      console.error(err);
      showApiError(err, "Create failed");
    }
  };

  const onInvalid = (formErrors: typeof errors) => {
    console.error("Activity form validation errors:", formErrors);
    showError("Please fill all required fields correctly.");
  };

  const fileErrorMessage =
    typeof errors.file_name?.message === "string"
      ? errors.file_name.message
      : undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
      <FormSection title="Basic information">
      <FormField label="Title" htmlFor="title" required error={errors.title?.message}>
        <Input id="title" placeholder="Enter activity title" {...register("title")} />
      </FormField>

      <FormField label="Description" htmlFor="description" error={errors.description?.message}>
        <Textarea
          id="description"
          fieldSize="md"
          placeholder="Enter a detailed description of the activity"
          {...register("description")}
        />
      </FormField>

      <StateCityFields
        stateValue={watch("state") || ""}
        cityValue={watch("venue") || ""}
        onStateChange={(value) => setValue("state", value, { shouldDirty: true, shouldValidate: true })}
        onCityChange={(value) => setValue("venue", value, { shouldDirty: true, shouldValidate: true })}
        stateError={errors.state?.message}
        cityError={errors.venue?.message}
      />
      </FormSection>

      {/* DATE + TIME */}
      <ActivityDateTimePickers
        date={watch("date") || ""}
        end_date={watch("end_date") || ""}
        start_time={watch("start_time") || ""}
        end_time={watch("end_time") || ""}
        onDateChange={(v) => setValue("date", v, { shouldValidate: true })}
        onEndDateChange={(v) => setValue("end_date", v, { shouldValidate: true })}
        onStartTimeChange={(v) => setValue("start_time", v, { shouldValidate: true })}
        onEndTimeChange={(v) => setValue("end_time", v, { shouldValidate: true })}
      />
      
      {errors.date && <p className="text-red-600 text-sm">{errors.date.message}</p>}
      {errors.end_date && <p className="text-red-600 text-sm">{errors.end_date.message}</p>}
      {errors.start_time && <p className="text-red-600 text-sm">{errors.start_time.message}</p>}
      {errors.end_time && <p className="text-red-600 text-sm">{errors.end_time.message}</p>}

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
            id="activity-images"
          />
          <label htmlFor="activity-images" className="cursor-pointer text-center w-full">
            <div className="text-purple-600 font-medium">Click to upload</div>
            <p className="text-sm text-gray-500">or drag and drop</p>
          </label>
        </div>
        {fileErrorMessage && (
          <p className="text-sm text-red-500 mt-1">{fileErrorMessage}</p>
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
                    setImagePreviews((prev) => prev.filter((_, index) => index !== i));
                    const currentFiles = (watch("file_name") || []) as File[];
                    const newFiles = currentFiles.filter((_, index) => index !== i);
                    if (newFiles.length > 0) {
                      setValue("file_name", newFiles as [File, ...File[]], {
                        shouldValidate: true,
                      });
                    } else {
                      setValue("file_name", undefined, { shouldValidate: true });
                      setValue("existingImage", false, { shouldValidate: true });
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

      <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
        {closeModal ? (
          <Button variant="outline" type="button" onClick={closeModal} disabled={isSubmitting}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
