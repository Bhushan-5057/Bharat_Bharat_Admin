"use client";

import { useRouter } from "next/navigation";
import AdminFormShell from "@/components/common/AdminFormShell";
import AddBlogForm from "@/components/form/Blogs/AddBlogForm";

export default function BlogCreateClient() {
  const router = useRouter();
  const goBack = () => router.push("/blogs-table");

  return (
    <AdminFormShell
      pageTitle="Add Blog"
      listPath="/blogs-table"
      listLabel="Blogs"
      cardTitle="Add New Blog"
      description="Fill in the details below to add a new Blog to the database."
    >
      <AddBlogForm closeModal={goBack} />
    </AdminFormShell>
  );
}
