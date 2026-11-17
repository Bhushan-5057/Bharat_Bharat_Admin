
"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/redux/store";
import { showApiError, showSuccess } from "@/lib/utils/toast";
import { MESSAGES } from "@/components/common/constants/utlis";
import { addDonation, editDonation, getDonations } from "@/store/redux/slice/donationSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { DonationFormData, donationSchema } from "@/validations/donationSchema";
import { getMediaUrl } from "@/utils/mediaUrl";
import { Input } from "@/components/ui/input/input";
import { FormField } from "@/components/ui/form-field";
import Button from "@/components/ui/button/Button";


interface DonationFormProps {
  initialDonation?: {
    id: string;
    account_holder_name: string;
    account_number: string;
    bank_name: string;
    ifsc_code: string;
    upi_id: string;
    file_name?: string;
    url?: string | null;
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
    getMediaUrl(initialDonation) || null
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
    } else if (getMediaUrl(initialDonation)) {
      setPreview(getMediaUrl(initialDonation));
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
        showApiError(resultAction.payload, "Operation failed");
      }
    } catch (err) {
      console.error("Donation save failed", err);
      showApiError(err, "Failed to save donation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-lg space-y-4 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 max-h-[70vh]"
    >
      <FormField label="Account holder name" htmlFor="accountHolder" required error={errors.accountHolder?.message}>
        <Input id="accountHolder" placeholder="Enter account holder name" {...register("accountHolder")} />
      </FormField>
      <FormField label="Account number" htmlFor="accountNo" required error={errors.accountNo?.message}>
        <Input id="accountNo" placeholder="Enter account number" {...register("accountNo")} />
      </FormField>
      <FormField label="Bank name" htmlFor="bankName" required error={errors.bankName?.message}>
        <Input id="bankName" placeholder="Enter bank name" {...register("bankName")} />
      </FormField>
      <FormField label="IFSC code" htmlFor="ifscCode" required error={errors.ifscCode?.message}>
        <Input id="ifscCode" placeholder="Enter IFSC code" {...register("ifscCode")} />
      </FormField>
      <FormField label="UPI ID" htmlFor="upiId" error={errors.upiId?.message}>
        <Input id="upiId" placeholder="Enter UPI ID" {...register("upiId")} />
      </FormField>
      <FormField
        label="QR / payment image"
        htmlFor="donationFileInput"
        error={errors.imageFile?.message ? String(errors.imageFile.message) : undefined}
      >
        {preview ? (
          <div className="mb-2 relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200">
            <Image
              src={preview}
              alt="Donation"
              fill
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                setValue("imageFile", undefined, { shouldValidate: true });
                const fileInput = document.getElementById("donationFileInput") as HTMLInputElement;
                if (fileInput) {
                  fileInput.value = "";
                }
              }}
              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-sm text-white hover:bg-red-700"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ) : (
          <p className="text-xs text-gray-500">No image uploaded</p>
        )}
        <Input type="file" accept="image/*" {...register("imageFile")} id="donationFileInput" />
      </FormField>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : mode === "edit" ? "Save" : "Save"}
      </Button>
    </form>
  );
};
