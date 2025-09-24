import { z } from "zod";

export const donationSchema = (mode: "add" | "edit" = "add") =>
  z.object({
    title: z
      .string()
      .trim()
      .nonempty("Title is required")
      .regex(/^[\p{L}\p{M}]+(?: [\p{L}\p{M}]+)*$/u, {
        message:
          "Title must contain only letters with single spaces between words; no numbers, hyphens or extra spaces",
      }),

    subTitle: z
      .string()
      .trim()
      .nonempty("Sub Title is required")
      .regex(/^[\p{L}\p{M}]+(?: [\p{L}\p{M}]+)*$/u, {
        message:
          "Sub Title must contain only letters with single spaces between words; no numbers, hyphens or extra spaces",
      }),

    description: z.string().trim().nonempty("Description is required"),

    accountHolder: z
      .string()
      .trim()
      .nonempty("Account Holder Name is required")
      .regex(/^[A-Za-z\s]+$/, {
        message: "Account Holder Name must contain only letters and spaces",
      }),

    accountNo: z
      .string()
      .trim()
      .nonempty("Account Number is required")
      .regex(/^[0-9]{9,18}$/, {
        message:
          "Account Number must be 9–18 digits long and contain numbers only (no special characters)",
      }),

    bankName: z
      .string()
      .trim()
      .nonempty("Bank Name is required")
      .regex(/^[A-Za-z\s]+$/, {
        message: "Bank Name must contain only letters and spaces",
      }),

    ifscCode: z
      .string()
      .trim()
      .nonempty("IFSC Code is required")
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, {
        message:
          "Invalid IFSC Code. Must follow standard format (e.g., SBIN0001234)",
      }),

    imageFile:
      mode === "add"
        ? z
            .any()
            .refine(
              (files) => files && files.length > 0,
              "Please select an image file"
            )
            .refine(
              (files) =>
                files &&
                files.length > 0 &&
                ["image/jpeg", "image/png", "image/webp"].includes(
                  files[0]?.type
                ),
              "Only JPG, PNG, or WEBP images are allowed (no GIF, MP4, or SVG)"
            )
        : z.any().optional(),
  });

export type DonationFormData = z.infer<ReturnType<typeof donationSchema>>;
