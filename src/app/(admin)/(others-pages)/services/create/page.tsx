"use client";

import { useRouter } from "next/navigation";
import AdminFormShell from "@/components/common/AdminFormShell";
import AddServiceForm from "@/components/form/Service/AddServiceForm";

export default function ServiceCreatePage() {
  const router = useRouter();
  return (
    <AdminFormShell
      pageTitle="Add Service"
      listPath="/services-table"
      listLabel="Services"
      cardTitle="Add New Service"
      description="Fill in the details below to add a new Service to the database."
    >
      <AddServiceForm closeModal={() => router.push("/services-table")} />
    </AdminFormShell>
  );
}
