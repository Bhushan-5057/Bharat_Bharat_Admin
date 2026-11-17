"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TableIdCell, TableIdHeader, TableIdSkeletonCell, TableSerialCell, TableSerialHeader, TableSerialSkeletonCell, TABLE_SERIAL_PREFIX, getTableSerialNumber } from "./TableIdColumn";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import { useRouter } from "next/navigation";
import { Modal } from "../ui/modal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination/pagination";
import { showApiError, showSuccess } from "@/lib/utils/toast";
import { MESSAGES } from "../common/constants/utlis";
import Image from "next/image";
import { deleteDonation } from "@/store/api/donationApi";
import { getDonations } from "@/store/redux/slice/donationSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/redux/store";
import { getMediaUrl } from "@/utils/mediaUrl";
 
interface Donation {
  id: string;
  account_holder_name: string;
  account_number: string;
  bank_name: string;
  ifsc_code: string;
  upi_id: string;
  created_by?: number;
  creator?: {
    id: number;
    name: string;
  };
  file_name?: string;
  url?: string | null;
  cloudinary_url?: string | null;
  data?: string | null;
}
 
 
export default function DonationTableOne() {
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [modalMode, setModalMode] = useState<"delete" | null>(null);
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
    if (!donation.id) return;
    router.push(`/donations/${donation.id}`);
  };
 
  const handleEdit = (donation: Donation) => {
    if (!donation.id) return;
    router.push(`/donations/${donation.id}/edit`);
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
      console.log(err);
      showApiError(err, MESSAGES.DELETE_ERROR || "Failed to delete donation");
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
                <TableSerialHeader />
                <TableIdHeader />
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Image</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Account Name</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Bank</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Account No</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">IFSC Code</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">UPI ID</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Created By</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Actions</TableCell>
              </TableRow>
            </TableHeader>
 
            <TableBody>
              {loading ? (
                [...Array(Math.min(itemsPerPage, donations.length || 1))].map((_, idx) => (
                  <TableRow key={idx}>
                    <TableSerialSkeletonCell />
                    <TableIdSkeletonCell />
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
                    <TableSerialCell value={getTableSerialNumber(currentPage, itemsPerPage, index, TABLE_SERIAL_PREFIX.donation)} />
                    <TableIdCell id={donation.id} />
                    <TableCell className="px-5 py-4">
                      {getMediaUrl(donation) ? (
                        <div className="relative w-16 h-16">
                          <Image
                            src={getMediaUrl(donation)}
                            alt={"Donation"}
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
                    <TableCell className="px-5 py-4">{donation.upi_id}</TableCell>
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
                  <TableCell colSpan={10} className="text-center py-6 text-gray-500 justify-items-center">
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
 
 
