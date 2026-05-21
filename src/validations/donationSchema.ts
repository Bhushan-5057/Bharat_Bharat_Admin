import { z } from "zod";

export const donationSchema = (mode: "add" | "edit" = "add") =>
  z.object({
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
      .transform((value) => value.toUpperCase())
      .refine((value) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value), {
        message:
          "Invalid IFSC Code. Must follow standard format (e.g., SBIN0001234)",
      }),
      
    upiId: z
      .string()
      .trim()
      .nonempty("UPI ID is required")
      .min(5, "UPI ID is too short")
      .max(50, "UPI ID is too long")
      .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/i, {
        message:
          "Invalid UPI ID format. Example: qrbharatbharti.srt@sbi",
      })
      .refine((value) => !value.includes(" "), {
        message: "UPI ID cannot contain spaces",
      })
      .transform((value) => value.toLowerCase()),

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
