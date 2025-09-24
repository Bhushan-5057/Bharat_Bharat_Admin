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
import DeleteOfficeBearerConfirm from "../form/OfficeBearer/DeleteOfficeBearerConfirm";
import { getAllOfficeBearers, removeOfficeBearer } from "@/store/redux/slice/officeBearerSlice";
import { showError, showSuccess } from "@/lib/utils/toast";
import { MESSAGES } from "../common/constants/utlis";
import EditBearerForm, { Bearer } from "../form/OfficeBearer/EditBearerForm";
import OfficeBearerView from "../form/OfficeBearer/OfficeBearerView";
import Image from "next/image";
import { OfficeBearer } from "@/types/officeBearerTypes";
import { FacebookIcon, TwitterIcon } from "../SvgIcons/Icons";
 
 
export default function OfficeBearerTableOne() {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, openModal, closeModal } = useModal();
 
  const [selectedBearer, setSelectedBearer] = useState<OfficeBearer | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete" | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
 
  const { items: officeBearers = [], loading, error } = useSelector(
    (state: RootState) => state.officeBearer
  );
 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
 
  const totalPages = Math.ceil(officeBearers.length / itemsPerPage) || 1;
  const paginatedBearers = officeBearers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
 
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };
 
  useEffect(() => {
    dispatch(getAllOfficeBearers());
  }, [dispatch]);
 
  const handleView = (bearer: OfficeBearer) => {
    setSelectedBearer(bearer);
    setModalMode("view");
    openModal();
  };
 
  const handleEdit = (bearer: OfficeBearer) => {
    setSelectedBearer(bearer);
    setModalMode("edit");
    openModal();
  };
 
  const handleDelete = (bearer: OfficeBearer) => {
    setSelectedBearer(bearer);
    setModalMode("delete");
    openModal();
  };
 
  const handleDeleteConfirm: () => Promise<void> = async () => {
    if (!selectedBearer) return;
    setDeleteLoading(true);
 
    try {
      await dispatch(removeOfficeBearer(selectedBearer.id)).unwrap();
      const res = await dispatch(getAllOfficeBearers()).unwrap();
 
      const updatedBearers: OfficeBearer[] = res || [];
      const newTotalPages = Math.ceil(updatedBearers.length / itemsPerPage) || 1;
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
 
 
  const renderErrorMessage = (err: unknown) => {
    if (typeof err === "string") return err;
    if (err && typeof err === "object" && "message" in err) return (err as { message: string }).message;
    return JSON.stringify(err);
  };
 
 
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Name</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Designation</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Email</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Facebook</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Twitter</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Image</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Created By</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Actions</TableCell>
              </TableRow>
            </TableHeader>
 
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {Array(8).fill(0).map((_, j) => (
                      <TableCell key={j} className="px-5 py-4">
                        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : error ? (
                <TableRow key="error">
                  <TableCell className="text-center py-6 text-red-500" >
                    Error loading office bearers: {renderErrorMessage(error)}
                  </TableCell>
                </TableRow>
              ) : officeBearers.length === 0 ? (
                <TableRow key="no-users">
                  <TableCell className="text-center py-6 text-gray-500" >
                    No office bearers found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBearers.map((bearer, index) => (
                  <TableRow key={bearer.id ?? `bearer-${index}`}>
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">{bearer.title || "N/A"}</TableCell>
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">{bearer.designation || "N/A"}</TableCell>
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">{bearer.gmail || "N/A"}</TableCell>
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                      {bearer.facebook ? (
                        <a href={bearer.facebook} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          <FacebookIcon  className="w-7 h-7 text-gray-500 rounded-full dark:text-white"/>
                        </a>
                      ) : "N/A"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                      {bearer.twitter ? (
                        <a href={bearer.twitter} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                          <TwitterIcon className="w-7 h-7 text-gray-500 rounded-full dark:text-white"/>
                        </a>
                      ) : "N/A"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                      {bearer.data ? (
                        <div className="relative w-12 h-12">
                          <Image
                            src={`data:image/png;base64,${bearer.data}`}
                            alt={bearer.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-[25%]"
                            priority
                          />
                        </div>
                      ) : bearer.file_name ? (
                        <div className="relative w-12 h-12">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${bearer.file_name}`}
                            alt={bearer.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                            priority
                          />
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
 
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">{bearer.creator?.name || "N/A"}</TableCell>
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleView(bearer)} title="View" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleEdit(bearer)} title="Edit" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(bearer)} title="Delete" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
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
        <div className="relative w-full overflow-y-auto rounded-xl bg-white p-6 dark:bg-gray-900">
          {modalMode === "edit" && selectedBearer && (
            <EditBearerForm bearer={selectedBearer as unknown as Bearer} onClose={closeModal} />
          )}
 
          {modalMode === "view" && selectedBearer && (
            <OfficeBearerView bearer={selectedBearer} onClose={closeModal} />
          )}
 
          {modalMode === "delete" && selectedBearer && (
            <DeleteOfficeBearerConfirm
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
 
 