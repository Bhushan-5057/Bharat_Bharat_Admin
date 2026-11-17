"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, Plus, Trash2 } from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppDispatch, RootState } from "@/store/redux/store";
import {
  getContactDetailsList,
  removeContactDetails,
} from "@/store/redux/slice/contactDetailsSlice";
import { showApiError, showSuccess } from "@/lib/utils/toast";
import { Modal } from "@/components/ui/modal/index";
import { useModal } from "@/hooks/useModal";

export default function ContactDetailsTable() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, openModal, closeModal } = useModal();
  const { items, loading } = useSelector(
    (state: RootState) => state.contactDetails
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(getContactDetailsList());
  }, [dispatch]);

  const handleDelete = async () => {
    if (!selectedId) return;
    setDeleteLoading(true);
    try {
      const result = await dispatch(removeContactDetails(selectedId));
      if (result.meta.requestStatus === "fulfilled") {
        showSuccess("Contact details deleted successfully");
        dispatch(getContactDetailsList());
        closeModal();
      } else {
        showApiError(result.payload, "Failed to delete contact details");
      }
    } catch (error) {
      showApiError(error, "Failed to delete contact details");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <ComponentCard title="Contact Details">
        {items.length === 0 && (
          <div className="flex justify-end p-4">
            <Button
              onClick={() => router.push("/contact-details/create")}
              variant="primary"
              className="flex h-10 items-center hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            >
              <Plus size={16} />
              Add Contact Details
            </Button>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500">
                    Phone
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500">
                    Email
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500">
                    Address
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="px-5 py-6 text-center text-gray-500">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="px-5 py-6 text-center text-gray-500">
                      No contact details found
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-5 py-4 text-theme-sm text-gray-800">
                        {item.phone}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-theme-sm text-gray-800">
                        {item.email}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-theme-sm text-gray-800">
                        {item.address}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              router.push(`/contact-details/${item.id}/edit`)
                            }
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                            aria-label="Edit contact details"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedId(String(item.id));
                              openModal();
                            }}
                            className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                            aria-label="Delete contact details"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </ComponentCard>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
        <h3 className="mb-2 text-lg font-semibold text-gray-800">
          Delete contact details?
        </h3>
        <p className="mb-6 text-sm text-gray-500">
          This will remove the phone, email and address from the website.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
