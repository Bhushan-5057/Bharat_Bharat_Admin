import { z } from "zod";


export const createBearerSchema = z
  .object({
    title: z
      .string()
      .min(1, "Name is required")
      .refine(
        (val) => /^[A-Za-z\s]+$/.test(val) && val.trim().length > 0,
        { message: "Name must contain only letters and spaces and cannot be empty" }
      ),

    designation: z
      .string()
      .min(1, "Designation is required")
      .refine(
        (val) => /^[A-Za-z\s]+$/.test(val) && val.trim().length > 0,
        { message: "Designation must contain only letters and spaces and cannot be empty" }
      ),

    quotes: z
      .string()
      .optional()
      .transform((val) => (val ? val.trim() : val))
      .refine((val) => !val || /^[A-Za-z\s.,!?'"-]+$/.test(val), {
        message: "Quotes can only contain letters, spaces, and basic punctuation",
      }),
    gmail: z
      .string()
      .optional()
      .refine((val) => !val || /^[a-zA-Z]/.test(val), {
        message: "Email cannot start with a number",
      })
      .refine((val) => !val || /^[^\s@]+@gmail\.com$/.test(val), {
        message: "Please enter a valid Gmail address (must end with @gmail.com)",
      }),


    facebook: z.string().url("Invalid URL").optional(),
    twitter: z.string().url("Invalid URL").optional(),

    file_name: z.array(z.instanceof(File)).optional(),
    existingImage: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const file_name = data.file_name;

    if ((!file_name || file_name.length === 0) && !data.existingImage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Profile image is required",
        path: ["file_name"],
      });
    }

    if (file_name?.length) {
      const file = file_name[0];

      if (!file.type.startsWith("image/")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Only image files are allowed",
          path: ["file_name"],
        });
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width === 1920 && img.height === 953) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Images with resolution 1920x953 are not allowed",
            path: ["file_name"],
          });
        }
      };
    }
  });


export type CreateBearerFormData = z.infer<typeof createBearerSchema>;
