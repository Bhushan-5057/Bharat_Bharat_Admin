'use client'
import React from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { Plus } from "lucide-react";
import AdminTableOne from "../tables/AdminTableOne";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";

export default function AdminTable() {
  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isSuperAdmin = currentUser?.role === "super_admin";

  return (
    <div>
      <div className="space-y-6">
        <ComponentCard title="Admin's  Table ">
          {isSuperAdmin && (
            <div className="p-4 flex justify-end">
              <Button
                onClick={() => router.push("/admins/create")}
                variant="primary"
                className="flex items-center h-10 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
              >
                <Plus size={16} />
                Add Admin
              </Button>
            </div>
          )}
          <AdminTableOne />
        </ComponentCard>
      </div>
    </div>
  )
}
