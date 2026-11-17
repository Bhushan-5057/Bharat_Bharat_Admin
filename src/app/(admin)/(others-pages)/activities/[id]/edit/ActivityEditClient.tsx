"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store/redux/store";
import { fetchActivityByIdThunk } from "@/store/redux/slice/activitySlice";
import EditActivityForm from "@/components/form/Activity/EditActivityForm";
import AdminFormShell from "@/components/common/AdminFormShell";
import { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function ActivityEditClient() {
  const { id } = useParams();
  const activityId = String(id ?? "");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedActivity, loading, error } = useSelector(
    (state: RootState) => state.activities
  );

  useEffect(() => {
    if (activityId) {
      dispatch(fetchActivityByIdThunk(activityId));
    }
  }, [activityId, dispatch]);

  const goDetail = () => router.push(`/activities/${activityId}`);

  return (
    <AdminFormShell
      pageTitle="Edit Activity"
      listPath="/activity-table"
      listLabel="Activities"
      cardTitle="Edit Activity"
      description="Update the activity details below."
    >
      {loading && <AdminPageSkeleton />}
      {error && <p className="text-red-500">Error loading activity</p>}
      {!loading && !error && selectedActivity && (
        <EditActivityForm activity={selectedActivity} closeModal={goDetail} />
      )}
    </AdminFormShell>
  );
}
