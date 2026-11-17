"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState, AppDispatch } from "@/store/redux/store";
import { getBlog } from "@/store/redux/slice/blogSlice";
import { matchesBlogKey } from "@/store/api/blogsApi";
import BlogView from "@/components/form/Blogs/BlogView";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminPageActions, { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function BlogDetailClient() {
  const { id } = useParams();
  const blogId = String(id ?? "");
  const dispatch = useDispatch<AppDispatch>();
  const { selected, items, loading, error } = useSelector(
    (state: RootState) => state.blogs
  );

  const blog =
    (selected && matchesBlogKey(selected, blogId) ? selected : null) ??
    items.find((item) => matchesBlogKey(item, blogId)) ??
    null;

  useEffect(() => {
    if (blogId) {
      dispatch(getBlog(blogId));
    }
  }, [blogId, dispatch]);

  return (
    <div className="w-full mx-auto py-6">
      <PageBreadcrumb pageTitle="Blog Details" path="/blogs-table" label="Blogs" />
      <AdminPageActions
        backHref="/blogs-table"
        editHref={blogId ? `/blogs/${blogId}/edit` : undefined}
        editLabel="Edit Blog"
      />

      {loading && !blog && <AdminPageSkeleton />}
      {error && !blog && <p className="p-6 text-red-500">{error}</p>}
      {blog && <BlogView blog={blog} />}
    </div>
  );
}
