import { z } from "zod";
import { isEndTimeAfterStart } from "@/utils/time";

const hasUploadedFile = (value: unknown): boolean => {
  if (!value) return false;
  if (Array.isArray(value)) return value.length > 0;

  if (typeof FileList !== "undefined" && value instanceof FileList) {
    return value.length > 0;
  }

  if (typeof File !== "undefined" && value instanceof File) {
    return true;
  }

  return false;
};

const isMultiDay = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) return false;
  return endDate > startDate;
};

export const createActivitySchema = z.object({
  title: z.string().nonempty("Activity title is required"),
  description: z.string().nonempty("Activity description is required"),
  state: z.string().trim().min(1, "State is required"),
  venue: z.string().trim().min(1, "City is required"),
  date: z.string().nonempty("Start date is required"),
  end_date: z.string().optional().or(z.literal("")),

  start_time: z.string().nonempty("Start time is required"),
  end_time: z.string().nonempty("End time is required"),

  file_name: z
    .array(z.instanceof(File))
    .optional()
    .refine(
      (files) => !files || files.every((file) => file.type.startsWith("image/")),
      { message: "Only image files are allowed" }
    ),
  existingImage: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.end_date && data.date && data.end_date < data.date) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End date must be on or after start date",
      path: ["end_date"],
    });
  }

  if (
    data.start_time &&
    data.end_time &&
    !isMultiDay(data.date, data.end_date) &&
    !isEndTimeAfterStart(data.start_time, data.end_time)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End time must be later than start time",
      path: ["end_time"],
    });
  }

  if (!hasUploadedFile(data.file_name) && !data.existingImage) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "At least one image is required",
      path: ["file_name"],
    });
  }
});

export type CreateActivityFormData = z.infer<typeof createActivitySchema>;
