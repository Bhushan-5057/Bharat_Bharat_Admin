"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/redux/store";
import { fetchAllUsersThunk, updateUserThunk } from "@/store/redux/slice/userSlice";
import { Input } from "@/components/ui/input/input";
import Button from "@/components/ui/button/Button";
import { showError, showSuccess } from "@/lib/utils/toast";
import { Eye, EyeOff } from "lucide-react";
import { adminUpdateSchema, AdminUpdateFormData } from "@/validations/adminSchema";
import { MESSAGES } from "@/components/common/constants/utlis";

interface UpdateAdminProps {
  admin: {
    id: string;
    name: string;
    email: string;
    password?: string;
  };
  onClose: () => void;
}

interface UpdateUserPayload {
  id: string;
  name: string;
  password?: string;
}

export default function UpdateAdmin({ admin, onClose }: UpdateAdminProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminUpdateFormData>({
    resolver: zodResolver(adminUpdateSchema),
    defaultValues: {
      name: admin?.name || "",
      password: "",
    },
  });

  useEffect(() => {
    if (admin) {
      reset({
        name: admin.name,
        password: "",
      });
    }
  }, [admin, reset]);

  const onSubmit = async (data: AdminUpdateFormData) => {
    if (!admin) return;
    setLoading(true);

    try {
      const payload: UpdateUserPayload = {
        id: admin.id,
        name: data.name,
      };

      if (data.password) {
        payload.password = data.password;
      }

      await dispatch(updateUserThunk(payload)).unwrap();
      await dispatch(fetchAllUsersThunk());
      showSuccess(MESSAGES.EDIT_SUCCESS);
      reset({ name: data.name, password: "" });
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        showError(err.message || MESSAGES.EDIT_ERROR);
      } else {
        showError(MESSAGES.EDIT_ERROR);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!admin) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input {...register("name")} placeholder="Enter admin name" />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input value={admin.email} placeholder="Enter admin email" disabled readOnly />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Enter new password"
          />
          <button
            type="button"
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        <p className="text-xs text-gray-500 mt-1">
          Leave blank if you don&apos;t want to change it
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 text-white hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </div>
    </form>
  );
}
