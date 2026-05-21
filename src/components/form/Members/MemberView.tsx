"use client";

import React from "react";
import { Member } from "@/types/memberTypes";

interface MemberViewProps {
  member: Member;
}

export default function MemberView({ member }: MemberViewProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
        Member Details
      </h3>
      <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <p className="font-medium text-gray-800 dark:text-gray-200">Name</p>
          <p className="text-gray-600 dark:text-gray-300">{member.name}</p>
        </div>
        <div>
          <p className="font-medium text-gray-800 dark:text-gray-200">
            Category
          </p>
          <p className="text-gray-600 dark:text-gray-300">{member.category}</p>
        </div>
        <div>
          <p className="font-medium text-gray-800 dark:text-gray-200">
            Designation
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            {member.designation || "N/A"}
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-800 dark:text-gray-200">
            Created By
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            {member.creator?.name || member.created_by || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
