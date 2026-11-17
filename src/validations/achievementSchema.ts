import { z } from "zod";

export const achievementSchema = z
  .object({
    title: z
      .string()
      .nonempty("Achievement title is required")
      .min(1, "Title must be at least 1 character")
      .max(150, "Title cannot be more than 150 characters")
      .refine((val) => {
        const normalized = val.normalize("NFC").trim();
        return /^[\p{L}\p{M}0-9\s.,()-]+$/u.test(normalized);
      }, "Title contains invalid characters. Only letters, numbers, spaces, hyphens, parentheses, commas, and periods are allowed")
      .refine((val) => !val.includes("@"), "Title cannot be an email"),

    description: z
      .string()
      .min(5, "Description is required")
      .refine((val) => val.trim().length > 0, {
        message: "Description cannot be empty",
      }),

    address: z
      .string()
      .optional()
      .refine((val) => !val || val.trim().length > 0, {
        message: "Address cannot be empty",
      }),

    file_name: z
      .array(z.instanceof(File))
      .optional()
      .refine(
        (files) => !files || files.every((file) => file.type.startsWith("image/")),
        { message: "Only image files are allowed" }
      ),

    existingImage: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const { file_name, existingImage } = data;

    if ((!file_name || file_name.length === 0) && !existingImage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one image is required",
        path: ["file_name"],
      });
    }
  });

export type AchievementFormValues = z.infer<typeof achievementSchema>;
