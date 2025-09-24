"use client";

import React from "react";
import Image from "next/image";
import { Notification } from "@/app/types/next-auth";

interface Props {
  notifications: Notification[];
}

export default function NotificationView({ notifications }: Props) {
  return (
    <div className="space-y-4 py-4 px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          All Notifications
        </h2>
      </div>

      <div className="max-h-[450px] overflow-y-auto pr-1 custom-scrollbar space-y-3">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">
            No notifications available.
          </p>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm"
            >
              <div className="flex gap-3">
                <Image
                  src={`/images/user/user-0${(item.id % 6) + 2}.jpg`}
                  alt="User"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="text-gray-800 dark:text-white text-sm font-medium">
                    {item.first_name} {item.last_name} applied for a job
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.current_location || "Unknown location"} ·{" "}
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
