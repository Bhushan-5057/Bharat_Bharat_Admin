import { z } from "zod";

const getImageDimensions = (file: File): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(url);
    };
    img.onerror = reject;
    img.src = url;
  });

export const imageSchema = z.object({
  image: z
    .instanceof(File, { message: "File is required" })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Only image files are allowed",
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Image must be less than 5MB",
    })
    .superRefine(async (file, ctx) => {
      try {
        const { width, height } = await getImageDimensions(file);
        if (width !== 1920 || height !== 753) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Image must be exactly 1920×753 px",
          });
        }
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Could not read image dimensions",
        });
      }
    }),
});

export type ImageFormData = z.infer<typeof imageSchema>;

