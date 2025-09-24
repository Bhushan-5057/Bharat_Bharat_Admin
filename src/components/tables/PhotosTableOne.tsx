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
import Image from "next/image";
import {  deletePhoto, Photo } from "@/store/api/photoApi";
import { PhotoUploadForm } from "../form/PhotoUploadForm/PhotoUploadForm";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/redux/store";
import { getPhotos } from "@/store/redux/slice/photoSlice";


export default function PhotosTableOne() {
  const { isOpen, openModal, closeModal } = useModal();


  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete" | null>(null);
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
    setSelectedPhoto(photo);
    setModalMode("view");
    openModal();
  };

  const handleEdit = (photo: Photo) => {
    setSelectedPhoto(photo);
    setModalMode("edit");
    openModal();
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
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : MESSAGES.DELETE_ERROR || "Failed to delete photo";
      showError(errorMessage);
    } finally {
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
                  <TableCell colSpan={4} className="text-center py-6 text-red-500">
                    Error: {renderErrorMessage(error)}
                  </TableCell>
                </TableRow>
              ) : photos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                    No photos found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPhotos.map((photo) => (
                  <TableRow key={photo.id || `photo-${photo.file_name}`}>
                    <TableCell className="px-5 py-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={`data:image/png;base64,${photo.data}`}
                          alt={photo.file_name || "Photo"}
                          fill
                          style={{ objectFit: "cover" }}
                          className="rounded-md border"
                          priority
                        />
                      </div>
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
          {modalMode === "view" && selectedPhoto && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Photo Details</h3>
              <p><strong>File:</strong> {selectedPhoto.file_name}</p>
              <p><strong>Created by:</strong> {selectedPhoto.creator?.name}</p>
              <div className="relative w-full h-80 mt-4 rounded-lg overflow-hidden">
                <Image
                  src={`data:image/png;base64,${selectedPhoto.data}`}
                  alt={selectedPhoto.file_name || "Photo"}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                  priority
                />
              </div>
            </div>
          )}

         {modalMode === "edit" && selectedPhoto && (
           <PhotoUploadForm
            mode="edit"
            initialPhoto={selectedPhoto} 
            onSuccess={() => {
            closeModal();   
            dispatch(getPhotos());  
     
    }}
  />

           )}

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
