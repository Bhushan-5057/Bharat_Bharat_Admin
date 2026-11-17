"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { AppDispatch } from "@/store/redux/store";
import { fetchUserByIdThunk, User } from "@/store/redux/slice/userSlice";
import UpdateAdmin from "@/components/form/Admin/UpdateAdmin";
import AdminFormShell from "@/components/common/AdminFormShell";
import { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function AdminEditPage() {
  const { id } = useParams();
  const adminId = String(id ?? "");
  const router = useRouter();
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
    <AdminFormShell
      pageTitle="Edit Admin"
      listPath="/admin-table"
      listLabel="Admins"
      cardTitle="Edit Admin"
      description="Update the admin details below."
    >
      {loading && <AdminPageSkeleton />}
      {error && <p className="text-red-500">Error loading admin</p>}
      {!loading && !error && admin && (
        <UpdateAdmin
          admin={{ id: admin.id, name: admin.name, email: admin.email }}
          onClose={() => router.push(`/admins/${adminId}`)}
        />
      )}
    </AdminFormShell>
  );
}
