"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { TableIdCell, TableIdHeader, TableIdSkeletonCell, TableSerialCell, TableSerialHeader, TableSerialSkeletonCell, TABLE_SERIAL_PREFIX, getTableSerialNumber } from "./TableIdColumn";
import { Eye, Pencil, Trash2, Video as VideoIcon } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination/pagination";
import { useModal } from "@/hooks/useModal";
import { useRouter } from "next/navigation";
import { Modal } from "../ui/modal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/redux/store";
import { getVideos, removeVideo, Video } from "@/store/redux/slice/videoSlice";
import { MESSAGES } from "../common/constants/utlis";
import { showApiError, showSuccess } from "@/lib/utils/toast";

export default function VideosTableOne() {
  const dispatch = useDispatch<AppDispatch>();
  const { videos, loading, error } = useSelector((state: RootState) => state.video);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [modalMode, setModalMode] = useState<"delete" | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(getVideos());
  }, [dispatch]);

  const totalPages = Math.ceil(videos.length / itemsPerPage) || 1;
  const paginatedVideos = videos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleView = (video: Video) => {
    if (!video.id) return;
    router.push(`/gallery/videos/${video.id}`);
  };

  const handleEdit = (video: Video) => {
    if (!video.id) return;
    router.push(`/gallery/videos/${video.id}/edit`);
  };

  const handleDelete = (video: Video) => {
    setSelectedVideo(video);
    setModalMode("delete");
    openModal();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVideo) return;
    setDeleteLoading(true);
    try {
      await dispatch(removeVideo(selectedVideo.id)).unwrap();
      showSuccess(MESSAGES.DELETE_SUCCESS || "Video deleted successfully");
      closeModal();
    } catch (err) {
      console.error("Delete failed:", err);
      showApiError(err, MESSAGES.DELETE_ERROR || "Failed to delete video");
    } finally {
      setDeleteLoading(false);
    }
  };

  const truncateText = (text?: string, maxLength = 30) => {
    if (!text) return "N/A";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] text-left">
            <TableRow>
              <TableSerialHeader />
              <TableIdHeader />
              <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Video</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">File Name</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Created By</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Actions</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableSerialSkeletonCell />
                  <TableIdSkeletonCell />
                  <TableCell className="px-5 py-4">
                    <div className="w-6 h-6 bg-gray-300 rounded-md animate-pulse"></div>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                      <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                      <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-red-500">
                  Error loading videos.
                </TableCell>
              </TableRow>
            ) : paginatedVideos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No videos found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedVideos.map((video: Video, index) => (
                <TableRow key={video.id}>
                  <TableSerialCell value={getTableSerialNumber(currentPage, itemsPerPage, index, TABLE_SERIAL_PREFIX.video)} />
                  <TableIdCell id={video.id} />
                  <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white flex justify-start">
                    <VideoIcon size={24} className="text-gray-600 dark:text-gray-300 cursor-pointer" onClick={() => handleView(video)} />
                  </TableCell>

                  <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-[200px] truncate">
                    <a
                      href={video.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {truncateText(video.youtube_url, 30)}
                    </a>
                  </TableCell>

                  <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-[120px] truncate">
                    {video.creator?.name || "N/A"}
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(video)}
                        title="View"
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(video)}
                        title="Edit"
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(video)}
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

        {totalPages > 1 && !loading && (
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
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg text-center">
          {modalMode === "delete" && selectedVideo && (
            <>
              <h3 className="text-lg font-semibold mb-4">Delete Video?</h3>
              <p>
                Are you sure you want to delete{" "}
                <strong>{selectedVideo.description || "this video"}</strong>?
              </p>
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
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}


