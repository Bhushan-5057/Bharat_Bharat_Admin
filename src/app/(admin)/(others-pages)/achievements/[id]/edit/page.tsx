"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store/redux/store";
import { getAchievementById } from "@/store/redux/slice/achievementSlice";
import EditAchievementForm from "@/components/form/Achievement/EditAchievementForm";
import AdminFormShell from "@/components/common/AdminFormShell";
import { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function AchievementEditPage() {
  const { id } = useParams();
  const achievementId = String(id ?? "");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { selected, loading, error } = useSelector(
    (state: RootState) => state.achievements
  );

  useEffect(() => {
    if (achievementId) {
      dispatch(getAchievementById(achievementId));
    }
  }, [achievementId, dispatch]);

  const goDetail = () => router.push(`/achievements/${achievementId}`);

  return (
    <AdminFormShell
      pageTitle="Edit Achievement"
      listPath="/achievements-table"
      listLabel="Achievements"
      cardTitle="Edit Achievement"
      description="Update the achievement details below."
    >
      {loading && <AdminPageSkeleton />}
      {error && <p className="text-red-500">Error loading achievement</p>}
      {!loading && !error && selected && (
        <EditAchievementForm achievement={selected} onClose={goDetail} />
      )}
    </AdminFormShell>
  );
}
