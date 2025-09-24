import { z } from "zod";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createCitySchema = z
  .object({
    title: z
      .string()
      .nonempty("City title is required")
      .min(1, "Title must be at least 1 character")
      .max(150, "Title cannot be more than 150 characters")
      .refine((val) => {
        const normalized = val.normalize("NFC").trim();
        return /^[\p{L}\p{M}]+(?: [\p{L}\p{M}]+)*$/u.test(normalized);
      }, "Title must contain only letters with single spaces; no leading/trailing spaces, hyphens, or numbers")
      .refine((val) => !val.includes("@"), "Title cannot be an email"),

    description: z
      .string()
      .nonempty("City description is required")
      .refine((val) => val.trim().length === val.length, "Description cannot start or end with spaces")
      .refine((val) => !emailRegex.test(val), "Description cannot contain an email address"),

    file_name: z
      .array(z.instanceof(File))
      .optional()
      .refine(
        (files) =>
          !files || files.every((file) =>
            [
              "image/png",
              "image/jpeg",
              "image/jpg",
              "image/svg+xml",
              "image/gif",
              "image/webp",
            ].includes(file.type)
          ),
        "Only image files are allowed"
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

export type CreateCityFormData = z.infer<typeof createCitySchema>;
