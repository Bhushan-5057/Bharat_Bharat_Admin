"use client";

import { Input } from "@/components/ui/input/input";
import { timeToHHMM } from "@/utils/time";

interface TimeInputProps {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  required?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export function TimeInput({
  id,
  value,
  onChange,
  min,
  max,
  disabled,
  required,
  ...rest
}: TimeInputProps) {
  return (
    <Input
      id={id}
      type="time"
      step={60}
      lang="en-GB"
      value={timeToHHMM(value)}
      min={min ? timeToHHMM(min) : undefined}
      max={max ? timeToHHMM(max) : undefined}
      onChange={(event) => onChange(timeToHHMM(event.target.value))}
      disabled={disabled}
      required={required}
      className="w-full"
      {...rest}
    />
  );
}
