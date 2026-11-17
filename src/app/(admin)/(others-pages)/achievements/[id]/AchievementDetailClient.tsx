"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState, AppDispatch } from "@/store/redux/store";
import { getAchievementById } from "@/store/redux/slice/achievementSlice";
import AchievementView from "@/components/form/Achievement/AchievementView";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminPageActions, { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function AchievementDetailClient() {
  const { id } = useParams();
  const achievementId = String(id ?? "");
  const dispatch = useDispatch<AppDispatch>();
  const { selected, loading, error } = useSelector(
    (state: RootState) => state.achievements
  );

  useEffect(() => {
    if (achievementId) {
      dispatch(getAchievementById(achievementId));
    }
  }, [achievementId, dispatch]);

  return (
    <div className="w-full mx-auto py-6">
      <PageBreadcrumb
        pageTitle="Achievement Details"
        path="/achievements-table"
        label="Achievements"
      />
      <AdminPageActions
        backHref="/achievements-table"
        editHref={achievementId ? `/achievements/${achievementId}/edit` : undefined}
        editLabel="Edit Achievement"
      />

      {loading && <AdminPageSkeleton />}
      {error && (
        <p className="p-6 text-red-500">Error loading achievement</p>
      )}
      {!loading && !error && selected && (
        <AchievementView achievement={selected} onClose={() => {}} />
      )}
    </div>
  );
}
