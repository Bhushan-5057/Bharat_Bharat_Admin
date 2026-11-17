"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/redux/store";
import { showApiError, showSuccess } from "@/lib/utils/toast";
import {
  addContactDetails,
  editContactDetails,
  getContactDetailsList,
} from "@/store/redux/slice/contactDetailsSlice";
import { ContactDetails } from "@/store/api/contactDetailsApi";
import { Input } from "@/components/ui/input/input";
import { FormField } from "@/components/ui/form-field";
import Button from "@/components/ui/button/Button";
import { Textarea } from "@/components/ui/textarea/textarea";

interface ContactDetailsFormProps {
  initialData?: ContactDetails;
  mode?: "add" | "edit";
  onSuccess?: () => void;
}

export const ContactDetailsForm: React.FC<ContactDetailsFormProps> = ({
  initialData,
  mode = "add",
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialData) return;
    setPhone(initialData.phone || "");
    setEmail(initialData.email || "");
    setAddress(initialData.address || "");
  }, [initialData]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!phone.trim() || !email.trim() || !address.trim()) {
      setError("Phone, email and address are required.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
      };

      const resultAction =
        mode === "edit" && initialData?.id
          ? await dispatch(
              editContactDetails({ id: String(initialData.id), payload })
            )
          : await dispatch(addContactDetails(payload));

      if (resultAction.meta.requestStatus === "fulfilled") {
        showSuccess(
          mode === "edit"
            ? "Contact details updated successfully"
            : "Contact details created successfully"
        );
        dispatch(getContactDetailsList());
        onSuccess?.();
      } else {
        showApiError(resultAction.payload, "Operation failed");
      }
    } catch (err) {
      showApiError(err, "Failed to save contact details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-lg space-y-4 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 max-h-[70vh]"
    >
      <FormField label="Phone" htmlFor="phone" required>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
        />
      </FormField>
      <FormField label="Email" htmlFor="email" required>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
      </FormField>
      <FormField label="Address" htmlFor="address" required>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter office address"
          rows={4}
        />
      </FormField>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
};
