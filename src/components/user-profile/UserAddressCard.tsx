"use client";
import React, { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  status?: "active" | "deactive" | string;
}
export default function UserAddressCard() {
 const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);


  const status = user?.status?.toLowerCase();

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Status
            </h4>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${status === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                  }`}
              >
                <span
                  className={`mr-2 h-2 w-2 rounded-full ${status === "active" ? "bg-green-500" : "bg-red-500"
                    }`}
                />
                {status === "active" ? "Active" : "Deactive"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
