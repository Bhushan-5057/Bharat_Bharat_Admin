"use client";

import React from "react";

interface DeleteMemberConfirmProps {
  name: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteMemberConfirm({
  name,
  loading,
  onConfirm,
  onCancel,
}: DeleteMemberConfirmProps) {
  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Delete Member?
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        Are you sure you want to delete <strong>{name}</strong>?
      </p>
      <div className="flex justify-center gap-4 mt-5">
        <button
          onClick={onConfirm}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-md disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Yes, Delete"}
        </button>
        <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md">
          Cancel
        </button>
      </div>
    </div>
  );
}
