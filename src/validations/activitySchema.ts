import { z } from "zod";

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

export const createActivitySchema = z.object({
  title: z.string().nonempty("Activity title is required"),
  description: z.string().nonempty("Activity description is required"),
  venue: z.string().nonempty("Venue is required"),
  date: z.string().nonempty("Date is required"),

  start_time: z.string().nonempty("Start time is required"),
  end_time: z.string().nonempty("End time is required"),

  file_name: z.any().optional(),
  existingImage: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.start_time && data.end_time) {
    const start = new Date(`1970-01-01T${data.start_time}`);
    const end = new Date(`1970-01-01T${data.end_time}`);

    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End time must be greater than start time",
        path: ["end_time"],
      });
    }
  }

  if (!hasUploadedFile(data.file_name) && !data.existingImage) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Image is required",
      path: ["file_name"],
    });
  }
});

export type CreateActivityFormData = z.infer<typeof createActivitySchema>;
