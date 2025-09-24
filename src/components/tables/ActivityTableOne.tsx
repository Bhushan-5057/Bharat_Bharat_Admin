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
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination/pagination";
import { showError, showSuccess } from "@/lib/utils/toast";
import { MESSAGES } from "../common/constants/utlis";
import { Modal } from "../ui/modal";
import Image from "next/image";
import { Activity } from "@/types/activityTypes";
import { deleteActivityThunk, fetchAllActivitiesThunk } from "@/store/redux/slice/activitySlice";
import ActivityView from "../form/Activity/ActivityView";
import EditActivityForm from "../form/Activity/EditActivityForm";
import DeleteActivityConfirm from "../form/Activity/DeleteConfirm";



export default function ActivityTableOne() {
    const dispatch = useDispatch<AppDispatch>();
    const { isOpen, openModal, closeModal } = useModal();

    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [modalMode, setModalMode] = useState<"view" | "edit" | "delete" | null>(
        null
    );
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { activities = [], loading, error } = useSelector(
        (state: RootState) => state.activities
    );


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(activities.length / itemsPerPage) || 1;
    const paginatedActivities = activities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
    };

    useEffect(() => {
        dispatch(fetchAllActivitiesThunk());
    }, [dispatch]);

    const handleView = (activity: Activity) => {
        setSelectedActivity(activity);
        setModalMode("view");
        openModal();
    };

    const handleEdit = (activity: Activity) => {
        setSelectedActivity(activity);
        setModalMode("edit");
        openModal();
    };

    const handleDelete = (activity: Activity) => {
        setSelectedActivity(activity);
        setModalMode("delete");
        openModal();
    };

    const handleDeleteConfirm: () => Promise<void> = async () => {
        if (!selectedActivity) return;
        setDeleteLoading(true);

        try {
            await dispatch(deleteActivityThunk(selectedActivity.id)).unwrap();
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
        if (err && typeof err === "object" && "message" in err)
            return (err as { message: string }).message;
        return JSON.stringify(err);
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[800px]">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Title</TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Description</TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Image</TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Create By</TableCell>
                                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Actions</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {loading
                                ? [...Array(itemsPerPage)].map((_, i) => (
                                    <TableRow key={`skeleton-${i}`}>
                                        <TableCell>
                                            <div className="h-4 w-32 rounded bg-gray-200 animate-pulse"></div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="h-4 w-48 rounded bg-gray-200 animate-pulse"></div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="h-16 w-16 rounded bg-gray-200 animate-pulse"></div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="h-16 w-16 rounded bg-gray-200 animate-pulse"></div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                                                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                                                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                                : error
                                    ? (
                                        <TableRow>
                                            <TableCell className="text-center py-6 text-red-500">
                                                Error: {renderErrorMessage(error)}
                                            </TableCell>
                                        </TableRow>
                                    )
                                    : activities.length === 0
                                        ? (
                                            <TableRow>
                                                <TableCell className="text-center py-6 text-gray-500" >
                                                    No Event found.
                                                </TableCell>
                                            </TableRow>
                                        )
                                        : paginatedActivities.map((activity, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">{activity.title
                                                    ? activity.title.length > 30
                                                        ? activity.title.slice(0, 30) + "..."
                                                        : activity.title
                                                    : "—"
                                                }</TableCell>
                                                <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                                                    {activity.description
                                                        ? activity.description.length > 30
                                                            ? activity.description.slice(0, 30) + "..."
                                                            : activity.description
                                                        : "—"}
                                                </TableCell>
                                                <TableCell className="px-5 py-4">
                                                    {activity.data ? (
                                                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                                                            <Image
                                                                src={`data:image/${activity.file_name?.endsWith(".svg") ? "svg+xml" : "png"
                                                                    };base64,${activity.data}`}
                                                                alt={activity.title}
                                                                fill
                                                                className="object-cover"
                                                                priority
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">No image</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">{activity.creator?.name}</TableCell>
                                                <TableCell className="px-5 py-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => handleView(activity)} title="View" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-black hover:text-blue-600 dark:text-white dark:hover:text-blue-600">
                                                            <Eye size={16} />
                                                        </button>
                                                        <button onClick={() => handleEdit(activity)} title="Edit" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-black hover:text-green-600 dark:text-white dark:hover:text-green-600">
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(activity)} title="Delete" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-black hover:text-red-600 dark:text-white dark:hover:text-red-600">
                                                            <Trash2 size={16} />
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
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            aria-disabled={currentPage === 1}
                                        />
                                    </PaginationItem>
                                    <PaginationItem>
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
                    {modalMode === "view" && selectedActivity && (
                        <ActivityView activity={selectedActivity} onClose={closeModal} />
                    )}
                    {modalMode === "edit" && selectedActivity && (
                        <EditActivityForm activity={selectedActivity} closeModal={closeModal} />
                    )}
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

