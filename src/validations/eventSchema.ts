import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  venue: z.string().nonempty(),
  event_date: z.string().nonempty(),
  start_time: z.string().nonempty(),
  end_time: z.string().nonempty(),
  file_name: z.any().optional(),
  existingImage: z.boolean().optional(),
}).superRefine((data, ctx) => {
  const { start_time, end_time } = data;

  if (!start_time || !end_time) return;

  // ✅ ONLY VALIDATION
  if (start_time === end_time) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Start time and end time cannot be the same",
      path: ["end_time"],
    });
  }
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;