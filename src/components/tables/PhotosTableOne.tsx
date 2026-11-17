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
import { getApiErrorMessage } from "@/lib/utils/apiError";
import { MESSAGES } from "../common/constants/utlis";
import Image from "next/image";
import {  deletePhoto, Photo } from "@/store/api/photoApi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/redux/store";
import { getPhotos } from "@/store/redux/slice/photoSlice";
import { getMediaUrl } from "@/utils/mediaUrl";


export default function PhotosTableOne() {
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();


  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [modalMode, setModalMode] = useState<"delete" | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const { photos, loading, error } = useSelector((state: RootState) => state.photos);
  const dispatch = useDispatch<AppDispatch>();



  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(photos.length / itemsPerPage) || 1;
  const paginatedPhotos = photos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
  dispatch(getPhotos());
}, [dispatch]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleView = (photo: Photo) => {
    if (!photo.id) return;
    router.push(`/gallery/photos/${photo.id}`);
  };

  const handleEdit = (photo: Photo) => {
    if (!photo.id) return;
    router.push(`/gallery/photos/${photo.id}/edit`);
  };

  const handleDelete = (photo: Photo) => {
    setSelectedPhoto(photo);
    setModalMode("delete");
    openModal();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPhoto) return;
    setDeleteLoading(true);
    try {
      await deletePhoto(selectedPhoto.id.toString()); 
      await dispatch(getPhotos());
      showSuccess(MESSAGES.DELETE_SUCCESS || "Photo deleted successfully");
      closeModal();
    } catch (err: unknown) {
      console.error("Delete failed:", err);
      showApiError(err, MESSAGES.DELETE_ERROR || "Failed to delete photo");
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderErrorMessage = (err: unknown) =>
    getApiErrorMessage(err, "Something went wrong");

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableSerialHeader />
                <TableIdHeader />
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">
                  Image
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">
                  File Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">
                  Created By
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableSerialSkeletonCell />
                    <TableIdSkeletonCell />
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
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-red-500">
                    Error: {renderErrorMessage(error)}
                  </TableCell>
                </TableRow>
              ) : photos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No photos found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPhotos.map((photo, index) => (
                  <TableRow key={photo.id || `photo-${photo.file_name}`}>
                    <TableSerialCell value={getTableSerialNumber(currentPage, itemsPerPage, index, TABLE_SERIAL_PREFIX.photo)} />
                    <TableIdCell id={photo.id} />
                    <TableCell className="px-5 py-4">
                      {getMediaUrl(photo) ? (
                      <div className="relative w-16 h-16">
                        <Image
                          src={getMediaUrl(photo)}
                          alt={photo.file_name || "Photo"}
                          fill
                          style={{ objectFit: "cover" }}
                          className="rounded-md border"
                          priority
                          unoptimized
                        />
                      </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No image</span>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-4">{photo.file_name}</TableCell>
                    <TableCell className="px-5 py-4">{photo.creator?.name}</TableCell>
                    <TableCell className="px-0 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(photo)}
                          className="p-2 hover:text-blue-600"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(photo)}
                          className="p-2 hover:text-green-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(photo)}
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
          {modalMode === "delete" && selectedPhoto && (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Delete Photo?</h3>
              <p>Are you sure you want to delete <strong>{selectedPhoto.file_name}</strong>?</p>
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
