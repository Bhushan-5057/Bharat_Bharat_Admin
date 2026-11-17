"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { AppDispatch, RootState } from "@/store/redux/store";
import { getOfficeBearerById } from "@/store/redux/slice/officeBearerSlice";
import OfficeBearerView from "@/components/form/OfficeBearer/OfficeBearerView";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminPageActions, { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function BearerDetailPage() {
  const { id } = useParams();
  const bearerId = String(id ?? "");
  const dispatch = useDispatch<AppDispatch>();
  const { selected, loading, error } = useSelector(
    (state: RootState) => state.officeBearer
  );

  useEffect(() => {
    if (bearerId) dispatch(getOfficeBearerById(bearerId));
  }, [bearerId, dispatch]);

  return (
    <div className="w-full mx-auto py-6">
      <PageBreadcrumb pageTitle="Bearer Details" path="/bearer-table" label="Bearers" />
      <AdminPageActions
        backHref="/bearer-table"
        editHref={bearerId ? `/office-bearers/${bearerId}/edit` : undefined}
        editLabel="Edit Bearer"
      />
      {loading && <AdminPageSkeleton />}
      {error && <p className="p-6 text-red-500">Error loading bearer</p>}
      {!loading && !error && selected && (
        <OfficeBearerView bearer={selected} />
      )}
    </div>
  );
}
