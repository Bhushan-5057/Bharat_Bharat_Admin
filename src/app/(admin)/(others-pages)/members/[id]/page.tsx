"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { AppDispatch, RootState } from "@/store/redux/store";
import { getMemberById } from "@/store/redux/slice/memberSlice";
import MemberView from "@/components/form/Members/MemberView";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminPageActions, { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function MemberDetailPage() {
  const { id } = useParams();
  const memberId = String(id ?? "");
  const dispatch = useDispatch<AppDispatch>();
  const { member, loading, error } = useSelector((state: RootState) => state.member);

  useEffect(() => {
    if (memberId) dispatch(getMemberById(memberId));
  }, [memberId, dispatch]);

  return (
    <div className="w-full mx-auto py-6">
      <PageBreadcrumb pageTitle="Member Details" path="/members-table" label="Members" />
      <AdminPageActions
        backHref="/members-table"
        editHref={memberId ? `/members/${memberId}/edit` : undefined}
        editLabel="Edit Member"
      />
      {loading && <AdminPageSkeleton />}
      {error && <p className="p-6 text-red-500">Error loading member</p>}
      {!loading && !error && member && <MemberView member={member} />}
    </div>
  );
}
