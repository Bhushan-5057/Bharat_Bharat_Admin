"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import Image from "next/image";
import { AppDispatch } from "@/store/redux/store";
import { getDonationById } from "@/store/redux/slice/donationSlice";
import { Donation } from "@/store/api/donationApi";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminPageActions, { AdminPageSkeleton } from "@/components/common/AdminPageActions";
import { getMediaUrl } from "@/utils/mediaUrl";
import { Label } from "@/components/ui/label/label";

export default function DonationDetailPage() {
  const { id } = useParams();
  const donationId = String(id ?? "");
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
    <div className="w-full mx-auto py-6">
      <PageBreadcrumb pageTitle="Donation Details" path="/donation-table" label="Donations" />
      <AdminPageActions
        backHref="/donation-table"
        editHref={donationId ? `/donations/${donationId}/edit` : undefined}
        editLabel="Edit Donation"
      />
      {loading && <AdminPageSkeleton />}
      {error && <p className="p-6 text-red-500">Error loading donation</p>}
      {!loading && !error && donation && (
        <div className="space-y-6 max-w-3xl">
          {getMediaUrl(donation) ? (
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border">
              <Image src={getMediaUrl(donation)} alt="Donation" fill className="object-cover" />
            </div>
          ) : null}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-gray-500">Account Name</Label>
              <p>{donation.account_holder_name}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-gray-500">Bank</Label>
              <p>{donation.bank_name}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-gray-500">Account No</Label>
              <p>{donation.account_number}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-gray-500">IFSC Code</Label>
              <p>{donation.ifsc_code}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-gray-500">UPI ID</Label>
              <p>{donation.upi_id}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-gray-500">Created By</Label>
              <p>{donation.creator?.name || "N/A"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
