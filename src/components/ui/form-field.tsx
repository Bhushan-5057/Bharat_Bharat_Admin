import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label/label";

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "space-y-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4 sm:p-5",
        className
      )}
    >
      <div className="space-y-1">
        <h3 className="text-sm font-semibold tracking-wide text-gray-800">
          {title}
        </h3>
        {description ? (
          <p className="text-xs leading-relaxed text-gray-500">{description}</p>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function FormField({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}
        {required ? (
          <span className="ml-0.5 text-red-500" aria-hidden="true">
            *
          </span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
}
