"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination/pagination";
import { showError, showSuccess } from "@/lib/utils/toast";
import { MESSAGES } from "../common/constants/utlis";
import { DonationForm } from "../form/DonationForm/DonationForm";
import Image from "next/image";
import { deleteDonation } from "@/store/api/donationApi";
import { getDonations } from "@/store/redux/slice/donationSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/redux/store";
 
interface Donation {
  id: string;
  title: string;
  description: string;
  sub_title?: string;
  account_holder_name: string;
  account_number: string;
  bank_name: string;
  ifsc_code: string;
  created_by?: number;
  creator?: {
    id: number;
    name: string;
  };
  file_name?: string;
  data?: string;
}
 
 
export default function DonationTableOne() {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete" | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { donations, loading } = useSelector(
    (state: RootState) => state.donation
  );
 
 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
 
  const totalPages = Math.ceil(donations.length / itemsPerPage) || 1;
  const paginatedDonations = donations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
 
 
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };
 
  useEffect(() => {
    dispatch(getDonations());
  }, [dispatch]);
 
  const handleView = (donation: Donation) => {
    setSelectedDonation(donation);
    setModalMode("view");
    openModal();
  };
 
  const handleEdit = (donation: Donation) => {
    setSelectedDonation(donation);
    setModalMode("edit");
    openModal();
  };
 
  const handleDelete = (donation: Donation) => {
    setSelectedDonation(donation);
    setModalMode("delete");
    openModal();
  };
 
 
  const handleDeleteConfirm = async () => {
    if (!selectedDonation) return;
    setDeleteLoading(true);
    try {
      await deleteDonation(selectedDonation.id.toString());
      await dispatch(getDonations());
      showSuccess(MESSAGES.DELETE_SUCCESS || "Donation deleted successfully");
      closeModal();
    } catch (err) {
      showError(MESSAGES.DELETE_ERROR || "Failed to delete donation");
      console.log(err);
    } finally {
      setDeleteLoading(false);
    }
  };
 
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Image</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Account Name</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Bank</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Account No</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">IFSC Code</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Created By</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Actions</TableCell>
              </TableRow>
            </TableHeader>
 
            <TableBody>
              {loading ? (
                // Skeleton rows
                [...Array(Math.min(itemsPerPage, donations.length || 1))].map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="px-5 py-4">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex gap-2">
                        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
 
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedDonations.length > 0 ? (
                paginatedDonations.map((donation , index) => (
                  <TableRow key={donation.id || index}>
                    <TableCell className="px-5 py-4">
                      {donation.data ? (
                        <div className="relative w-16 h-16">
                          <Image
                            src={`data:image/jpeg;base64,${donation.data}`}
                            alt={donation.title || "Donation"}
                            fill
                            style={{ objectFit: "cover" }}
                            className="rounded-md border"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                          No Image
                        </div>
                      )}
                    </TableCell>
 
                    <TableCell className="px-5 py-4">{donation.account_holder_name}</TableCell>
                    <TableCell className="px-5 py-4">{donation.bank_name}</TableCell>
                    <TableCell className="px-5 py-4">{donation.account_number}</TableCell>
                    <TableCell className="px-5 py-4">{donation.ifsc_code}</TableCell>
                    <TableCell className="px-5 py-4">{donation.creator?.name}</TableCell>
                    <TableCell className="px-0 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleView(donation)} className="p-2 hover:text-blue-600">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleEdit(donation)} className="p-2 hover:text-green-600">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(donation)} className="p-2 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow key="no-donations">
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500 justify-items-center">
                    No donation details added
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
 
 
          </Table>
 
          {totalPages > 1 && (
            <div className="p-4 flex justify-end">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className="cursor-pointer"
                      onClick={() => handlePageChange(currentPage - 1)}
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    Page {currentPage} of {totalPages}
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      className="cursor-pointer"
                      onClick={() => handlePageChange(currentPage + 1)}
                      aria-disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
 
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
        <div className="bg-white p-6 dark:bg-gray-900 rounded-lg">
          {modalMode === "view" && selectedDonation && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custome-scroll">
              <div className="flex justify-center">
                {selectedDonation.data ? (
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border">
                    <Image
                      src={`data:image/jpeg;base64,${selectedDonation.data}`}
                      alt={selectedDonation.title || "Donation"}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 flex items-center justify-center bg-gray-200 text-gray-500 text-sm rounded-lg border">
                    No Image
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedDonation.title || "Untitled Donation"}
                </h3>
                {selectedDonation.sub_title && (
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {selectedDonation.sub_title}
                  </p>
                )}
              </div>
 
              <div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Description
                </h4>
                <div className="max-h-40 min-h-[80px] overflow-y-auto p-2 border rounded-md bg-gray-50 dark:bg-gray-800 custome-scroll">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm leading-relaxed">
                    {selectedDonation.description}
                  </p>
                </div>
              </div>
 
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    Account Name
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedDonation.account_holder_name}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Bank</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedDonation.bank_name}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    Account No
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedDonation.account_number}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    IFSC Code
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedDonation.ifsc_code}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    Created By
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedDonation.creator?.name || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
 
 
          {modalMode === "edit" && selectedDonation && (
            <DonationForm
              mode="edit"
              initialDonation={selectedDonation}
              onSuccess={() => {
                dispatch(getDonations());
                closeModal();
              }}
            />
          )}
 
 
          {modalMode === "delete" && selectedDonation && (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Delete Donation?</h3>
              <p>Are you sure you want to delete <strong>{selectedDonation.account_holder_name}</strong>?</p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  {deleteLoading ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
 
 