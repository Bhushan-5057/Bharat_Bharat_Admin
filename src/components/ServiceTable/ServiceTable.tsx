'use client'
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Plus } from "lucide-react";
import ServiceTableOne from "../tables/ServiceTableOne";

export default function ServiceTable() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.key === "+" && !e.ctrlKey && !e.altKey) || e.code === "NumpadAdd") {
        e.preventDefault();
        router.push("/services/create");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [router]);

  return (
    <div>
      <div className="space-y-6">
        <ComponentCard title="Service's  Table ">
          <div className="p-4 flex justify-end">
            <Button
              onClick={() => router.push("/services/create")}
              variant="primary"
              className="flex items-center h-10 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            >
              <Plus size={16} />
              Add Service
            </Button>
          </div>
          <ServiceTableOne />
        </ComponentCard>
      </div>
    </div>
  )
}
