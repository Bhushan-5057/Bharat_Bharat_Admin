"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { AppDispatch } from "@/store/redux/store";
import {
  getContactDetailsById,
  getContactDetailsList,
} from "@/store/redux/slice/contactDetailsSlice";
import { ContactDetails } from "@/store/api/contactDetailsApi";
import { ContactDetailsForm } from "@/components/form/ContactDetails/ContactDetailsForm";
import AdminFormShell from "@/components/common/AdminFormShell";
import { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function ContactDetailsEditPage() {
  const { id } = useParams();
  const contactId = String(id ?? "");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!contactId) return;
    setLoading(true);
    dispatch(getContactDetailsById(contactId))
      .unwrap()
      .then(setContactDetails)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [contactId, dispatch]);

  return (
    <AdminFormShell
      pageTitle="Edit Contact Details"
      listPath="/contact-details-table"
      listLabel="Contact Details"
      cardTitle="Edit Contact Details"
      description="Update the phone, email and address shown on the website."
    >
      {loading && <AdminPageSkeleton />}
      {error && <p className="text-red-500">Error loading contact details</p>}
      {!loading && !error && contactDetails && (
        <ContactDetailsForm
          mode="edit"
          initialData={contactDetails}
          onSuccess={() => {
            dispatch(getContactDetailsList());
            router.push("/contact-details-table");
          }}
        />
      )}
    </AdminFormShell>
  );
}
