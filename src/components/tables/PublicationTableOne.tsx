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
import { useRouter } from "next/navigation";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination/pagination";

import { showApiError, showError, showSuccess } from "@/lib/utils/toast";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import { IMGAGES, MESSAGES } from "../common/constants/utlis";
import { Modal } from "../ui/modal";
import DeletePublicationConfirm from "../form/Publications/DeletePublicationConfirm";
import { getPublications, removePublication } from "@/store/redux/slice/publicationSlice";
import { Publication } from "@/types/publicationTypes";
import { openCertificatePdf } from "@/utils/certificateUrl";
import { TableIdCell, TableIdHeader, TableIdSkeletonCell, TableSerialCell, TableSerialHeader, TableSerialSkeletonCell, TABLE_SERIAL_PREFIX, getTableSerialNumber } from "./TableIdColumn";
import Image from "next/image";


export default function PublicationTableOne() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { isOpen, openModal, closeModal } = useModal();

    const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
    const [modalMode, setModalMode] = useState<"delete" | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

    const { publications, loading, error } = useSelector(
        (state: RootState) => state.publications
    );

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(publications.length / itemsPerPage) || 1;

    const paginatedData = publications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        dispatch(getPublications());
    }, [dispatch, currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };


    const handleView = (pub: Publication) => {
        if (!openCertificatePdf(pub)) {
            showError("PDF is not available");
        }
    };

    const handleEdit = (publication: Publication) => {
        if (!publication.id) return;
        router.push(`/certificates/${publication.id}/edit`);
    };

    const handleDelete = (publication: Publication) => {
        setSelectedPublication(publication);
        setModalMode("delete");
        openModal();
    };

    const handleDeleteConfirm: () => Promise<void> = async () => {
        if (!selectedPublication) return;
        setDeleteLoading(true);

        try {
            await dispatch(removePublication(selectedPublication.id)).unwrap();
            const res = await dispatch(getPublications()).unwrap();

            const updatedPublications: Publication[] = res || [];
            const newTotalPages = Math.ceil(updatedPublications.length / itemsPerPage) || 1;
            if (currentPage > newTotalPages) {
                setCurrentPage(newTotalPages);
            }

            showSuccess(MESSAGES.DELETE_SUCCESS);
            closeModal();
        } catch (err: unknown) {
            console.error("Delete failed:", err);
            showApiError(err, MESSAGES.DELETE_ERROR);
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
                                    PDF
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

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {loading
                                ? [...Array(itemsPerPage)].map((_, i) => (
                                    <TableRow key={`skeleton-${i}`}>
                                        <TableSerialSkeletonCell />
                                        <TableIdSkeletonCell />
                                        <TableCell className="px-5 py-4">
                                            <div className="flex items-center justify-center h-16 w-16 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4">
                                            <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4">
                                            <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4">
                                            <div className="flex gap-2">
                                                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                                                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                                                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                                : error
                                    ? (
                                        <TableRow key="error-row">
                                            <TableCell colSpan={6} className="text-center py-6 text-red-500">
                                                Error loading publications: {renderErrorMessage(error)}
                                            </TableCell>
                                        </TableRow>
                                    )
                                    : publications.length === 0
                                        ? (
                                            <TableRow key="no-data-row">
                                                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                                                    No certificates found.
                                                </TableCell>
                                            </TableRow>
                                        )
                                        : paginatedData.map((pub, index: number) => (
                                            <TableRow key={pub.id ?? index}>
                                                <TableSerialCell value={getTableSerialNumber(currentPage, itemsPerPage, index, TABLE_SERIAL_PREFIX.certificate)} />
                                                <TableIdCell id={pub.id} />
                                                <TableCell className="px-5 py-4">
                                                    <div className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
                                                        <Image
                                                            src={IMGAGES.PDF_SVG}
                                                            alt="PDF Icon"
                                                            height={100}
                                                            width={100}
                                                            className="object-contain p-1"
                                                            priority
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-5 py-4">{pub.file_name}</TableCell>
                                                <TableCell className="px-5 py-4">{pub.creator?.name || "Unknown"}</TableCell>
                                                <TableCell className="px-5 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <button onClick={() => handleView(pub)} title="View PDF">
                                                            <Eye size={16} className="cursor-pointer hover:text-blue-600" />
                                                        </button>
                                                        <button onClick={() => handleEdit(pub)} title="Edit">
                                                            <Pencil size={16} className="cursor-pointer hover:text-green-600" />
                                                        </button>
                                                        <button onClick={() => handleDelete(pub)} title="Delete">
                                                            <Trash2 size={16} className="cursor-pointer hover:text-red-600" />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
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
                    {modalMode === "delete" && selectedPublication && (
                        <DeletePublicationConfirm
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
