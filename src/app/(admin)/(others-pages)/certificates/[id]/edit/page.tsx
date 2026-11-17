"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/redux/store";
import { getPublicationById } from "@/store/redux/slice/publicationSlice";
import AddPublicationForm from "@/components/form/Publications/AddPublicationForm";
import AdminFormShell from "@/components/common/AdminFormShell";
import { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function CertificateEditPage() {
  const { id } = useParams();
  const publicationId = Number(id);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedPublication, loading, error } = useSelector(
    (state: RootState) => state.publications
  );

  useEffect(() => {
    if (!Number.isNaN(publicationId)) {
      dispatch(getPublicationById(publicationId));
    }
  }, [publicationId, dispatch]);

  return (
    <AdminFormShell
      pageTitle="Edit Certificate"
      listPath="/certificates-table"
      listLabel="Certificates"
      cardTitle="Edit Certificate"
      description="Update the certificate below."
    >
      {loading && <AdminPageSkeleton />}
      {error && <p className="text-red-500">Error loading certificate</p>}
      {!loading && !error && selectedPublication && (
        <AddPublicationForm
          publicationId={selectedPublication.id}
          selectedPublication={selectedPublication}
          closeModal={() => router.push("/certificates-table")}
        />
      )}
    </AdminFormShell>
  );
}
