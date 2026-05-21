
"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/redux/store";
import { showError, showSuccess } from "@/lib/utils/toast";
import { MESSAGES } from "@/components/common/constants/utlis";
import { addDonation, editDonation, getDonations } from "@/store/redux/slice/donationSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { DonationFormData, donationSchema } from "@/validations/donationSchema";


interface DonationFormProps {
  initialDonation?: {
    id: string;
    account_holder_name: string;
    account_number: string;
    bank_name: string;
    ifsc_code: string;
    upi_id: string;
    file_name?: string;
    data?: string;
    creator?: { id: number; name: string };
  };
  mode?: "add" | "edit";
  onSuccess?: () => void;
}

export const DonationForm: React.FC<DonationFormProps> = ({
  initialDonation,
  mode = "add",
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema(mode)),
    defaultValues: {
      accountHolder: initialDonation?.account_holder_name || "",
      accountNo: initialDonation?.account_number || "",
      bankName: initialDonation?.bank_name || "",
      ifscCode: initialDonation?.ifsc_code || "",
      upiId: initialDonation?.upi_id || "",
    },
  });
  const [preview, setPreview] = useState<string | null>(
    initialDonation?.data
      ? initialDonation.data.startsWith("data:image")
        ? initialDonation.data
        : `data:image/jpeg;base64,${initialDonation.data}`
      : null
  );

  useEffect(() => {
    if (initialDonation) {
      setValue("accountHolder", initialDonation.account_holder_name);
      setValue("accountNo", initialDonation.account_number);
      setValue("bankName", initialDonation.bank_name);
      setValue("ifscCode", initialDonation.ifsc_code);
      setValue("upiId", initialDonation.upi_id);
    }
  }, [initialDonation, setValue]);

  const watchFile = watch("imageFile");
  useEffect(() => {
    if (watchFile && watchFile.length > 0) {
      setPreview(URL.createObjectURL(watchFile[0]));
    } else if (initialDonation?.data) {
      setPreview(
        initialDonation.data.startsWith("data:image")
          ? initialDonation.data
          : `data:image/jpeg;base64,${initialDonation.data}`
      );
    }
  }, [watchFile, initialDonation]);


  const onSubmit = async (data: DonationFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("account_holder_name", data.accountHolder.trim());
      formData.append("account_number", data.accountNo.trim());
      formData.append("bank_name", data.bankName.trim());
      formData.append("ifsc_code",  data.ifscCode.trim().toUpperCase());
      formData.append("upi_id", data.upiId.trim().toLowerCase());

      if (data.imageFile && data.imageFile.length > 0) {
        formData.append("file_name", data.imageFile[0]);
      }
      let resultAction;
      if (mode === "edit" && initialDonation?.id) {
        resultAction = await dispatch(editDonation({ id: initialDonation.id, payload: formData }));
      } else {
        resultAction = await dispatch(addDonation(formData));
      }

      if (resultAction.meta.requestStatus === "fulfilled") {
        showSuccess(
          mode === "edit"
            ? MESSAGES.EDIT_SUCCESS || "Donation updated successfully"
            : MESSAGES.ADD_SUCCESS || "Donation created successfully"
        );
        dispatch(getDonations());
        onSuccess?.();
      } else {
        showError((resultAction.payload as string) || "Operation failed");
      }
    } catch (err) {
      console.error("Donation save failed", err);
      showError("Failed to save donation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        max-w-sm mx-auto
        bg-white dark:bg-neutral-900
        shadow-md rounded-2xl p-6 space-y-6
        max-h-[60vh] md:max-h-[70vh]
        overflow-y-auto
        custome-scroll
      "
    >
      <div className="flex flex-col">
        <label className="mb-2 font-medium">Account Holder Name</label>
        <input
          type="text"
          {...register("accountHolder")}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-neutral-800 dark:border-neutral-700"
        />
        {errors.accountHolder && (
          <span className="text-red-500 text-sm mt-1">{errors.accountHolder.message}</span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="mb-2 font-medium">Account Number</label>
        <input
          type="text"
          {...register("accountNo")}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-neutral-800 dark:border-neutral-700"
        />
        {errors.accountNo && <span className="text-red-500 text-sm mt-1">{errors.accountNo.message}</span>}
      </div>
      <div className="flex flex-col">
        <label className="mb-2 font-medium">Bank Name</label>
        <input
          type="text"
          {...register("bankName")}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-neutral-800 dark:border-neutral-700"
        />
        {errors.bankName && (
          <span className="text-red-500 text-sm mt-1">{errors.bankName.message}</span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="mb-2 font-medium">IFSC Code</label>
        <input
          type="text"
          {...register("ifscCode")}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-neutral-800 dark:border-neutral-700"
        />
        {errors.ifscCode && <span className="text-red-500 text-sm mt-1">{errors.ifscCode.message}</span>}
      </div>
      <div className="flex flex-col">
        <label className="mb-2 font-medium">UPI ID</label>
        <input
          type="text"
          {...register("upiId")}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-neutral-800 dark:border-neutral-700"
        />
        {errors.upiId && <span className="text-red-500 text-sm mt-1">{errors.upiId.message}</span>}
      </div>
      <div className="flex flex-col">
        <label className="mb-2 font-medium">Upload Image</label>
        {preview && (
          <div className="mb-2 relative w-max">
            <Image
              src={preview}
              alt="Donation"
              width={96}
              height={96}
              className="object-cover rounded-md border"
            />

            <button
              type="button"
              onClick={() => {
                setPreview(null);
                setValue("imageFile", undefined, { shouldValidate: true });

                const fileInput = document.getElementById("donationFileInput") as HTMLInputElement;
                if (fileInput) {
                  fileInput.value = "";
                  fileInput.click();
                }
              }}
              className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm hover:bg-red-700"
            >
              ×
            </button>

          </div>
        )}
        <input type="file" accept="image/*" {...register("imageFile")} id="donationFileInput" />
        {errors.imageFile && (
          <span className="text-red-500 text-sm mt-1">
            {errors.imageFile.message as string}
          </span>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-md shadow-md"
      >
        {loading ? "Saving..." : mode === "edit" ? "Update Donation" : "Create Donation"}
      </button>
    </form>
  );
};
