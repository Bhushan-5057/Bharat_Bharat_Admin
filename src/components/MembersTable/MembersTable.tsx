"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import MemberTableOne from "../tables/MemberTableOne";

export default function MembersTable() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <ComponentCard title="Members Table">
        <div className="p-4 flex justify-end">
          <Button
            onClick={() => router.push("/members/create")}
            variant="primary"
            className="flex items-center h-10 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
          >
            <Plus size={16} />
            Add Member
          </Button>
        </div>
        <MemberTableOne />
      </ComponentCard>
    </div>
  );
}
