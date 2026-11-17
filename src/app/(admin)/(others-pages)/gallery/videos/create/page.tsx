"use client";

import { useRouter } from "next/navigation";
import AdminFormShell from "@/components/common/AdminFormShell";
import { VideoUploadForm } from "@/components/form/VideoUploadForm/VideoUploadForm";

export default function VideoCreatePage() {
  const router = useRouter();
  return (
    <AdminFormShell
      pageTitle="Add Video"
      listPath="/gallery/videos-table"
      listLabel="Videos"
      cardTitle="Add New Video"
      description="Add a YouTube video to the gallery."
    >
      <VideoUploadForm mode="add" onSuccess={() => router.push("/gallery/videos-table")} />
    </AdminFormShell>
  );
}
