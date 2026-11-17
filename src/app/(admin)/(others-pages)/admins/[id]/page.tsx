"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { AppDispatch } from "@/store/redux/store";
import { fetchUserByIdThunk, User } from "@/store/redux/slice/userSlice";
import AdminView from "@/components/form/Admin/AdminView";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminPageActions, { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function AdminDetailPage() {
  const { id } = useParams();
  const adminId = String(id ?? "");
  const dispatch = useDispatch<AppDispatch>();
  const [admin, setAdmin] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!adminId) return;
    setLoading(true);
    dispatch(fetchUserByIdThunk({ id: adminId }))
      .unwrap()
      .then((user) => setAdmin(user))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [adminId, dispatch]);

  return (
    <div className="w-full mx-auto py-6">
      <PageBreadcrumb pageTitle="Admin Details" path="/admin-table" label="Admins" />
      <AdminPageActions
        backHref="/admin-table"
        editHref={adminId ? `/admins/${adminId}/edit` : undefined}
        editLabel="Edit Admin"
      />
      {loading && <AdminPageSkeleton />}
      {error && <p className="p-6 text-red-500">Error loading admin</p>}
      {!loading && !error && admin && (
        <AdminView admin={admin} />
      )}
    </div>
  );
}
