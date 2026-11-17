'use client'
import React, { useEffect } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import BannerTableOne from "../tables/BannerTableOne";

export default function BannerTable() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "+" || e.code === "NumpadAdd") {
        router.push("/home-section");
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
        <ComponentCard title="Banner's  Table ">
          <div className="p-4 flex justify-end">
            <Button
              onClick={() => router.push('/home-section')}
              variant="primary"
              className="flex items-center h-10 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            >
              <Plus size={16} />
              Add Banner
            </Button>
          </div>
          <BannerTableOne />
        </ComponentCard>
      </div>
    </div>
  )
}
