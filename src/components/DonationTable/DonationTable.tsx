"use client";
import React from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Plus } from "lucide-react";
import DonationTableOne from "../tables/DonationTableOne";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";

export default function DonationTable() {
  const router = useRouter();
  const donations = useSelector(
    (state: RootState) => state.donation.donations || []
  );

  return (
    <div className="space-y-6">
      <ComponentCard title="Donation Table">
         {donations.length === 0 && (
          <div className="p-4 flex justify-end">
            <Button
              onClick={() => router.push("/donations/create")}
              variant="primary"
              className="flex items-center h-10 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            >
              <Plus size={16} />
              Add Donation
            </Button>
          </div>
        )}
        <DonationTableOne  />
      </ComponentCard>
    </div>
  );
}
