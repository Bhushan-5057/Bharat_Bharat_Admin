import { z } from "zod";

const toMinutes = (time) => {
  const [hourText = "", minuteText = ""] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return hour * 60 + minute;
};

const MIN_DURATION_MINUTES = 180;
const MAX_DURATION_MINUTES = 240;

const testSchema = z
  .object({
    start_time: z.string(),
    end_time: z.string(),
  })
  .superRefine((data, ctx) => {
    const { start_time, end_time } = data;
    const startMinutes = toMinutes(start_time);
    const endMinutes = toMinutes(end_time);

    if (startMinutes === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start time is invalid",
        path: ["start_time"],
      });
    }

    if (endMinutes === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End time is invalid",
        path: ["end_time"],
      });
    }

    if (startMinutes !== null && endMinutes !== null) {
      if (startMinutes === endMinutes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start time and end time cannot be the same",
          path: ["end_time"],
        });
      } else if (endMinutes < startMinutes) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be greater than start time",
          path: ["end_time"],
        });
      } else {
        const duration = endMinutes - startMinutes;
        if (duration < MIN_DURATION_MINUTES || duration > MAX_DURATION_MINUTES) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Event duration must be between 3 and 4 hours",
            path: ["end_time"],
          });
        }
      }
    }
  });

const testCases = [
  { start_time: "10:00", end_time: "12:00", desc: "2 hours (Too short)" },
  { start_time: "10:00", end_time: "13:00", desc: "3 hours (Exactly Minimum)" },
  { start_time: "10:00", end_time: "13:30", desc: "3.5 hours (Within Range)" },
  { start_time: "10:00", end_time: "14:00", desc: "4 hours (Exactly Maximum)" },
  { start_time: "10:00", end_time: "15:00", desc: "5 hours (Too long)" },
  { start_time: "10:00", end_time: "22:15", desc: "12 hours 15 mins (Too long)" },
  { start_time: "10:00", end_time: "09:00", desc: "Invalid range (End < Start)" },
  { start_time: "10:00", end_time: "10:00", desc: "Same start and end time" },
];

console.log("=========================================================================");
console.log(" RUNNING EVENT DURATION VALIDATION TESTS (Target: 3 to 4 hours)");
console.log("=========================================================================");

testCases.forEach((c) => {
  const result = testSchema.safeParse(c);
  const status = result.success ? "PASS (Allowed)" : "FAIL (Blocked)";
  const color = result.success ? "\x1b[32m" : "\x1b[31m";
  const resetColor = "\x1b[0m";
  
  console.log(`\nCase: ${c.start_time} to ${c.end_time} - ${c.desc}`);
  console.log(`Result: ${color}${status}${resetColor}`);
  if (!result.success) {
    console.log(`Validation Error Message: "${result.error.errors[0].message}"`);
  }
});
console.log("\n=========================================================================");
