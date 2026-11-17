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
import { useRouter } from "next/navigation";
import { Modal } from "../ui/modal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination/pagination";
import DeleteAdminConfirm from "../form/Admin/DeleteConfirm";

import { deleteUserThunk, fetchAllUsersThunk } from "@/store/redux/slice/userSlice";
import { showApiError, showSuccess } from "@/lib/utils/toast";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import { User } from "@/store/redux/slice/userSlice";
import { MESSAGES } from "../common/constants/utlis";



export default function AdminTableOne() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useModal();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<"delete" | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const { users = [], loading, error } = useSelector((state: RootState) => state.user);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isSuperAdmin = currentUser?.role === "super_admin";

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


  const filteredUsers = users.filter((user) => {
    const isCurrentUser = user.id === currentUser?.id;
    const isSystemUser = user.created_by === "system";
    const isHiddenSuperAdmin = !isSuperAdmin && user.role === "super_admin";

    return !isCurrentUser && !isSystemUser && !isHiddenSuperAdmin;
  });

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
    if (!user.id) return;
    router.push(`/admins/${user.id}`);
  };

  const handleEdit = (user: User) => {
    if (!user.id) return;
    router.push(`/admins/${user.id}/edit`);
  };

  const handleDelete = (user: User) => {
    if (!isSuperAdmin) return;
    setSelectedUser(user);
    setModalMode("delete");
    openModal();
  };

  const handleDeleteConfirm: () => Promise<void> = async () => {
    if (!selectedUser) return;
    setDeleteLoading(true);
    try {
      await dispatch(deleteUserThunk({ id: selectedUser.id })).unwrap();
      await dispatch(fetchAllUsersThunk());
      showSuccess(MESSAGES.DELETE_SUCCESS);
      closeModal();
    }
    catch (err: unknown) {
      console.error("Delete failed:", err);
      showApiError(err, MESSAGES.DELETE_ERROR);
    }
    finally {
      setDeleteLoading(false);
    }
  };

  const renderErrorMessage = (err: unknown) =>
    getApiErrorMessage(err, "Something went wrong");

const formatRole = (role?: string) => {
  if (role === "super_admin") return "Super Admin";
  if (role === "admin") return "Admin";
  return role || "-";
};

const formatCreatedBy = (user: User) => {
  if (user.creator?.name) return user.creator.name;

  if (
    typeof user.created_by === "object" &&
    user.created_by !== null &&
    "name" in user.created_by
  ) {
    return user.created_by.name || "N/A";
  }

  const creatorId = user.created_by?.toString();

  if (!creatorId || creatorId === "system") return "System";
  if (creatorId === currentUser?.id?.toString()) return currentUser.name;

  const creator = users.find((adminUser) => adminUser.id?.toString() === creatorId);

  return creator?.name || creatorId;
};


  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableSerialHeader />
                <TableIdHeader />
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Name</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Email</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Role</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Created by</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (

                [...Array(5)].map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableSerialSkeletonCell />
                    <TableIdSkeletonCell />
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
                paginatedUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableSerialCell value={getTableSerialNumber(currentPage, itemsPerPage, index, TABLE_SERIAL_PREFIX.admin)} />
                    <TableIdCell id={user.id} />
                    <TableCell className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white">{user.name}</TableCell>
                    <TableCell className="px-5 py-4 text-sm text-black dark:text-white">{user.email}</TableCell>
                    <TableCell className="px-5 py-4 text-sm text-black dark:text-white">{formatRole(user.role)}</TableCell>
                    <TableCell className="px-5 py-4 text-sm text-black dark:text-white">{formatCreatedBy(user)}</TableCell>
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
                        {isSuperAdmin && (
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-black hover:text-red-600 dark:text-white dark:hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
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
          {modalMode === "delete" && selectedUser && <DeleteAdminConfirm onConfirm={handleDeleteConfirm} onCancel={closeModal} loading={deleteLoading} />}
        </div>
      </Modal>
    </div>
  );
}

