'use client'
import { useModal } from "@/hooks/useModal";
import React, { useEffect } from "react";

import ComponentCard from "@/components/common/ComponentCard";

import Button from "@/components/ui/button/Button";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import ActivityTableOne from "../tables/ActivityTableOne";
import AddActivityForm from "../form/Activity/AddActivityForm";


export default function ActivityTable() {
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.key === "+" && !e.ctrlKey && !e.altKey) || e.code === "NumpadAdd") {
        e.preventDefault();
        openModal();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [openModal]);

  return (
    <div>
      <div className="space-y-6">
        <ComponentCard title="Activities Table ">
          <div className="p-4 flex justify-end">
            <Button
              onClick={openModal}
              variant="primary"
              className="flex items-center  
       h-10  hover:bg-gray-400   dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"

            >
              <Plus size={16} />
              Add Activity
            </Button>
          </div>
          <ActivityTableOne />
        </ComponentCard>
      </div>
     <Modal
  isOpen={isOpen}
  onClose={closeModal}
  className="
    w-full
    max-w-[95%]
    sm:max-w-[90%]
    md:max-w-175
    lg:max-w-212.5
    xl:max-w-225
    mx-auto
    mt-10
    sm:mt-14
    md:mt-20
    lg:mt-24
    px-2
  "
>
  <div
    className="
      no-scrollbar
      relative
      w-full
      overflow-y-auto
      rounded-2xl
      bg-white
      dark:bg-gray-900
      p-4
      sm:p-6
      md:p-8
      lg:p-10
      max-h-[90vh]
    "
  >
    <div className="px-1 sm:px-2 pr-10">
      <h4 className="mb-2 text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white/90">
        Add New Activity
      </h4>

      <p className="mb-5 text-sm text-gray-500 dark:text-gray-400 sm:mb-6">
        Fill in the details below to add a new Activity to the database.
      </p>
    </div>

    <AddActivityForm closeModal={closeModal} />
  </div>
</Modal>
    </div>
  )
}
