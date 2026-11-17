import { z } from "zod";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const lettersWithSingleSpacesRegex = /^[\p{L}\p{M}]+(?: [\p{L}\p{M}]+)*$/u;
const indianMobileRegex = /^[6-9][0-9]{9}$/;

const isBlankContactRow = (contact: {
  id?: number;
  person_name?: string;
  contact_number?: string;
  email?: string;
  designation?: string;
}) => {
  if (contact.id != null) return false;
  return ![
    contact.person_name,
    contact.contact_number,
    contact.email,
    contact.designation,
  ].some((value) => (value ?? "").trim() !== "");
};

export const cityContactSchema = z
  .object({
    id: z
      .number({ invalid_type_error: "Contact id must be a valid integer" })
      .int("Contact id must be a valid integer")
      .optional(),
    person_name: z.string(),
    contact_number: z.string(),
    email: z.string(),
    designation: z.string(),
  })
  .superRefine((contact, ctx) => {
    if (isBlankContactRow(contact)) return;

    const personName = contact.person_name ?? "";
    if (!personName.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Person name is required",
        path: ["person_name"],
      });
    } else if (!lettersWithSingleSpacesRegex.test(personName.normalize("NFC"))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Person name must contain only letters with single spaces; no leading/trailing spaces, hyphens, or numbers",
        path: ["person_name"],
      });
    }

    const contactNumber = contact.contact_number ?? "";
    if (!contactNumber.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Contact number is required",
        path: ["contact_number"],
      });
    } else if (!/^[0-9]{10}$/.test(contactNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Contact number must be 10 digits",
        path: ["contact_number"],
      });
    } else if (!indianMobileRegex.test(contactNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Contact number must be a valid Indian mobile number",
        path: ["contact_number"],
      });
    }

    const email = contact.email?.trim();
    if (email && !emailRegex.test(email)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must be a valid email",
        path: ["email"],
      });
    }

    const designation = contact.designation ?? "";
    if (!designation.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Designation is required",
        path: ["designation"],
      });
    } else if (!lettersWithSingleSpacesRegex.test(designation.normalize("NFC"))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Designation must contain only letters with single spaces; no leading/trailing spaces, hyphens, or numbers",
        path: ["designation"],
      });
    }
  });

export const createCitySchema = z
  .object({
    state: z
      .string()
      .trim()
      .min(1, "State is required"),

    title: z
      .string()
      .nonempty("City title is required")
      .min(1, "Title must be at least 1 character")
      .max(150, "Title cannot be more than 150 characters")
      .refine((val) => {
        const normalized = val.normalize("NFC").trim();
        return lettersWithSingleSpacesRegex.test(normalized);
      }, "Title must contain only letters with single spaces; no leading/trailing spaces, hyphens, or numbers")
      .refine((val) => !val.includes("@"), "Title cannot be an email"),

    description: z
      .string()
      .nonempty("City description is required")
      .refine((val) => val.trim().length > 0, "City description is required")
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

    contacts: z
      .array(cityContactSchema, {
        invalid_type_error: "Contacts must be an array",
      }),
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

    const ids = (data.contacts ?? [])
      .map((contact) => contact.id)
      .filter((id): id is number => id != null);
    if (ids.length !== new Set(ids).size) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Duplicate contact ids are not allowed",
        path: ["contacts"],
      });
    }
  });

export type CreateCityFormData = z.infer<typeof createCitySchema>;
export type CityContactFormValue = z.infer<typeof cityContactSchema>;
