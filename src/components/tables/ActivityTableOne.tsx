"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { RootState, AppDispatch } from "@/store/redux/store";
import { useModal } from "@/hooks/useModal";
import { useRouter } from "next/navigation";
import { showApiError, showSuccess } from "@/lib/utils/toast";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import { MESSAGES } from "../common/constants/utlis";
import { Activity } from "@/types/activityTypes";
import { getDisplayImageUrl } from "@/utils/mediaUrl";
import { formatTime12h } from "@/utils/time";
import {
    deleteActivityThunk,
    fetchAllActivitiesThunk,
} from "@/store/redux/slice/activitySlice";

// UI Components
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { TableIdCell, TableSerialCell, TABLE_SERIAL_PREFIX, getTableSerialNumber } from "./TableIdColumn";
import { Modal } from "../ui/modal";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination/pagination";

// Modal Forms
import DeleteActivityConfirm from "../form/Activity/DeleteConfirm";

export default function ActivityTableOne() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { isOpen, openModal, closeModal } = useModal();

    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [modalMode, setModalMode] = useState<"delete" | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { activities = [], loading, error } = useSelector(
        (state: RootState) => state.activities
    );

    const itemsPerPage = 5;
    const totalPages = Math.ceil(activities.length / itemsPerPage) || 1;

    const paginatedActivities = activities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    useEffect(() => {
        dispatch(fetchAllActivitiesThunk());
    }, [dispatch]);

    const openActivityModal = (activity: Activity, mode: "delete") => {
        setSelectedActivity(activity);
        setModalMode(mode);
        openModal();
    };

    const handleView = (activity: Activity) => {
        if (!activity.id) return;
        router.push(`/activities/${activity.id}`);
    };

    const handleEdit = (activity: Activity) => {
        if (!activity.id) return;
        router.push(`/activities/${activity.id}/edit`);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedActivity) return;

        setDeleteLoading(true);
        try {
            await dispatch(deleteActivityThunk(selectedActivity.id)).unwrap();
            
            // Calculate what the page count should be after removal
            const remainingCount = activities.length - 1;
            const projectedTotalPages = Math.ceil(remainingCount / itemsPerPage) || 1;
            
            if (currentPage > projectedTotalPages) {
                setCurrentPage(projectedTotalPages);
            }

            const res = await dispatch(fetchAllActivitiesThunk()).unwrap();
            const updatedActivities: Activity[] = res || [];
            const newTotalPages = Math.ceil(updatedActivities.length / itemsPerPage) || 1;

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

    const renderErrorMessage = (err: unknown): string =>
        getApiErrorMessage(err, "Something went wrong");

    const formatTime = (value?: string) => formatTime12h(value);

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1200px]">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                {["S.No.", "ID", "Title", "Description", "State / City", "Date", "Time", "Image", "Created By", "Actions"].map((header) => (
                                    <TableCell
                                        key={header}
                                        isHeader
                                        className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white"
                                    >
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {loading ? (
                                [...Array(itemsPerPage)].map((_, i) => (
                                    <TableRow key={`skeleton-${i}`}>
                                        {[...Array(10)].map((_, colIdx) => (
                                            <TableCell key={`cell-${colIdx}`}>
                                                <div className={`rounded bg-gray-200 animate-pulse ${colIdx === 5 ? 'h-16 w-16' : colIdx === 1 ? 'h-4 w-48' : 'h-4 w-24'}`} />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-6 text-red-500">
                                        Error: {renderErrorMessage(error)}
                                    </TableCell>
                                </TableRow>
                            ) : activities.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-6 text-gray-500">
                                        No Activity found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedActivities.map((activity, index) => (
                                    <TableRow key={activity.id}>
                                        <TableSerialCell value={getTableSerialNumber(currentPage, itemsPerPage, index, TABLE_SERIAL_PREFIX.activity)} />
                                        <TableIdCell id={activity.id} />
                                        <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                                            {activity.title ? (activity.title.length > 30 ? `${activity.title.slice(0, 30)}...` : activity.title) : "—"}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                                            {activity.description ? (activity.description.length > 30 ? `${activity.description.slice(0, 30)}...` : activity.description) : "—"}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white">
                                            {[activity.state, activity.venue].filter(Boolean).join(" · ") || "—"}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white">
                                            {activity.end_date && activity.end_date !== activity.date
                                              ? `${activity.date || "—"} - ${activity.end_date}`
                                              : activity.date || "—"}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                                            {activity.start_time && activity.end_time ? (
                                                <>
                                                    {formatTime(activity.start_time)}
                                                    {" - "}<br />
                                                    {formatTime(activity.end_time)}
                                                </>
                                            ) : "—"}
                                        </TableCell>
                                        <TableCell className="px-5 py-4">
                                            {getDisplayImageUrl(activity) ? (
                                                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                                                    <Image
                                                        src={getDisplayImageUrl(activity)}
                                                        alt={activity.title || "Activity image"}
                                                        fill
                                                        className="object-cover"
                                                        priority
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">No image</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                                            {activity.creator?.name || "—"}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleView(activity)}
                                                    title="View"
                                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-black hover:text-blue-600 dark:text-white dark:hover:text-blue-600"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(activity)}
                                                    title="Edit"
                                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-black hover:text-green-600 dark:text-white dark:hover:text-green-600"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => openActivityModal(activity, "delete")}
                                                    title="Delete"
                                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-black hover:text-red-600 dark:text-white dark:hover:text-red-600"
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
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            aria-disabled={currentPage === 1}
                                        />
                                    </PaginationItem>
                                    <PaginationItem className="text-sm text-gray-600 dark:text-gray-400 mx-2">
                                        Page {currentPage} of {totalPages}
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext
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
                    {modalMode === "delete" && selectedActivity && (
                        <DeleteActivityConfirm
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
