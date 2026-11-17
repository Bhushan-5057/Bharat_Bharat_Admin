"use client";

import { useRouter } from "next/navigation";
import AdminFormShell from "@/components/common/AdminFormShell";
import AddActivityForm from "@/components/form/Activity/AddActivityForm";

export default function ActivityCreateClient() {
  const router = useRouter();
  const goBack = () => router.push("/activity-table");

  return (
    <AdminFormShell
      pageTitle="Add Activity"
      listPath="/activity-table"
      listLabel="Activities"
      cardTitle="Add New Activity"
      description="Fill in the details below to add a new Activity to the database."
    >
      <AddActivityForm closeModal={goBack} />
    </AdminFormShell>
  );
}
