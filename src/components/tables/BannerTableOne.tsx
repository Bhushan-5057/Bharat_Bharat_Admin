"use client";
import React, { useCallback, useEffect, useState } from "react";
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
import { deleteBanner, fetchAllBanners } from "@/store/api/bannerApi";
import { FileUpload } from "@/components/ui/fileupload/file-upload";
import Image from "next/image";

interface Banner {
  id: number;
  title: string;
  file_name: string;
  description?: string;
  status?: string;
  data: string;
  created_by: string | number;
  creator: {
    name: string;
  }
}

export default function BannerTableOne() {
  const { isOpen, openModal, closeModal } = useModal();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);


  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete" | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(banners.length / itemsPerPage) || 1;
  const paginatedBanners = banners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };



const loadBanners = useCallback(async (): Promise<void> => {
  try {
    setLoading(true);
    const res: Banner[] = await fetchAllBanners();
    const updatedBanners: Banner[] = res || [];
    setBanners(updatedBanners);
    const newTotalPages = Math.ceil(updatedBanners.length / itemsPerPage) || 1;
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }

    setError(null);
  } catch (err: unknown) {
    setError(err);
  } finally {
    setLoading(false);
  }
}, [currentPage, itemsPerPage]); 

useEffect(() => {
  loadBanners();
}, [loadBanners]);

  const handleView = (banner: Banner) => {
    setSelectedBanner(banner);
    setModalMode("view");
    openModal();
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setModalMode("edit");
    openModal();
  };

  const handleDelete = (banner: Banner) => {
    setSelectedBanner(banner);
    setModalMode("delete");
    openModal();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBanner) return;
    setDeleteLoading(true);
    try {
      await deleteBanner(selectedBanner.id.toString());
      await loadBanners();
      showSuccess(MESSAGES.DELETE_SUCCESS);
      closeModal();
    }
    catch (err: unknown) {
      console.error("Delete failed:", err);
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : MESSAGES.DELETE_ERROR;
      showError(errorMessage);
    }

    finally {
      setDeleteLoading(false);
    }
  };

  const renderErrorMessage = (err: unknown) => {
    if (typeof err === "string") return err;
    if (err && typeof err === "object" && "message" in err) {
      return (err as { message: string }).message;
    }
    return JSON.stringify(err);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white ">Image</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">File Name</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Created By</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (

                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-5 py-4">
                      <div className="w-16 h-16 bg-gray-300 rounded-md animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-0 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                        <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                        <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell className="text-center py-6 text-red-500">
                    Error: {renderErrorMessage(error)}
                  </TableCell>
                </TableRow>
              ) : banners.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-6 text-gray-500">
                    No banners found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBanners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell className="px-5 py-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={`data:image/png;base64,${banner.data}`}
                          alt={banner.title || "Banner image"}
                          fill
                          style={{ objectFit: "cover" }}
                          className="rounded-md border"
                          priority
                        />
                      </div>


                    </TableCell>
                    <TableCell className="px-5 py-4">{banner.file_name}</TableCell>
                    <TableCell className="px-5 py-4">{banner.creator.name}</TableCell>
                    <TableCell className="px-0 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(banner)}
                          className="p-2 hover:text-blue-600"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(banner)}
                          className="p-2 hover:text-green-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(banner)}
                          className="p-2 hover:text-red-600"
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
          {modalMode === "view" && selectedBanner && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Banner Details</h3>
              <p><strong>File:</strong> {selectedBanner.file_name}</p>
              <p><strong>Created by:</strong> {selectedBanner.creator.name}</p>
              <div className="relative w-full h-80 mt-4 rounded-lg overflow-hidden">
                <Image
                  src={`data:image/png;base64,${selectedBanner.data}`}
                  alt={selectedBanner?.title || "Banner image"}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                  priority
                />

              </div>

            </div>
          )}

          {modalMode === "edit" && selectedBanner && (
            <FileUpload
              mode="edit"
              initialBanner={selectedBanner}
              onSuccess={() => {
                closeModal();
                loadBanners();
              }}
            />
          )}
          {modalMode === "delete" && selectedBanner && (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Delete Banner?</h3>
              <p>Are you sure you want to delete <strong>{selectedBanner.title}</strong>?</p>
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
