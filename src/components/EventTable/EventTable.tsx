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
          <div className="p-2 flex justify-end">
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
      <Modal isOpen={isOpen} onClose={closeModal} className="m-2 w-[calc(100vw-1rem)] max-w-[720px] sm:m-4 sm:w-[calc(100vw-2rem)]">
        <div className="no-scrollbar relative w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-4 dark:bg-gray-900 sm:rounded-3xl sm:p-6 lg:p-8">
          <div className="px-1 sm:px-2 sm:pr-14">
            <h4 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white/90 sm:text-2xl">
              Add New Event
            </h4>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400 sm:mb-6 lg:mb-7">
              Fill in the details below to add a new Event to the database.
            </p>
          </div>
          <AddEventForm closeModal={closeModal} />
        </div>
      </Modal>
    </div>
  )
}
