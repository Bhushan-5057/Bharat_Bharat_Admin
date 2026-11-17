"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/redux/store";
import { getMemberById, getMembers } from "@/store/redux/slice/memberSlice";
import { MemberForm } from "@/components/form/Members/MemberForm";
import AdminFormShell from "@/components/common/AdminFormShell";
import { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function MemberEditPage() {
  const { id } = useParams();
  const memberId = String(id ?? "");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { member, loading, error } = useSelector((state: RootState) => state.member);

  useEffect(() => {
    if (memberId) dispatch(getMemberById(memberId));
  }, [memberId, dispatch]);

  return (
    <AdminFormShell
      pageTitle="Edit Member"
      listPath="/members-table"
      listLabel="Members"
      cardTitle="Edit Member"
      description="Update the member details below."
    >
      {loading && <AdminPageSkeleton />}
      {error && <p className="text-red-500">Error loading member</p>}
      {!loading && !error && member && (
        <MemberForm
          mode="edit"
          initialMember={member}
          onSuccess={async () => {
            await dispatch(getMembers({ page: 1, limit: 10 }));
            router.push(`/members/${memberId}`);
          }}
        />
      )}
    </AdminFormShell>
  );
}
