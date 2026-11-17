"use client";

import { useRouter } from "next/navigation";
import AdminFormShell from "@/components/common/AdminFormShell";
import { PhotoUploadForm } from "@/components/form/PhotoUploadForm/PhotoUploadForm";

export default function PhotoCreatePage() {
  const router = useRouter();
  return (
    <AdminFormShell
      pageTitle="Add Photo"
      listPath="/gallery/photos-table"
      listLabel="Photos"
      cardTitle="Add New Photo"
      description="Upload a new photo to the gallery."
    >
      <PhotoUploadForm mode="add" onSuccess={() => router.push("/gallery/photos-table")} />
    </AdminFormShell>
  );
}
