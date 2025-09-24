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
import AdminView from "../form/Admin/AdminView";
import UpdateAdmin from "../form/Admin/UpdateAdmin";
import DeleteAdminConfirm from "../form/Admin/DeleteConfirm";

import { fetchAllUsersThunk, updateUserStatusThunk } from "@/store/redux/slice/userSlice";
import { showError, showSuccess } from "@/lib/utils/toast";
import { User } from "@/store/redux/slice/userSlice";
import { MESSAGES } from "../common/constants/utlis";



export default function AdminTableOne() {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, openModal, closeModal } = useModal();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete" | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const { users = [], loading, error } = useSelector((state: RootState) => state.user);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


  const filteredUsers = users.filter(
    (user) => user.id !== currentUser?.id && user.created_by !== "system"
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    dispatch(fetchAllUsersThunk());
  }, [dispatch]);

  const handleView = (user: User) => {
    setSelectedUser(user);
    setModalMode("view");
    openModal();
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalMode("edit");
    openModal();
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setModalMode("delete");
    openModal();
  };

  const handleDeleteConfirm: () => Promise<void> = async () => {
    if (!selectedUser) return;
    setDeleteLoading(true);
    try {
      await dispatch(updateUserStatusThunk({ id: selectedUser.id, status: "DELETED" })).unwrap();
      await dispatch(fetchAllUsersThunk());
      showSuccess(MESSAGES.DELETE_SUCCESS);
      closeModal();
    }
    catch (err: unknown) {
      console.error("Delete failed:", err);
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : MESSAGES.DELETE_ERROR;
      showError(errorMessage);
    }
    finally {
      setDeleteLoading(false);
    }
  };

  const renderErrorMessage = (err: unknown) => {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    return (err as { message: string }).message;
  }
  return JSON.stringify(err);
};


  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Name</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Email</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Created by</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (

                [...Array(5)].map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell className="px-5 py-4">
                      <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
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
              ) : error ? (
                <TableRow key="error">
                  <TableCell className="text-center py-6 text-red-500">
                    Error loading users: {renderErrorMessage(error)}
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow key="no-users">
                  <TableCell className="text-center py-6 text-gray-500">No users found.</TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">{user.name}</TableCell>
                    <TableCell className="px-5 py-4 text-sm text-black dark:text-white">{user.email}</TableCell>
                    <TableCell className="px-5 py-4 text-sm text-black dark:text-white">{user.created_by}</TableCell>
                    <TableCell className="px-0 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(user)}
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-black hover:text-blue-600 dark:text-white dark:hover:text-blue-600"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-black hover:text-green-600 dark:text-white dark:hover:text-green-600"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-black hover:text-red-600 dark:text-white dark:hover:text-red-600"
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
                    <PaginationPrevious className="cursor-pointer" onClick={() => handlePageChange(currentPage - 1)} aria-disabled={currentPage === 1} />
                  </PaginationItem>
                  <PaginationItem className="px-2 py-1 text-sm text-gray-700 dark:text-gray-300">
                    Page {currentPage} of {totalPages}
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext className="cursor-pointer" onClick={() => handlePageChange(currentPage + 1)} aria-disabled={currentPage === totalPages} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
        <div className="relative w-full overflow-y-auto rounded-xl bg-white p-6 dark:bg-gray-900">
          {modalMode === "view" && selectedUser && <AdminView admin={selectedUser} open={isOpen} onClose={closeModal} />}
          {modalMode === "edit" && selectedUser && <UpdateAdmin admin={selectedUser} onClose={closeModal} />}
          {modalMode === "delete" && selectedUser && <DeleteAdminConfirm onConfirm={handleDeleteConfirm} onCancel={closeModal} loading={deleteLoading} />}
        </div>
      </Modal>
    </div>
  );
}

