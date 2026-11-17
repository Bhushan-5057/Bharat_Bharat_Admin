"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog/dialog";
import Button from "@/components/ui/button/Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "primary" | "destructive";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !loading) onCancel();
      }}
    >
      <DialogContent className="max-w-md sm:max-w-lg lg:max-w-xl p-4 sm:p-6 lg:p-8 border-none shadow-none rounded-lg" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={loading}
            loading={loading}
            className="w-full sm:w-auto"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
