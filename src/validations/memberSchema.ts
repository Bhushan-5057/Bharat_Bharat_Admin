import { z } from "zod";
import { MEMBER_CATEGORIES } from "@/types/memberTypes";

const textWithParenthesesRegex = /^[A-Za-z\s.'()\-]+$/;

export const memberSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .transform((value) => value.trim())
      .refine((value) => textWithParenthesesRegex.test(value), {
        message: "Name must contain only letters, spaces and parentheses",
      }),
    category: z.enum(MEMBER_CATEGORIES, {
      required_error: "Category is required",
    }),
    designation: z
      .string()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.category === "national core commitee") {
      const designation = data.designation?.trim();

      if (!designation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Designation is required for national core commitee",
          path: ["designation"],
        });
        return;
      }

      if (!textWithParenthesesRegex.test(designation)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Designation must contain only letters, spaces and parentheses",
          path: ["designation"],
        });
      }
    }
  });

export type MemberFormData = z.infer<typeof memberSchema>;
