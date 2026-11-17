"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState, AppDispatch } from "@/store/redux/store";
import { getPublicationById } from "@/store/redux/slice/publicationSlice";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CertificateView from "@/components/form/Publications/CertificateView";
import AdminPageActions, { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function CertificateDetailClient() {
  const { id } = useParams();
  const certificateId = Number(id);
  const dispatch = useDispatch<AppDispatch>();
  const { selectedPublication, error } = useSelector(
    (state: RootState) => state.publications
  );

  useEffect(() => {
    if (!Number.isNaN(certificateId)) {
      dispatch(getPublicationById(certificateId));
    }
  }, [certificateId, dispatch]);

  const certificateReady =
    selectedPublication && Number(selectedPublication.id) === certificateId;

  return (
    <div className="w-full mx-auto py-6">
      <PageBreadcrumb
        pageTitle="Certificate Details"
        path="/certificates-table"
        label="Certificates"
      />
      <AdminPageActions
        backHref="/certificates-table"
        editHref={
          !Number.isNaN(certificateId)
            ? `/certificates/${certificateId}/edit`
            : undefined
        }
        editLabel="Edit Certificate"
      />

      {!certificateReady && !error && <AdminPageSkeleton />}
      {error && <p className="p-6 text-red-500">Error loading certificate</p>}
      {certificateReady && !error && selectedPublication && (
        <CertificateView certificate={selectedPublication} />
      )}
    </div>
  );
}
