"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store/redux/store";
import { getBlog } from "@/store/redux/slice/blogSlice";
import { matchesBlogKey } from "@/store/api/blogsApi";
import EditBlogForm from "@/components/form/Blogs/EditBlogForm";
import AdminFormShell from "@/components/common/AdminFormShell";
import { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function BlogEditClient() {
  const { id } = useParams();
  const blogId = String(id ?? "");
  const router = useRouter();
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

  const goDetail = () => router.push(`/blogs/${blogId}`);

  return (
    <AdminFormShell
      pageTitle="Edit Blog"
      listPath="/blogs-table"
      listLabel="Blogs"
      cardTitle="Edit Blog"
      description="Update the blog details below."
    >
      {loading && !blog && <AdminPageSkeleton />}
      {error && !blog && <p className="text-red-500">{error}</p>}
      {blog && <EditBlogForm blog={blog} onClose={goDetail} />}
    </AdminFormShell>
  );
}
