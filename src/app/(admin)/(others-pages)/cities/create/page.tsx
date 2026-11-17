"use client";

import { useRouter } from "next/navigation";
import AdminFormShell from "@/components/common/AdminFormShell";
import AddCityForm from "@/components/form/City/AddCityForm";

export default function CityCreatePage() {
  const router = useRouter();
  const goBack = () => router.push("/city-table");

  return (
    <AdminFormShell
      pageTitle="Add City"
      listPath="/city-table"
      listLabel="Our Presence"
      cardTitle="Add New City"
      description="Fill in the details below to add a new City to the database."
    >
      <AddCityForm closeModal={goBack} />
    </AdminFormShell>
  );
}
