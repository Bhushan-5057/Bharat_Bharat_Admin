import { z } from "zod";

const allowedDomains =  ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "koliinfotech.com"];;

export const adminSchema = z.object({
name: z
  .string()
  .regex(/^(?!\s*$)[A-Za-z\s]+$/, "Name must only contain letters and spaces, and cannot be blank")
,

email: z
  .string()
  .min(1, "Email is required")
  .email("Invalid email format")
  .refine((val) => /^[A-Za-z][A-Za-z0-9._-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(val), {
    message: "Email must start with a letter",
  })
  .refine((val) => {
    const domain = val.split("@")[1];
    return allowedDomains.includes(domain);
  }, "Email domain is not supported. Use Gmail, Yahoo, or Outlook.")
,

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
});

export type AdminFormData = z.infer<typeof adminSchema>;
