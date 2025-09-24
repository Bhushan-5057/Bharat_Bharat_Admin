import { z } from "zod";

export const educationSchema = z.object({
  title: z
    .string()
    .nonempty("Education title is required")
    .min(1, "Title must be at least 1 character")
    .max(150, "Title cannot be more than 150 characters")
    .refine((val) => {
      const normalized = val.normalize("NFC").trim();
      return /^[\p{L}\p{M}]+(?: [\p{L}\p{M}]+)*$/u.test(normalized);
    }, "Title must contain only letters with single spaces; no leading/trailing spaces, hyphens, or numbers")
    .refine((val) => !val.includes("@"), "Title cannot be an email"),
  description: z
    .string()
    .min(5, "Description is required")
    .refine((val) => val.trim().length > 0, { message: "Description cannot be empty" }),
  type: z.enum(["education", "school"], { required_error: "Please select a type" }),
  school_address: z
    .string()
    .optional()
    .refine((val) => !val || val.trim().length > 0, { message: "School address cannot be empty" }),
  file_name: z
    .array(z.instanceof(File))
    .optional()
    .refine((files) => !files || files.every((file) => file.type.startsWith("image/")), {
      message: "Only image files are allowed",
    }),
  existingImage: z.boolean().optional(),
}).superRefine((data, ctx) => {
  const { file_name, existingImage, type, school_address } = data;

  if ((!file_name || file_name.length === 0) && !existingImage) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "At least one image is required",
      path: ["file_name"],
    });
  }

  if (type === "school" && (!school_address || school_address.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "School address is required",
      path: ["school_address"],
    });
  }
});

export type EducationFormValues = z.infer<typeof educationSchema>;
