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
import Image from "next/image";

import { getAllBlogs, removeBlog } from "@/store/redux/slice/blogSlice";
import { Blog } from "@/types/blogTypes";
import { showError, showSuccess } from "@/lib/utils/toast";
import { MESSAGES } from "../common/constants/utlis";
import DeleteBlogConfirm from "../form/Blogs/DeleteBlogConfirm";
import EditBlogForm from "../form/Blogs/EditBlogForm";
import BlogView from "../form/Blogs/BlogView";

export default function BlogsTableOne() {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, openModal, closeModal } = useModal();

  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete" | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const { items: blogs = [], loading, error } = useSelector(
    (state: RootState) => state.blogs
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(blogs.length / itemsPerPage) || 1;
  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  const handleView = (blog: Blog) => {
    setSelectedBlog(blog);
    setModalMode("view");
    openModal();
  };

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setModalMode("edit");
    openModal();
  };

  const handleDelete = (blog: Blog) => {
    setSelectedBlog(blog);
    setModalMode("delete");
    openModal();
  };

  const handleDeleteConfirm: () => Promise<void> = async () => {
    if (!selectedBlog) return;
    setDeleteLoading(true);

    try {
      await dispatch(removeBlog(String(selectedBlog.id))).unwrap();
      const res = await dispatch(getAllBlogs()).unwrap();

      const updatedBlogs: Blog[] = res || [];
      const newTotalPages = Math.ceil(updatedBlogs.length / itemsPerPage) || 1;
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
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white ">Title</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white ">Category</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white ">Tags</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white ">Created By</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white ">Image</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-medium text-black dark:text-white ">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    {Array(6).fill(0).map((_, j) => (
                      <TableCell key={j} className="px-5 py-4">
                        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell className="text-center py-6 text-red-500">
                    Error loading blogs: {renderErrorMessage(error)}
                  </TableCell>
                </TableRow>
              ) : blogs.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-6 text-gray-500">
                    No blogs found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBlogs.map((blog, index) => (
                  <TableRow key={blog.id ?? `blog-${index}`}>
                    <TableCell className="px-5 py-4">{blog.title || "N/A"}</TableCell>
                    <TableCell className="px-5 py-4">{blog.category || "N/A"}</TableCell>
                    <TableCell className="px-5 py-4">{blog.tags || "N/A"}</TableCell>
                    <TableCell className="px-5 py-4">{blog.creator?.name || "N/A"}</TableCell>
                    <TableCell className="px-5 py-4">
                      {blog.data ? (
                        <div className="relative w-12 h-12">
                          <Image
                            src={`data:image/png;base64,${blog.data}`}
                            alt={blog.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-[25%]"
                            priority
                          />
                        </div>
                      ) : blog.file_name ? (
                        <div className="relative w-12 h-12">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${blog.file_name}`}
                            alt={blog.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                            priority
                          />
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleView(blog)} title="View" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800  hover:text-blue-600 dark:text-white dark:hover:text-blue-600">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleEdit(blog)} title="Edit" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800  hover:text-green-600 dark:text-white dark:hover:text-green-600">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(blog)} title="Delete" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-600 dark:text-white dark:hover:text-red-600">
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
                  <PaginationItem>
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
        <div className="relative w-full max-h-[80vh] overflow-y-auto rounded-xl bg-white p-6 dark:bg-gray-900">
          {modalMode === "edit" && selectedBlog && (
            <EditBlogForm blog={selectedBlog} onClose={closeModal} />
          )}

          {modalMode === "view" && selectedBlog && (
            <BlogView blog={selectedBlog} onClose={closeModal} />
          )}

          {modalMode === "delete" && selectedBlog && (
            <DeleteBlogConfirm
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
