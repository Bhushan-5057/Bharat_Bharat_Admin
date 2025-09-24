import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IMGAGES } from "@/components/common/constants/utlis";

interface Admin {
  id: string;
  name: string;
  email: string;
  status: string;
  password?: string;
  profilePicture?: string; 
  created_by?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  admin: Admin | null;
}

export default function AdminView({ open, onClose, admin }: Props) {
  const [displayImage, setDisplayImage] = useState<string>(IMGAGES.PROFILE);

  useEffect(() => {
    if (admin && !admin.profilePicture) {
      const profileImages = [IMGAGES.PROFILE, IMGAGES.PROFILE1];
      const randomIndex = Math.floor(Math.random() * profileImages.length);
      setDisplayImage(profileImages[randomIndex]);
    } else if (admin?.profilePicture) {
      setDisplayImage(admin.profilePicture);
    }
  }, [admin]);

  if (!open || !admin) return null;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-4">
        <Image
          src={displayImage}
          alt={admin.name}
          width={80}
          height={80}
          className="rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-gray-800 dark:text-white">{admin.name}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-gray-800 dark:text-white">Email:</span>{" "}
          {admin.email}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-gray-800 dark:text-white">Created by:</span>{" "}
          {admin.created_by || "System"}
        </p>
      </div>

      {/* Close Button */}
      <div className="pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm font-medium text-gray-800 dark:text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
