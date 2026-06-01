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

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input/input";
import Button from "@/components/ui/button/Button";
import { showError, showSuccess } from "@/lib/utils/toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/redux/store";
import Image from "next/image";

import {
  CreateActivityFormData,
  createActivitySchema,
} from "@/validations/activitySchema";

import {
  createActivityThunk,
  fetchAllActivitiesThunk,
} from "@/store/redux/slice/activitySlice";

import ActivityDateTimePickers from "@/components/form/Activity/ActivityDateTimePickers";

const formatTimeForPayload = (timeStr: string | undefined | null): string => {
  if (!timeStr) return "";

  const plainTimeMatch = timeStr.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
  if (plainTimeMatch) {
    return `${plainTimeMatch[1]}:${plainTimeMatch[2]}`;
  }

  if (timeStr.includes("T")) {
    const isoTimeMatch = timeStr.match(/T(\d{2}):(\d{2})/);
    if (isoTimeMatch) {
      return `${isoTimeMatch[1]}:${isoTimeMatch[2]}`;
    }
  }

  try {
    const parsed = new Date(timeStr);
    if (!Number.isNaN(parsed.getTime())) {
      const hh = String(parsed.getHours()).padStart(2, "0");
      const mm = String(parsed.getMinutes()).padStart(2, "0");
      return `${hh}:${mm}`;
    }
  } catch (e) {
    console.error("Error formatting time:", e);
  }

  return "";
};

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

const extractFile = (value: unknown): File | undefined => {
  if (!value) return undefined;
  if (value instanceof File) return value;
  if (Array.isArray(value) && value[0] instanceof File) return value[0];
  if (typeof FileList !== "undefined" && value instanceof FileList) {
    return value[0];
  }
  return undefined;
};

export default function AddActivityForm({ closeModal }: AddActivityFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      date: "",
      start_time: "",
      end_time: "",
      file_name: [],
      existingImage: false,
    },
  });

  const watchFile = watch("file_name");

  useEffect(() => {
    const fileFromForm = extractFile(watchFile);
    const file = selectedFile ?? fileFromForm;

    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [watchFile, selectedFile]);

  const onSubmit = async (data: CreateActivityFormData) => {
    const file = selectedFile ?? extractFile(data.file_name);

    try {
      const payload = {
        title: data.title,
        description: data.description,
        venue: data.venue,
        date: normalizeDateForPayload(data.date),
        start_time: formatTimeForPayload(data.start_time),
        end_time: formatTimeForPayload(data.end_time),
        file_name: file,
      };

      await dispatch(createActivityThunk(payload)).unwrap();
      await dispatch(fetchAllActivitiesThunk());

      showSuccess("Created successfully");

      reset();
      setSelectedFile(null);
      setPreview(null);
      closeModal?.();
    } catch (err) {
      console.error(err);
      showError("Create failed");
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
      <div className="space-y-2">
        <Input {...register("title")} placeholder="Title" />
        {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Input {...register("description")} placeholder="Description" />
        {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Input {...register("venue")} placeholder="Venue" />
        {errors.venue && <p className="text-red-600 text-sm">{errors.venue.message}</p>}
      </div>

      {/* DATE + TIME */}
      <ActivityDateTimePickers
        date={watch("date") || ""}
        start_time={watch("start_time") || ""}
        end_time={watch("end_time") || ""}
        onDateChange={(v) => setValue("date", v)}
        onStartTimeChange={(v) => setValue("start_time", v)}
        onEndTimeChange={(v) => setValue("end_time", v)}
      />
      
      {errors.date && <p className="text-red-600 text-sm">{errors.date.message}</p>}
      {errors.start_time && <p className="text-red-600 text-sm">{errors.start_time.message}</p>}
      {errors.end_time && <p className="text-red-600 text-sm">{errors.end_time.message}</p>}

      {/* FILE */}
      <div className="space-y-2">
        <Input
          type="file"
          accept="image/*"
          {...register("file_name", {
            onChange: (e) => {
              const file = e.target.files?.[0] as File | undefined;
              const nextValue = file ? [file] : [];
              setSelectedFile(file ?? null);
              setValue("file_name", nextValue, {
                shouldDirty: true,
                shouldValidate: true,
              });
              setValue("existingImage", Boolean(file), { shouldValidate: true });
              if (file) {
                clearErrors("file_name");
              }
            },
          })}
        />

        {fileErrorMessage && (
          <p className="text-sm text-red-500">{fileErrorMessage}</p>
        )}

        {preview && (
          <div className="relative mt-2 h-24 w-24 sm:h-28 sm:w-28">
            <Image
              src={preview}
              alt="preview"
              fill
              className="rounded-md object-contain border"
              unoptimized={true}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
