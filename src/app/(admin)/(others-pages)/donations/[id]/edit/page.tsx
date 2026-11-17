"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { AppDispatch } from "@/store/redux/store";
import { getDonationById, getDonations } from "@/store/redux/slice/donationSlice";
import { Donation } from "@/store/api/donationApi";
import { DonationForm } from "@/components/form/DonationForm/DonationForm";
import AdminFormShell from "@/components/common/AdminFormShell";
import { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function DonationEditPage() {
  const { id } = useParams();
  const donationId = String(id ?? "");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!donationId) return;
    setLoading(true);
    dispatch(getDonationById(donationId))
      .unwrap()
      .then(setDonation)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [donationId, dispatch]);

  return (
    <AdminFormShell
      pageTitle="Edit Donation"
      listPath="/donation-table"
      listLabel="Donations"
      cardTitle="Edit Donation"
      description="Update the donation details below."
    >
      {loading && <AdminPageSkeleton />}
      {error && <p className="text-red-500">Error loading donation</p>}
      {!loading && !error && donation && (
        <DonationForm
          mode="edit"
          initialDonation={donation}
          onSuccess={() => {
            dispatch(getDonations());
            router.push(`/donations/${donationId}`);
          }}
        />
      )}
    </AdminFormShell>
  );
}
