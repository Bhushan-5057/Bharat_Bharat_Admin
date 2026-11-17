"use client";

import React from "react";
import Button from "@/components/ui/button/Button";

interface DeleteAchievementConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteAchievementConfirm({
  onConfirm,
  onCancel,
  loading = false,
}: DeleteAchievementConfirmProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        Delete Achievement
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Are you sure you want to delete this Achievement? This action cannot be
        undone.
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          className="bg-red-600 text-white hover:bg-red-700"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}
