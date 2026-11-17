"use client";

import { useRouter } from "next/navigation";
import AdminFormShell from "@/components/common/AdminFormShell";
import AddPublicationForm from "@/components/form/Publications/AddPublicationForm";

export default function CertificateCreatePage() {
  const router = useRouter();
  return (
    <AdminFormShell
      pageTitle="Add Certificate"
      listPath="/certificates-table"
      listLabel="Certificates"
      cardTitle="Add New Certificate"
      description="Fill in the details below to add a new Certificate to the database."
    >
      <AddPublicationForm closeModal={() => router.push("/certificates-table")} />
    </AdminFormShell>
  );
}
