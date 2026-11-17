"use client";

import { useRouter } from "next/navigation";
import AdminFormShell from "@/components/common/AdminFormShell";
import AchievementForm from "@/components/form/Achievement/AchievementForm";

export default function AchievementCreatePage() {
  const router = useRouter();
  const goBack = () => router.push("/achievements-table");

  return (
    <AdminFormShell
      pageTitle="Add Achievement"
      listPath="/achievements-table"
      listLabel="Achievements"
      cardTitle="Add New Achievement"
      description="Fill in the details below to add a new Achievement to the database."
    >
      <AchievementForm closeModal={goBack} />
    </AdminFormShell>
  );
}
