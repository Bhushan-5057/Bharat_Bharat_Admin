"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { Eye, Pencil, Trash2, Video as VideoIcon } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination/pagination";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/redux/store";
import { getVideos, removeVideo, Video } from "@/store/redux/slice/videoSlice";
import { VideoUploadForm } from "../form/VideoUploadForm/VideoUploadForm";
import { MESSAGES } from "../common/constants/utlis";
import { showSuccess } from "@/lib/utils/toast";

export default function VideosTableOne() {
  const dispatch = useDispatch<AppDispatch>();
  const { videos, loading, error } = useSelector((state: RootState) => state.video);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { isOpen, openModal, closeModal } = useModal();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete" | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);


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
    setSelectedVideo(video);
    setModalMode("view");
    openModal();
  };

  const handleEdit = (video: Video) => {
    setSelectedVideo(video);
    setModalMode("edit");
    openModal();
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
    } finally {
      setDeleteLoading(false);
    }
  };

  const truncateText = (text?: string, maxLength = 30) => {
    if (!text) return "N/A";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const getEmbedUrl = (url?: string) => {
    if (!url) return "";
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch {
      return url;
    }
  };

  const timeAgo = (dateString?: string) => {
    if (!dateString) return "N/A";

    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} sec${diffInSeconds !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 3600) {
      const mins = Math.floor(diffInSeconds / 60);
      return `${mins} min${mins !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hrs = Math.floor(diffInSeconds / 3600);
      return `${hrs} hr${hrs !== 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  };

  useEffect(() => {
    if (selectedVideo) {
      setVideoLoading(true);
    }
  }, [selectedVideo]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] text-left">
            <TableRow>
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
                <TableCell colSpan={4} className="text-center py-6 text-red-500">
                  Error loading videos.
                </TableCell>
              </TableRow>
            ) : paginatedVideos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                  No videos found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedVideos.map((video: Video) => (
                <TableRow key={video.id}>
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
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
        <div className="relative w-full max-h-[80vh] overflow-y-auto rounded-xl bg-white p-6 dark:bg-gray-900">


          {modalMode === "view" && selectedVideo && (
            <div className="relative w-full pt-[56.25%]">
              {videoLoading && (
                <div className="absolute top-0 left-0 w-full h-full rounded-md bg-gray-300 dark:bg-gray-700 animate-pulse z-10" >
                  <div
                    className="w-full h-full animate-pulse"
                    style={{
                      background: "linear-gradient(90deg, #d1d5db 25%, #e5e7eb 50%, #d1d5db 75%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.5s infinite",
                    }}
                  />
                </div>
              )}

              <iframe
                src={getEmbedUrl(selectedVideo.youtube_url)}
                title={selectedVideo.description || "YouTube video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={`absolute top-0 left-0 w-full h-full rounded-md transition-opacity duration-300 ${videoLoading ? "opacity-0" : "opacity-100"
                  }`}
                onLoad={() => setVideoLoading(false)}
              />
            </div>
          )}

          {modalMode === "view" && selectedVideo && (
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              Uploaded at: {timeAgo(selectedVideo.createdAt)}
            </p>
          )}


          {modalMode === "edit" && selectedVideo && (
            <VideoUploadForm
              initialVideo={{
                id: selectedVideo.id,
                youtube_url: selectedVideo.youtube_url || "",
                description: selectedVideo.description || "",
              }}
              mode="edit"
              onSuccess={() => {
                closeModal();
                dispatch(getVideos());
              }}
            />
          )}



          {modalMode === "delete" && selectedVideo && (
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg text-center">
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
              </div>
            </Modal>
          )}
        </div>
      </Modal>
    </div>
  );
}


