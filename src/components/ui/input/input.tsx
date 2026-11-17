import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs transition-[color,box-shadow] outline-none",
        "placeholder:text-gray-400",
        "file:mr-3 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-700",
        "focus-visible:border-brand-500 focus-visible:ring-[3px] focus-visible:ring-brand-500/15",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/15",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}

export { Input };
