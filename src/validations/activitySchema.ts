import { z } from "zod";

export const createActivitySchema = z
  .object({
    title: z
      .string()
      .nonempty("Activity title is required")
      .min(1, "Title must be at least 1 character")
      .max(150, "Title cannot be more than 150 characters")
      .refine((val) => {
        const normalized = val.normalize("NFC").trim();

        return /^[\p{L}\p{M}]+(?: [\p{L}\p{M}]+)*$/u.test(normalized);
      }, "Title must contain only letters with single spaces between words; no leading/trailing spaces or hyphens")
      .refine((val) => !val.includes("@"), "Title cannot be an email"),

    description: z
      .string()
      .nonempty("Activity description is required")
      .refine((val) => val.trim().length === val.length, "Description cannot start or end with spaces"),

    file_name: z.any().optional(),
    existingImage: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const { file_name, existingImage } = data;

    if ((!file_name || file_name.length === 0) && !existingImage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Image is required",
        path: ["file_name"],
      });
    }

    if (file_name && file_name.length > 0) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/svg+xml",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file_name[0].type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Only image files are allowed",
          path: ["file_name"],
        });
      }
    }
  });

export type CreateActivityFormData = z.infer<typeof createActivitySchema>;
