import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IMGAGES } from "@/components/common/constants/utlis";
import { useSelector } from "react-redux";
import { RootState } from "@/store/redux/store";

interface Admin {
  id: string;
  name: string;
  email: string;
  role?: string;
  password?: string;
  profilePicture?: string; 
  created_by?: string | number | { id?: string | number; name?: string };
  creator?: {
    name?: string;
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  admin: Admin | null;
}

export default function AdminView({ open, onClose, admin }: Props) {
  const [displayImage, setDisplayImage] = useState<string>(IMGAGES.PROFILE);
  const users = useSelector((state: RootState) => state.user.users);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const roleLabel =
    admin?.role === "super_admin"
      ? "Super Admin"
      : admin?.role === "admin"
        ? "Admin"
        : admin?.role || "-";
  const getCreatedByLabel = () => {
    if (admin?.creator?.name) return admin.creator.name;

    if (
      typeof admin?.created_by === "object" &&
      admin.created_by !== null &&
      "name" in admin.created_by
    ) {
      return admin.created_by.name || "N/A";
    }

    const creatorId = admin?.created_by?.toString();

    if (!creatorId || creatorId === "system") return "System";
    if (creatorId === currentUser?.id?.toString()) return currentUser.name;

    const creator = users.find((user) => user.id?.toString() === creatorId);

    return creator?.name || creatorId;
  };
  const createdByLabel = getCreatedByLabel();

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
          <span className="font-semibold text-gray-800 dark:text-white">Role:</span>{" "}
          {roleLabel}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-gray-800 dark:text-white">Created by:</span>{" "}
          {createdByLabel}
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
