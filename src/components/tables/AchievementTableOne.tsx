"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TableIdCell, TableIdHeader, TableSerialCell, TableSerialHeader, TABLE_SERIAL_PREFIX, getTableSerialNumber } from "./TableIdColumn";
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
  getAllAchievements,
  removeAchievement,
} from "@/store/redux/slice/achievementSlice";
import { showApiError, showSuccess } from "@/lib/utils/toast";
import Image from "next/image";
import { Achievement } from "@/types/achievementTypes";
import { getMediaUrl } from "@/utils/mediaUrl";
import DeleteAchievementConfirm from "../form/Achievement/DeleteAchievementConfirm";
import { useRouter } from "next/navigation";

export default function AchievementTableOne() {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, openModal, closeModal } = useModal();

  const router = useRouter();

  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);
  const [modalMode, setModalMode] = useState<"delete" | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const { items: achievements = [], loading } = useSelector(
    (state: RootState) => state.achievements
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(achievements.length / itemsPerPage) || 1;
  const paginatedAchievements = achievements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  useEffect(() => {
    dispatch(getAllAchievements());
  }, [dispatch]);

  const handleView = (achievement: Achievement) => {
    if (!achievement.id) return;
    router.push(`/achievements/${achievement.id}`);
  };

  const handleEdit = (achievement: Achievement) => {
    if (!achievement.id) return;
    router.push(`/achievements/${achievement.id}/edit`);
  };

  const handleDelete = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setModalMode("delete");
    openModal();
  };

  const handleDeleteConfirm: () => Promise<void> = async () => {
    if (!selectedAchievement) return;
    setDeleteLoading(true);

    try {
      await dispatch(removeAchievement(selectedAchievement.id)).unwrap();
      const res = await dispatch(getAllAchievements()).unwrap();

      const updatedAchievements: Achievement[] = res || [];
      const newTotalPages =
        Math.ceil(updatedAchievements.length / itemsPerPage) || 1;
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }

      showSuccess("Achievement deleted successfully");
      closeModal();
    } catch (err: unknown) {
      console.error("Delete failed:", err);
      showApiError(err, "Failed to delete achievement");
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
                  Address
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white"
                >
                  Images
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white"
                >
                  Created By
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
                [...Array(5)].map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {Array(7)
                      .fill(0)
                      .map((_, j) => (
                        <TableCell key={j} className="px-5 py-4">
                          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              ) : achievements.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-gray-500"
                  >
                    No achievement records found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAchievements.map((achievement, index) => (
                  <TableRow key={achievement.id ?? `achievement-${index}`}>
                    <TableSerialCell value={getTableSerialNumber(currentPage, itemsPerPage, index, TABLE_SERIAL_PREFIX.achievement)} />
                    <TableIdCell id={achievement.id} />
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white max-w-[150px] truncate">
                      <span title={achievement.title}>
                        {truncateText(achievement.title)}
                      </span>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-[200px] truncate">
                      {achievement.address ? (
                        <span title={achievement.address}>
                          {truncateText(achievement.address)}
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-white/[0.05] text-gray-500 dark:text-gray-400 rounded-full text-xs font-medium">
                          Not Provided
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {achievement.images && achievement.images.length > 0 ? (
                        <div className="flex gap-2">
                          {achievement.images.slice(0, 1).map((img, i) => (
                            <div key={i} className="relative w-12 h-12">
                              <Image
                                src={getMediaUrl(img)}
                                alt={achievement.title || "Achievement Image"}
                                fill
                                className="rounded-md object-cover"
                              />
                            </div>
                          ))}
                          {achievement.images.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{achievement.images.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-[120px] truncate">
                      <span title={achievement.creator?.name || "N/A"}>
                        {truncateText(achievement.creator?.name)}
                      </span>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(achievement)}
                          title="View"
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(achievement)}
                          title="Edit"
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(achievement)}
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
          {modalMode === "delete" && selectedAchievement && (
            <DeleteAchievementConfirm
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
