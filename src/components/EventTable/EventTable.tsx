'use client'
import { useModal } from "@/hooks/useModal";
import React, { useEffect } from "react";

import ComponentCard from "@/components/common/ComponentCard";

import Button from "@/components/ui/button/Button";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import EventTableOne from "../tables/EventTableOne";
import AddEventForm from "../form/event/AddEventForm";


export default function EventTable() {
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
        <ComponentCard title="Event's  Table ">
          <div className="p-4 flex justify-end">
            <Button
              onClick={openModal}
              variant="primary"
              className="flex items-center  
       h-10  hover:bg-gray-400   dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"

            >
              <Plus size={16} />
              Add Event
            </Button>
          </div>
          <EventTableOne />
        </ComponentCard>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Add New Event
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Fill in the details below to add a new Event to the database.
            </p>
          </div>
          <AddEventForm closeModal={closeModal} />
        </div>
      </Modal>
    </div>
  )
}