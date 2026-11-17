"use client";

import { useRouter } from "next/navigation";
import AdminFormShell from "@/components/common/AdminFormShell";
import AddEventForm from "@/components/form/event/AddEventForm";

export default function EventCreateClient() {
  const router = useRouter();
  const goBack = () => router.push("/event-table");

  return (
    <AdminFormShell
      pageTitle="Add Event"
      listPath="/event-table"
      listLabel="Events"
      cardTitle="Add New Event"
      description="Fill in the details below to add a new Event to the database."
    >
      <AddEventForm closeModal={goBack} />
    </AdminFormShell>
  );
}
