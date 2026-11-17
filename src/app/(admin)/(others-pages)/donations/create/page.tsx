"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/store/redux/store";
import { getDonations } from "@/store/redux/slice/donationSlice";
import AdminFormShell from "@/components/common/AdminFormShell";
import { DonationForm } from "@/components/form/DonationForm/DonationForm";

export default function DonationCreatePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <AdminFormShell
      pageTitle="Add Donation"
      listPath="/donation-table"
      listLabel="Donations"
      cardTitle="Add New Donation"
      description="Fill in the details to add a new donation record."
    >
      <DonationForm
        mode="add"
        onSuccess={() => {
          dispatch(getDonations());
          router.push("/donation-table");
        }}
      />
    </AdminFormShell>
  );
}
