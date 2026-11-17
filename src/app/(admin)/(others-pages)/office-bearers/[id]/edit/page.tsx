"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/redux/store";
import { getOfficeBearerById } from "@/store/redux/slice/officeBearerSlice";
import EditBearerForm from "@/components/form/OfficeBearer/EditBearerForm";
import AdminFormShell from "@/components/common/AdminFormShell";
import { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function BearerEditPage() {
  const { id } = useParams();
  const bearerId = String(id ?? "");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { selected, loading, error } = useSelector(
    (state: RootState) => state.officeBearer
  );

  useEffect(() => {
    if (bearerId) dispatch(getOfficeBearerById(bearerId));
  }, [bearerId, dispatch]);

  return (
    <AdminFormShell
      pageTitle="Edit Bearer"
      listPath="/bearer-table"
      listLabel="Bearers"
      cardTitle="Edit Bearer"
      description="Update the office bearer details below."
    >
      {loading && <AdminPageSkeleton />}
      {error && <p className="text-red-500">Error loading bearer</p>}
      {!loading && !error && selected && (
        <EditBearerForm
          bearer={selected as never}
          onClose={() => router.push(`/office-bearers/${bearerId}`)}
        />
      )}
    </AdminFormShell>
  );
}
