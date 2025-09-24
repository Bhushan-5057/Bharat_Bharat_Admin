"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import Button from "@/components/ui/button/Button";
import { showError, showSuccess } from "@/lib/utils/toast";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/redux/store";
import { createUserThunk, fetchAllUsersThunk } from "@/store/redux/slice/userSlice";
import { adminSchema, AdminFormData } from "@/validations/adminSchema";
import { MESSAGES } from "@/components/common/constants/utlis";

export default function AddAdminForm({ closeModal }: { closeModal?: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
  });

  const onSubmit = async (data: AdminFormData) => {
  try {
    await dispatch(createUserThunk(data)).unwrap();
    await dispatch(fetchAllUsersThunk());
    showSuccess(MESSAGES.ADD_SUCCESS);
    closeModal?.();
    reset();
  } catch (err: unknown) {
    
    if (err instanceof Error) {
      console.error("Add admin failed:", err);
      showError(err.message || MESSAGES.ADD_ERROR);
    } else {
      console.error("Add admin failed:", err);
      showError(MESSAGES.ADD_ERROR);
    }
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
     
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Enter admin name" {...register("name")} />
        {errors.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}
      </div>

      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter admin email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}
      </div>

  
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter admin password"
            {...register("password")}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeIcon className="h-5 w-5" />
            ) : (
              <EyeCloseIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-600 text-sm">{errors.password.message}</p>
        )}
      </div>

    
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-blue-600 text-white hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
