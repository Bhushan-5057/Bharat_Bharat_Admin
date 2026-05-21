"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppDispatch } from "@/store/redux/store";
import { MESSAGES } from "@/components/common/constants/utlis";
import { showSuccess } from "@/lib/utils/toast";
import { MEMBER_CATEGORIES, Member, MemberPayload } from "@/types/memberTypes";
import { MemberFormData, memberSchema } from "@/validations/memberSchema";
import { addMember, editMember } from "@/store/redux/slice/memberSlice";

interface MemberFormProps {
  initialMember?: Member;
  mode?: "add" | "edit";
  onSuccess?: () => void;
}

export const MemberForm: React.FC<MemberFormProps> = ({
  initialMember,
  mode = "add",
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: initialMember?.name || "",
      category:
        initialMember?.category === "national core commitee"
          ? "national core commitee"
          : "national excutive council",
      designation: initialMember?.designation || "",
    },
  });

  const selectedCategory = watch("category");

  useEffect(() => {
    if (!initialMember) return;

    setValue("name", initialMember.name || "");
    setValue(
      "category",
      initialMember.category === "national core commitee"
        ? "national core commitee"
        : "national excutive council"
    );
    setValue("designation", initialMember.designation || "");
  }, [initialMember, setValue]);

  useEffect(() => {
    if (selectedCategory !== "national core commitee") {
      setValue("designation", "", { shouldValidate: true });
    }
  }, [selectedCategory, setValue]);

  const onSubmit = async (data: MemberFormData) => {
    setLoading(true);

    try {
      const payload: MemberPayload = {
        name: data.name.trim(),
        category: data.category,
      };

      if (data.category === "national core commitee") {
        payload.designation = data.designation?.trim();
      }

      const resultAction =
        mode === "edit" && initialMember?.id
          ? await dispatch(editMember({ id: initialMember.id, payload }))
          : await dispatch(addMember(payload));

      if (resultAction.meta.requestStatus === "fulfilled") {
        showSuccess(
          mode === "edit"
            ? MESSAGES.EDIT_SUCCESS || "Member updated successfully"
            : MESSAGES.ADD_SUCCESS || "Member created successfully"
        );
        onSuccess?.();
      } else {
        setError("name", {
          type: "server",
          message: (resultAction.payload as string) || "Operation failed",
        });
      }
    } catch (err) {
      console.error("Member save failed", err);
      setError("name", {
        type: "server",
        message: "Failed to save member",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-sm mx-auto bg-white dark:bg-neutral-900 shadow-md rounded-2xl p-6 space-y-5 max-h-[65vh] overflow-y-auto custome-scroll"
    >
      <div className="flex flex-col">
        <label className="mb-2 font-medium text-gray-800 dark:text-white">
          Name
        </label>
        <input
          type="text"
          {...register("name")}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
        />
        {errors.name && (
          <span className="text-red-500 text-sm mt-1">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <label className="mb-2 font-medium text-gray-800 dark:text-white">
          Category
        </label>
        <select
          {...register("category")}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
        >
          {MEMBER_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <span className="text-red-500 text-sm mt-1">
            {errors.category.message}
          </span>
        )}
      </div>

      {selectedCategory === "national core commitee" && (
        <div className="flex flex-col">
          <label className="mb-2 font-medium text-gray-800 dark:text-white">
            Designation
          </label>
          <input
            type="text"
            {...register("designation")}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
          />
          {errors.designation && (
            <span className="text-red-500 text-sm mt-1">
              {errors.designation.message}
            </span>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-md disabled:opacity-50"
      >
        {loading ? "Saving..." : mode === "edit" ? "Update Member" : "Create Member"}
      </button>
    </form>
  );
};
