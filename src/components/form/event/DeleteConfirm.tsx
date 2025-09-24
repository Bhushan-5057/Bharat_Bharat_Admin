"use client";

import React from "react";
import Button from "@/components/ui/button/Button";

interface DeleteServiceConfirmProps {
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function DeleteEventConfirm({
    onConfirm,
    onCancel,
    loading = false,
}: DeleteServiceConfirmProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Delete Event
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete this Event? This action cannot be undone.
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
