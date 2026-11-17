/**
 * 24-hour time helpers.
 * Internal representation is always "HH:MM" (e.g. "14:00").
 * Never convert via locale Date parsing — that turns 14:00 into 02:00.
 */

export type HoursMinutes = {
  hours: number;
  minutes: number;
};

const isValidHoursMinutes = (hours: number, minutes: number) =>
  Number.isInteger(hours) &&
  Number.isInteger(minutes) &&
  hours >= 0 &&
  hours <= 23 &&
  minutes >= 0 &&
  minutes <= 59;

export function parseTimeToHoursMinutes(
  value?: string | null
): HoursMinutes | null {
  if (!value) return null;
  const input = value.trim();
  if (!input) return null;

  const ampmMatch = input.match(
    /^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i
  );
  if (ampmMatch) {
    let hours = Number(ampmMatch[1]);
    const minutes = Number(ampmMatch[2]);
    const meridiem = ampmMatch[3].toUpperCase();

    if (hours < 1 || hours > 12 || minutes > 59) return null;
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    return isValidHoursMinutes(hours, minutes) ? { hours, minutes } : null;
  }

  const plainMatch = input.match(/^(\d{1,2}):(\d{2})(?::\d{2})?(?:\.\d+)?$/);
  if (plainMatch) {
    const hours = Number(plainMatch[1]);
    const minutes = Number(plainMatch[2]);
    return isValidHoursMinutes(hours, minutes) ? { hours, minutes } : null;
  }

  const isoMatch = input.match(/T(\d{2}):(\d{2})(?::\d{2})?/);
  if (isoMatch) {
    const hours = Number(isoMatch[1]);
    const minutes = Number(isoMatch[2]);
    return isValidHoursMinutes(hours, minutes) ? { hours, minutes } : null;
  }

  return null;
}

export function formatHoursMinutes(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** Normalize any supported time string to "HH:MM" (24-hour). */
export function timeToHHMM(value?: string | null): string {
  const parsed = parseTimeToHoursMinutes(value);
  if (!parsed) return "";
  return formatHoursMinutes(parsed.hours, parsed.minutes);
}

export function timeToMinutesSinceMidnight(
  value?: string | null
): number | null {
  const parsed = parseTimeToHoursMinutes(value);
  if (!parsed) return null;
  return parsed.hours * 60 + parsed.minutes;
}

export function isEndTimeAfterStart(
  start?: string | null,
  end?: string | null
): boolean {
  const startMinutes = timeToMinutesSinceMidnight(start);
  const endMinutes = timeToMinutesSinceMidnight(end);
  if (startMinutes === null || endMinutes === null) return false;
  return endMinutes > startMinutes;
}

export function areTimesEqual(
  start?: string | null,
  end?: string | null
): boolean {
  const startMinutes = timeToMinutesSinceMidnight(start);
  const endMinutes = timeToMinutesSinceMidnight(end);
  if (startMinutes === null || endMinutes === null) return false;
  return startMinutes === endMinutes;
}

/** Display helper — always 24-hour "HH:MM". */
export function formatTime24h(
  value?: string | null,
  empty = "—"
): string {
  return timeToHHMM(value) || empty;
}

/** Display helper — 12-hour with AM/PM, e.g. "02:00 PM". Storage stays "HH:MM". */
export function formatTime12h(
  value?: string | null,
  empty = "—"
): string {
  const parsed = parseTimeToHoursMinutes(value);
  if (!parsed) return empty;
  const meridiem = parsed.hours >= 12 ? "PM" : "AM";
  const hours12 = parsed.hours % 12 === 0 ? 12 : parsed.hours % 12;
  return `${String(hours12).padStart(2, "0")}:${String(parsed.minutes).padStart(2, "0")} ${meridiem}`;
}
