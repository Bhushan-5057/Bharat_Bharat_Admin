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
import { showApiError, showSuccess } from "@/lib/utils/toast";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import { MESSAGES } from "../common/constants/utlis";
import { Modal } from "../ui/modal";
import Image from "next/image";
import { getMediaUrl } from "@/utils/mediaUrl";
import DeleteEventConfirm from "../form/event/DeleteConfirm";
import { City } from "@/types/cityTypes";
import { deleteCityThunk, fetchAllCitiesThunk } from "@/store/redux/slice/citySlice";
import { useRouter } from "next/navigation";


export default function CityTableOne() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { isOpen, openModal, closeModal } = useModal();

    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [modalMode, setModalMode] = useState<"delete" | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { cities = [], loading, error } = useSelector(
        (state: RootState) => state.cities
    );

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(cities.length / itemsPerPage) || 1;
    const paginatedCities = cities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
    };

    useEffect(() => {
        dispatch(fetchAllCitiesThunk());
    }, [dispatch]);

    const handleView = (city: City) => {
        if (!city.id) return;
        router.push(`/cities/${city.id}`);
    };

    const handleEdit = (city: City) => {
        if (!city.id) return;
        router.push(`/cities/${city.id}/edit`);
    };

    const handleDelete = (event: City) => {
        setSelectedCity(event);
        setModalMode("delete");
        openModal();
    };

    const handleDeleteConfirm: () => Promise<void> = async () => {
        if (!selectedCity) return;
        setDeleteLoading(true);

        try {
            await dispatch(deleteCityThunk(selectedCity.id)).unwrap();
            const res = await dispatch(fetchAllCitiesThunk()).unwrap();
            const updatedCities: City[] = res || [];
            const newTotalPages = Math.ceil(updatedCities.length / itemsPerPage) || 1;
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
                                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">State</TableCell>
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
                                        <TableSerialSkeletonCell />
                                        <TableIdSkeletonCell />
                                        <TableCell>
                                            <div className="h-4 w-28 rounded bg-gray-200 animate-pulse"></div>
                                        </TableCell>
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
                                    : cities.length === 0
                                        ? (
                                            <TableRow>
                                                <TableCell className="text-center py-6 text-gray-500" >
                                                    No City found.
                                                </TableCell>
                                            </TableRow>
                                        )
                                        : paginatedCities.map((city, index: number) => (
                                            <TableRow key={city.id ?? index}>
                                                <TableSerialCell value={getTableSerialNumber(currentPage, itemsPerPage, index, TABLE_SERIAL_PREFIX.city)} />
                                                <TableIdCell id={city.id} />
                                                <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">{city.state || "—"}</TableCell>
                                                <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">{city.title
                                                    ? city.title.length > 30
                                                        ? city.title.slice(0, 30) + "..."
                                                        : city.title
                                                    : "—"
                                                }</TableCell>
                                                <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                                                    {city.description
                                                        ? city.description.length > 30
                                                            ? city.description.slice(0, 30) + "..."
                                                            : city.description
                                                        : "—"}
                                                </TableCell>

                                                <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                    {city?.images && city?.images.length > 0 ? (
                                                        <div className="flex gap-2">
                                                            {city.images.slice(0, 1).map((img, i: number) => (
                                                                <div key={i} className="relative w-12 h-12">
                                                                    <Image
                                                                        src={
                                                                            getMediaUrl(img) || "/placeholder.png"
                                                                        }
                                                                        alt={city.title || "City Image"}
                                                                        fill
                                                                        className="rounded-md object-cover"
                                                                    />
                                                                </div>
                                                            ))}
                                                            {city.images.length > 2 && (
                                                                <span className="text-xs text-gray-500">
                                                                    +{city.images.length - 2} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        "N/A"
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">{city.creator?.name}</TableCell>
                                                <TableCell className="px-5 py-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => handleView(city)} title="View" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-black hover:text-blue-600 dark:text-white dark:hover:text-blue-600">
                                                            <Eye size={16} />
                                                        </button>
                                                        <button onClick={() => handleEdit(city)} title="Edit" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-black hover:text-green-600 dark:text-white dark:hover:text-green-600">
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(city)} title="Delete" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-black hover:text-red-600 dark:text-white dark:hover:text-red-600">
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
                    {modalMode === "delete" && selectedCity && (
                        <DeleteEventConfirm
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

