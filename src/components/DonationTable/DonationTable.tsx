"use client";
import React from "react";
import { useModal } from "@/hooks/useModal";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import DonationTableOne from "../tables/DonationTableOne";
import { DonationForm } from "../form/DonationForm/DonationForm";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/redux/store";
import { getDonations } from "@/store/redux/slice/donationSlice";



export default function DonationTable() {
  const { isOpen, openModal, closeModal } = useModal();
    const dispatch = useDispatch<AppDispatch>();

  const donations = useSelector(
    (state: RootState) => state.donation.donations || []
  );
  
  return (
    <div className="space-y-6">
      <ComponentCard title="Donation Table">
         {donations.length === 0 && (
          <div className="p-4 flex justify-end">
            <Button
              onClick={openModal}
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
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add New Donation
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Fill in the details to add a new donation record.
            </p>
          </div>
            <DonationForm
            onSuccess={async () => {
              closeModal();
              await dispatch(getDonations()); 
            }}
          />
        </div>
      </Modal>
    </div>
  );
}
