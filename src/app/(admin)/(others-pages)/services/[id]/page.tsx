"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { AppDispatch, RootState } from "@/store/redux/store";
import { fetchServiceByIdThunk } from "@/store/redux/slice/serviceSlice";
import ServiceView from "@/components/form/Service/ServiceView";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminPageActions, { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const serviceId = String(id ?? "");
  const dispatch = useDispatch<AppDispatch>();
  const { selectedService, loading, error } = useSelector(
    (state: RootState) => state.service
  );

  useEffect(() => {
    if (serviceId) dispatch(fetchServiceByIdThunk(serviceId));
  }, [serviceId, dispatch]);

  return (
    <div className="w-full mx-auto py-6">
      <PageBreadcrumb pageTitle="Service Details" path="/services-table" label="Services" />
      <AdminPageActions
        backHref="/services-table"
        editHref={serviceId ? `/services/${serviceId}/edit` : undefined}
        editLabel="Edit Service"
      />
      {loading && <AdminPageSkeleton />}
      {error && <p className="p-6 text-red-500">Error loading service</p>}
      {!loading && !error && selectedService && (
        <ServiceView service={selectedService} />
      )}
    </div>
  );
}
