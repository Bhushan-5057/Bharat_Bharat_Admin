import * as React from "react";

import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "min-h-[4.5rem] max-h-32",
  md: "min-h-[7.5rem] max-h-48",
  lg: "min-h-[11rem] max-h-72",
};

function Textarea({
  className,
  fieldSize = "md",
  ...props
}: React.ComponentProps<"textarea"> & {
  fieldSize?: keyof typeof sizeClasses;
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex w-full resize-y overflow-x-hidden overflow-y-auto whitespace-pre-wrap break-words rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm leading-relaxed text-gray-900 shadow-xs transition-[color,box-shadow] outline-none",
        "placeholder:text-gray-400",
        "focus-visible:border-brand-500 focus-visible:ring-[3px] focus-visible:ring-brand-500/15",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/15",
        "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60",
        sizeClasses[fieldSize],
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
