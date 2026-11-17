"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState, AppDispatch } from "@/store/redux/store";
import { fetchActivityByIdThunk } from "@/store/redux/slice/activitySlice";
import ActivityView from "@/components/form/Activity/ActivityView";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminPageActions, { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function ActivityDetailClient() {
  const { id } = useParams();
  const activityId = String(id ?? "");
  const dispatch = useDispatch<AppDispatch>();
  const { selectedActivity, loading, error } = useSelector(
    (state: RootState) => state.activities
  );

  useEffect(() => {
    if (activityId) {
      dispatch(fetchActivityByIdThunk(activityId));
    }
  }, [activityId, dispatch]);

  return (
    <div className="w-full mx-auto py-6">
      <PageBreadcrumb
        pageTitle="Activity Details"
        path="/activity-table"
        label="Activities"
      />
      <AdminPageActions
        backHref="/activity-table"
        editHref={activityId ? `/activities/${activityId}/edit` : undefined}
        editLabel="Edit Activity"
      />

      {loading && <AdminPageSkeleton />}
      {error && <p className="p-6 text-red-500">Error loading activity</p>}
      {!loading && !error && selectedActivity && (
        <ActivityView activity={selectedActivity} />
      )}
    </div>
  );
}
