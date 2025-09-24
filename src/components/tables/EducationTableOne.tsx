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
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/redux/store";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination/pagination";
import {
  getAllEducations,
  removeEducation,
} from "@/store/redux/slice/educationSlice";
import { showError, showSuccess } from "@/lib/utils/toast";
import { MESSAGES } from "../common/constants/utlis";
import Image from "next/image";
import { Education } from "@/types/educationTypes";

import DeleteEducationConfirm from "../form/Education/DeleteEducationConfirm";
import { cn } from "@/lib/utils";
import EditEducationForm from "../form/Education/EditEducationForm";
import { useRouter } from "next/navigation";

export default function EducationTableOne() {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, openModal, closeModal } = useModal();

  const router = useRouter();

  const [selectedEducation, setSelectedEducation] =
    useState<Education | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete" | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const { items: educations = [], loading } = useSelector(
    (state: RootState) => state.education
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(educations.length / itemsPerPage) || 1;
  const paginatedEducations = educations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  useEffect(() => {
    dispatch(getAllEducations());
  }, [dispatch]);

  const handleView = (education: Education) => {
    if (!education.id) return;
    router.push(`/education/${education.id}`);
  };

  const handleEdit = (education: Education) => {
    setSelectedEducation(education);
    setModalMode("edit");
    openModal();
  };

  const handleDelete = (education: Education) => {
    setSelectedEducation(education);
    setModalMode("delete");
    openModal();
  };

  const handleDeleteConfirm: () => Promise<void> = async () => {
    if (!selectedEducation) return;
    setDeleteLoading(true);

    try {
      await dispatch(removeEducation(selectedEducation.id)).unwrap();
      const res = await dispatch(getAllEducations()).unwrap();

      const updatedEducations: Education[] = res || [];
      const newTotalPages = Math.ceil(updatedEducations.length / itemsPerPage) || 1;
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }

      showSuccess(MESSAGES.DELETE_SUCCESS);
      closeModal();
    } catch (err: unknown) {
      console.error("Delete failed:", err);
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : MESSAGES.DELETE_ERROR;
      showError(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  const truncateText = (text: string | undefined, maxLength = 20) => {
    if (!text) return "N/A";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">
                  Title
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">
                  Type
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">
                  School Address
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">
                  Images
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">
                  Created By
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {Array(7).fill(0).map((_, j) => (
                      <TableCell key={j} className="px-5 py-4">
                        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : educations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-gray-500"
                  >
                    No education records found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedEducations.map((education, index) => (
                  <TableRow key={education.id ?? `education-${index}`}>
                    <TableCell
                      className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white max-w-[150px] truncate"
                    >
                      <span title={education.title}>
                        {truncateText(education.title)}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-[120px] truncate">
                      {education.type ? (
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            education.type === "school"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          )}
                        >
                          {truncateText(education.type)}
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-white/[0.05] text-gray-500 dark:text-gray-400 rounded-full text-xs font-medium">
                          Not Provided
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-[200px] truncate">
                      {education.school_address ? (
                        <span title={education.school_address}>
                          {truncateText(education.school_address)}
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-white/[0.05] text-gray-500 dark:text-gray-400 rounded-full text-xs font-medium">
                          Not Provided
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {education.images && education.images.length > 0 ? (
                        <div className="flex gap-2">
                          {education.images.slice(0, 1).map((img, i) => (
                            <div key={i} className="relative w-12 h-12">
                              <Image
                                src={
                                  img.data
                                    ? `data:image/png;base64,${img.data}`
                                    : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${img.file_name}`
                                }
                                alt={education.title || "Education Image"}
                                fill
                                className="rounded-md object-cover"
                              />
                            </div>
                          ))}
                          {education.images.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{education.images.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>

                    <TableCell
                      className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-[120px] truncate"
                    >
                      <span title={education.creator?.name || "N/A"}>
                        {truncateText(education.creator?.name)}
                      </span>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(education)}
                          title="View"
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(education)}
                          title="Edit"
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(education)}
                          title="Delete"
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
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
                  <PaginationItem className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300">
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
        <div className="relative w-full max-h-[80vh] overflow-y-auto overflow-x-auto rounded-xl bg-white p-6 dark:bg-gray-900">
          {modalMode === "edit" && selectedEducation && (
            <EditEducationForm education={selectedEducation} onClose={closeModal} />
          )}

          {modalMode === "delete" && selectedEducation && (
            <DeleteEducationConfirm
              onConfirm={handleDeleteConfirm}
              onCancel={closeModal}
              loading={deleteLoading}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
