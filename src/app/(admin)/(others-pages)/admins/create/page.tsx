"use client";

import { useRouter } from "next/navigation";
import AdminFormShell from "@/components/common/AdminFormShell";
import AddAdminForm from "@/components/form/Admin/AddAdminSection";

export default function AdminCreatePage() {
  const router = useRouter();
  const goBack = () => router.push("/admin-table");

  return (
    <AdminFormShell
      pageTitle="Add Admin"
      listPath="/admin-table"
      listLabel="Admins"
      cardTitle="Add New Admin"
      description="Fill in the details below to add a new Admin to the database."
    >
      <AddAdminForm closeModal={goBack} />
    </AdminFormShell>
  );
}
