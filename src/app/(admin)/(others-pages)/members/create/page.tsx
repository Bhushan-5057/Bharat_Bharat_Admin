"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/store/redux/store";
import { getMembers } from "@/store/redux/slice/memberSlice";
import AdminFormShell from "@/components/common/AdminFormShell";
import { MemberForm } from "@/components/form/Members/MemberForm";

export default function MemberCreatePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <AdminFormShell
      pageTitle="Add Member"
      listPath="/members-table"
      listLabel="Members"
      cardTitle="Add New Member"
      description="Fill in the details to add a new member record."
    >
      <MemberForm
        mode="add"
        onSuccess={async () => {
          await dispatch(getMembers({ page: 1, limit: 10 }));
          router.push("/members-table");
        }}
      />
    </AdminFormShell>
  );
}
