"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ArrowDownUp, Eye, Pencil, Search, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/redux/store";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination/pagination";
import { MEMBER_CATEGORIES, Member, MemberQueryParams } from "@/types/memberTypes";
import { getMemberById, getMembers, removeMember } from "@/store/redux/slice/memberSlice";
import { showError, showSuccess } from "@/lib/utils/toast";
import { MESSAGES } from "../common/constants/utlis";
import { MemberForm } from "../form/Members/MemberForm";
import MemberView from "../form/Members/MemberView";
import DeleteMemberConfirm from "../form/Members/DeleteMemberConfirm";

type ModalMode = "view" | "edit" | "delete" | null;

export default function MemberTableOne() {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, openModal, closeModal } = useModal();

  const { members, loading, error, totalPages } = useSelector(
    (state: RootState) => state.member
  );

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState<MemberQueryParams["sortBy"]>("name");
  const [sortOrder, setSortOrder] = useState<MemberQueryParams["sortOrder"]>("asc");

  const itemsPerPage = 10;

  const queryParams = useMemo<MemberQueryParams>(
    () => ({
      page: currentPage,
      limit: itemsPerPage,
      search: search || undefined,
      category: category || undefined,
      sortBy,
      sortOrder,
    }),
    [category, currentPage, search, sortBy, sortOrder]
  );

  const fetchMembers = useCallback(() => {
    dispatch(getMembers(queryParams));
  }, [dispatch, queryParams]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCurrentPage(1);
      setSearch(searchInput.trim());
    }, 400);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleSort = (field: MemberQueryParams["sortBy"]) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleView = async (member: Member) => {
    setSelectedMember(member);
    setModalMode("view");
    openModal();
    setViewLoading(true);

    try {
      const memberDetails = await dispatch(getMemberById(member.id)).unwrap();
      setSelectedMember(memberDetails);
    } catch (err) {
      console.error("Fetch member details failed", err);
      showError("Failed to load member details");
    } finally {
      setViewLoading(false);
    }
  };

  const openMemberModal = (member: Member, mode: Exclude<ModalMode, "view" | null>) => {
    setSelectedMember(member);
    setModalMode(mode);
    openModal();
  };

  const refreshCurrentPage = async () => {
    await dispatch(getMembers(queryParams));
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMember) return;

    setDeleteLoading(true);
    try {
      await dispatch(removeMember(selectedMember.id)).unwrap();
      await refreshCurrentPage();
      showSuccess(MESSAGES.DELETE_SUCCESS || "Member deleted successfully");
      closeModal();
    } catch (err) {
      console.error("Delete member failed", err);
      showError(MESSAGES.DELETE_ERROR || "Failed to delete member");
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderErrorMessage = (err: unknown) => {
    if (typeof err === "string") return err;
    if (err && typeof err === "object" && "message" in err) {
      return (err as { message: string }).message;
    }
    return "Something went wrong";
  };

  const renderSortableHeader = (
    label: string,
    field: MemberQueryParams["sortBy"]
  ) => (
    <button
      type="button"
      onClick={() => handleSort(field)}
      className="inline-flex items-center gap-1 text-sm font-medium text-black dark:text-white"
    >
      {label}
      <ArrowDownUp size={14} />
    </button>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 dark:border-white/[0.05] md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name or category"
            className="h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setCurrentPage(1);
          }}
          className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          <option value="">All Categories</option>
          {MEMBER_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start">
                  {renderSortableHeader("Name", "name")}
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">
                  {renderSortableHeader("Category", "category")}
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start">
                  {renderSortableHeader("Designation", "designation")}
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
                [...Array(5)].map((_, index) => (
                  <TableRow key={`member-skeleton-${index}`}>
                    {Array(5)
                      .fill(0)
                      .map((__, cellIndex) => (
                        <TableCell key={cellIndex} className="px-5 py-4">
                          <div className="h-4 w-28 rounded bg-gray-200 animate-pulse dark:bg-gray-700" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell className="text-center py-6 text-red-500">
                    Error loading members: {renderErrorMessage(error)}
                  </TableCell>
                </TableRow>
              ) : members.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-6 text-gray-500">
                    No members found.
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member, index) => (
                  <TableRow key={member.id || `member-${index}`}>
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">
                      {member.name}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-gray-200 uppercase">
                      {member.category}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-gray-200">
                      {member.designation || "N/A"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-gray-200">
                      {member.creator?.name || member.created_by || "N/A"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(member)}
                          className="p-2 rounded-full hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openMemberModal(member, "edit")}
                          className="p-2 rounded-full hover:bg-gray-100 hover:text-green-600 dark:hover:bg-gray-800"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => openMemberModal(member, "delete")}
                          className="p-2 rounded-full hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800"
                          title="Delete"
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
        <div className="relative w-full overflow-y-auto rounded-xl bg-white p-6 dark:bg-gray-900">
          {modalMode === "view" && selectedMember && (
            viewLoading ? (
              <div className="space-y-3">
                <div className="h-5 w-32 rounded bg-gray-200 animate-pulse dark:bg-gray-700" />
                <div className="h-4 w-48 rounded bg-gray-200 animate-pulse dark:bg-gray-700" />
                <div className="h-4 w-40 rounded bg-gray-200 animate-pulse dark:bg-gray-700" />
              </div>
            ) : (
              <MemberView member={selectedMember} />
            )
          )}
          {modalMode === "edit" && selectedMember && (
            <MemberForm
              mode="edit"
              initialMember={selectedMember}
              onSuccess={async () => {
                await refreshCurrentPage();
                closeModal();
              }}
            />
          )}
          {modalMode === "delete" && selectedMember && (
            <DeleteMemberConfirm
              name={selectedMember.name}
              loading={deleteLoading}
              onConfirm={handleDeleteConfirm}
              onCancel={closeModal}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
