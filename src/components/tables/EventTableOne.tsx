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
import { useRouter } from "next/navigation";
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
import { getDisplayImageUrl } from "@/utils/mediaUrl";
import {
  deleteEventThunk,
  fetchAllEventsThunk,
} from "@/store/redux/slice/eventSlice";
import DeleteEventConfirm from "../form/event/DeleteConfirm";
import { Event } from "@/types/eventTypes";
import { formatTime12h } from "@/utils/time";
import { TableIdCell, TableIdHeader, TableIdSkeletonCell, TableSerialCell, TableSerialHeader, TableSerialSkeletonCell, TABLE_SERIAL_PREFIX, getTableSerialNumber } from "./TableIdColumn";

export default function EventTableOne() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalMode, setModalMode] = useState<"delete" | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { events, loading, error } = useSelector((state: RootState) => state.events);
  const eventList: Event[] = Array.isArray(events) ? events : [];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(eventList.length / itemsPerPage) || 1;

  const paginatedEvents = eventList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return "-";

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) return value;

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTimeRange = (
    startTime?: string,
    endTime?: string
  ) => {
    if (!startTime || !endTime) return "-";

    return `${formatTime12h(startTime, "-")} - ${formatTime12h(endTime, "-")}`;
  };

  useEffect(() => {
    dispatch(fetchAllEventsThunk());
  }, [dispatch]);

  const handleView = (event: Event) => {
    if (!event.id) return;
    router.push(`/events/${event.id}`);
  };

  const handleEdit = (event: Event) => {
    if (!event.id) return;
    router.push(`/events/${event.id}/edit`);
  };

  const handleDelete = (event: Event) => {
    setSelectedEvent(event);

    setModalMode("delete");

    openModal();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvent) return;

    setDeleteLoading(true);
    try {
      await dispatch(deleteEventThunk(selectedEvent.id)).unwrap();

      const res = await dispatch(fetchAllEventsThunk()).unwrap();

      const updatedEvents: Event[] = Array.isArray(res)
        ? res
        : Array.isArray((res as { data?: Event[] })?.data)
          ? (res as { data?: Event[] }).data || []
          : [];

      const newTotalPages =
        Math.ceil(updatedEvents.length / itemsPerPage) || 1;

      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }

      showSuccess("Event deleted successfully");

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
        <div className="min-w-[1100px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableSerialHeader />
                <TableIdHeader />
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white"
                >
                  Title
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white"
                >
                  Description
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white"
                >
                  Date
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white"
                >
                  Time
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white"
                >
                  State / City
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white"
                >
                  Image
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white"
                >
                  Create By
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                [...Array(itemsPerPage)].map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableSerialSkeletonCell />
                    <TableIdSkeletonCell />
                    <TableCell>
                      <div className="h-4 w-32 rounded bg-gray-200 animate-pulse"></div>
                    </TableCell>

                    <TableCell>
                      <div className="h-4 w-48 rounded bg-gray-200 animate-pulse"></div>
                    </TableCell>

                    <TableCell>
                      <div className="h-4 w-24 rounded bg-gray-200 animate-pulse"></div>
                    </TableCell>

                    <TableCell>
                      <div className="h-4 w-20 rounded bg-gray-200 animate-pulse"></div>
                    </TableCell>

                    <TableCell>
                      <div className="h-4 w-28 rounded bg-gray-200 animate-pulse"></div>
                    </TableCell>

                    <TableCell>
                      <div className="h-16 w-16 rounded bg-gray-200 animate-pulse"></div>
                    </TableCell>

                    <TableCell>
                      <div className="h-4 w-20 rounded bg-gray-200 animate-pulse"></div>
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
              ) : error ? (
                <TableRow>
                  <TableCell className="text-center py-6 text-red-500">
                    Error: {renderErrorMessage(error)}
                  </TableCell>
                </TableRow>
              ) : eventList.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-6 text-gray-500">
                    No Event found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedEvents.map((event, index: number) => (
                  <TableRow key={event.id ?? index}>
                    <TableSerialCell value={getTableSerialNumber(currentPage, itemsPerPage, index, TABLE_SERIAL_PREFIX.event)} />
                    <TableIdCell id={event.id} />
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                      {event.title
                        ? event.title.length > 30
                          ? event.title.slice(0, 30) + "..."
                          : event.title
                        : "-"}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                      {event.description
                        ? event.description.length > 30
                          ? event.description.slice(0, 30) + "..."
                          : event.description
                        : "-"}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                      {event.end_date && event.end_date !== event.event_date
                        ? `${formatDate(event.event_date)} - ${formatDate(event.end_date)}`
                        : formatDate(event.event_date)}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                      {formatTimeRange(
                        event.start_time,
                        event.end_time
                      )}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                      {[event.state, event.venue].filter(Boolean).join(" · ")
                        ? [event.state, event.venue].filter(Boolean).join(" · ").length > 30
                          ? [event.state, event.venue].filter(Boolean).join(" · ").slice(0, 30) + "..."
                          : [event.state, event.venue].filter(Boolean).join(" · ")
                        : "-"}
                    </TableCell>

                    <TableCell className="px-5 py-4">
                      {getDisplayImageUrl(event) ? (
                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                          <Image
                            src={getDisplayImageUrl(event)}
                            alt={event.title}
                            fill
                            className="object-cover"
                            priority
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No image
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                      {event.creator?.name}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(event)}
                          title="View"
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-black hover:text-blue-600 dark:text-white dark:hover:text-blue-600"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => handleEdit(event)}
                          title="Edit"
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-black hover:text-green-600 dark:text-white dark:hover:text-green-600"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(event)}
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
                      onClick={() =>
                        handlePageChange(currentPage - 1)
                      }
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>

                  <PaginationItem>
                    Page {currentPage} of {totalPages}
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(currentPage + 1)
                      }
                      aria-disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="m-2 w-[calc(100vw-1rem)] max-w-[620px] sm:m-4 sm:w-[calc(100vw-2rem)]"
      >
        <div className="relative">
          {modalMode === "delete" && selectedEvent && (
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