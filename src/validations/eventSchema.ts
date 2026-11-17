import { z } from "zod";
import { areTimesEqual, isEndTimeAfterStart } from "@/utils/time";

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

export const createEventSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  state: z.string().trim().min(1, "State is required"),
  venue: z.string().trim().min(1, "City is required"),
  event_date: z.string().nonempty(),
  end_date: z.string().optional().or(z.literal("")),
  start_time: z.string().nonempty(),
  end_time: z.string().nonempty(),
  file_name: z
    .array(z.instanceof(File))
    .optional()
    .refine(
      (files) => !files || files.every((file) => file.type.startsWith("image/")),
      { message: "Only image files are allowed" }
    ),
  existingImage: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.end_date && data.event_date && data.end_date < data.event_date) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End date must be on or after start date",
      path: ["end_date"],
    });
  }

  const { start_time, end_time } = data;
  const multiDay = isMultiDay(data.event_date, data.end_date);

  if (!multiDay) {
    if (areTimesEqual(start_time, end_time)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start time and end time cannot be the same",
        path: ["end_time"],
      });
    } else if (!isEndTimeAfterStart(start_time, end_time)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End time must be later than start time",
        path: ["end_time"],
      });
    }
  }

  if (!hasUploadedFile(data.file_name) && !data.existingImage) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "At least one image is required",
      path: ["file_name"],
    });
  }
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;
