import React from 'react'
import Button from '../button/Button'

interface DeleteConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmModal = ({ onConfirm, onCancel, loading = false }: DeleteConfirmProps) => {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Delete Client</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete this client? This action cannot be undone.
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
                    {loading ? 'Deleting...' : 'Delete'}
                </Button>
            </div>
        </div>
    )
}

export default ConfirmModal
