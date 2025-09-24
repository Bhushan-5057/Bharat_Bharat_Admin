import { z } from "zod";

const slugRegex = /^[a-z]+(?:-[a-z]+)*$/;
const lettersOnlyRegex = /^[A-Za-z\u0900-\u097F\s]+$/;
const lettersAndCommaRegex = /^[A-Za-z\u0900-\u097F\s,]+$/;
const lettersWithPunctuationRegex = /^[A-Za-z\u0900-\u097F\s|:()-]+$/;

export const createBlogSchema = z
  .object({
    title: z
      .string()
      .min(2, "Title is required")
      .refine((val) => lettersOnlyRegex.test(val.trim()), {
        message: "Title can only contain letters and spaces",
      })
      .refine((val) => !/\d/.test(val), "Numbers are not allowed")
      .refine((val) => !val.includes("@"), "Emails are not allowed"),

    slug: z
      .string()
      .min(2, "Slug is required")
      .refine((val) => slugRegex.test(val), {
        message: "Slug must be lowercase letters and hyphens only",
      }),

    meta_title: z
      .string()
      .min(2, "Meta title is required")
      .refine((val) => lettersWithPunctuationRegex.test(val.trim()), {
        message: "Meta title can only contain letters, spaces, and punctuation like | - : ( )",
      })
      .refine((val) => !/\d/.test(val), "Numbers are not allowed")
      .refine((val) => !val.includes("@"), "Emails are not allowed"),

    meta_description: z
      .string()
      .min(5, "Meta description is required")
      .refine((val) => val.trim().length > 0, {
        message: "Meta description cannot be empty",
      }),

    content: z
      .string()
      .min(5, "Content is required")
      .refine((val) => val.trim().length > 0, {
        message: "Content cannot be empty",
      })
      .refine((val) => !val.includes("@"), {
        message: "Emails are not allowed in content",
      }),

    tags: z
      .string()
      .min(2, "Tags are required")
      .refine((val) => lettersAndCommaRegex.test(val.trim()), {
        message: "Tags can only contain letters, spaces, and commas",
      })
      .refine((val) => !/\d/.test(val), "Numbers are not allowed")
      .refine((val) => !val.includes("@"), "Emails are not allowed"),

    category: z
      .string()
      .min(2, "Category is required")
      .refine((val) => lettersOnlyRegex.test(val.trim()), {
        message: "Category can only contain letters and spaces",
      })
      .refine((val) => !/\d/.test(val), "Numbers are not allowed")
      .refine((val) => !val.includes("@"), "Emails are not allowed"),

    file_name: z.array(z.instanceof(File)).optional(),
    existingImage: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const file_name = data.file_name;

    if ((!file_name || file_name.length === 0) && !data.existingImage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Blog image is required",
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
    }
  });

export type CreateBlogFormData = z.infer<typeof createBlogSchema>;
