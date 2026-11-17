"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

interface AdminPageActionsProps {
  backHref: string;
  backLabel?: string;
  editHref?: string;
  editLabel?: string;
}

export default function AdminPageActions({
  backHref,
  backLabel = "Back",
  editHref,
  editLabel = "Edit",
}: AdminPageActionsProps) {
  const router = useRouter();

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={() => router.push(backHref)}
      >
        {backLabel}
      </Button>
      {editHref ? (
        <Button type="button" onClick={() => router.push(editHref)}>
          {editLabel}
        </Button>
      ) : null}
    </div>
  );
}

export function AdminPageSkeleton() {
  return (
    <div className="space-y-6 py-2">
      <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="space-y-4">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>
          ))}
      </div>
      <div className="h-24 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
    </div>
  );
}
