'use client'
import React, { useEffect } from "react";

import ComponentCard from "@/components/common/ComponentCard";

import Button from "@/components/ui/button/Button";
import { Plus } from "lucide-react";
import OfficeBearerTableOne from "../tables/OfficeBearerTableOne";
import { useRouter } from "next/navigation";


export default function OfficeBearerTable() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {

      if (e.key === "+" || e.code === "NumpadAdd") {
        router.push("/office-bearers/add-new");
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
        <ComponentCard title="Bearer's  Table ">
          <div className="p-4 flex justify-end">
            <Button
              onClick={() => router.push("/office-bearers/add-new")}
              variant="primary"
              className="flex items-center  
       h-10  hover:bg-gray-400   dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"

            >
              <Plus size={16} />
              Add Bearer
            </Button>
          </div>
          <OfficeBearerTableOne />
        </ComponentCard>
      </div>
    </div>
  )
}