import * as React from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center",
        className
      )}
    >
      <p className="text-sm font-medium text-gray-800">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-gray-500">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
