"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/redux/store";
import { fetchServiceByIdThunk } from "@/store/redux/slice/serviceSlice";
import EditServiceForm from "@/components/form/Service/EditServiceForm";
import AdminFormShell from "@/components/common/AdminFormShell";
import { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function ServiceEditPage() {
  const { id } = useParams();
  const serviceId = String(id ?? "");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedService, loading, error } = useSelector(
    (state: RootState) => state.service
  );

  useEffect(() => {
    if (serviceId) dispatch(fetchServiceByIdThunk(serviceId));
  }, [serviceId, dispatch]);

  return (
    <AdminFormShell
      pageTitle="Edit Service"
      listPath="/services-table"
      listLabel="Services"
      cardTitle="Edit Service"
      description="Update the service details below."
    >
      {loading && <AdminPageSkeleton />}
      {error && <p className="text-red-500">Error loading service</p>}
      {!loading && !error && selectedService && (
        <EditServiceForm
          service={selectedService}
          closeModal={() => router.push(`/services/${serviceId}`)}
        />
      )}
    </AdminFormShell>
  );
}
