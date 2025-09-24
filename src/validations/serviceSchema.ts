import { z } from "zod";

export const createServiceSchema = z
  .object({
    title: z
      .string()
      .min(1, "Service title is required")
      .regex(
        /^[A-Za-z]+(?: [A-Za-z]+)*$/,
        "Title must contain only letters with single spaces between words"
      )
      .refine((val) => !val.includes("@"), "Title cannot be an email"),

    description: z
      .string()
      .min(1, "Service description is required"),

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
      if (file_name[0].type !== "image/svg+xml") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Only SVG files are allowed",
          path: ["file_name"],
        });
      }
    }
  });

export type CreateServiceFormData = z.infer<typeof createServiceSchema>;
