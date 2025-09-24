import { z } from "zod";

const textRegex = /^[A-Za-z]+[A-Za-z\s(),.&'-]*$/;

export const createEventSchema = z
  .object({
     title: z
      .string()
      .trim()
      .nonempty("Event title is required")
      .min(1, "Title must be at least 1 character")
      .max(50, "Title cannot be more than 50 characters")
      .refine((val) => textRegex.test(val), {
        message: "Title contains invalid characters",
      })
      .refine((val) => !val.includes("@"), "Title cannot be an email"),


    description: z
      .string()
      .trim()
      .nonempty("Event description is required"),
    file_name: z.any().optional(),
    existingImage: z.boolean().optional(),
  })
  .superRefine(async (data, ctx) => {
    const { file_name, existingImage } = data;

    if ((!file_name || file_name.length === 0) && !existingImage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Image is required",
        path: ["file_name"],
      });
      return;
    }

    if (file_name && file_name.length > 0) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      const file = file_name[0];

      if (!allowedTypes.includes(file.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Only image files (png, jpg, jpeg, webp) are allowed",
          path: ["file_name"],
        });
        return;
      }

      const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => resolve({ width: img.width, height: img.height });
      });

      const { width, height } = dimensions;

      if (width === 1920 && height === 753) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Images with resolution 1920x753 are not allowed",
          path: ["file_name"],
        });
      }

      if (width === 1975 && height === 753) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Images with resolution 1975x753 are not allowed",
          path: ["file_name"],
        });
      }

      if (width >= 1280 && height >= 593) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Images with resolution 1280x593 or greater are not allowed",
          path: ["file_name"],
        });
      }
    }
  });

export type CreateEventFormData = z.infer<typeof createEventSchema>;
