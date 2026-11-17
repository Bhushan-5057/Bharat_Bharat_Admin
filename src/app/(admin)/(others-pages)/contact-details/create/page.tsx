"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/store/redux/store";
import { getContactDetailsList } from "@/store/redux/slice/contactDetailsSlice";
import AdminFormShell from "@/components/common/AdminFormShell";
import { ContactDetailsForm } from "@/components/form/ContactDetails/ContactDetailsForm";

export default function ContactDetailsCreatePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  return (
    <AdminFormShell
      pageTitle="Add Contact Details"
      listPath="/contact-details-table"
      listLabel="Contact Details"
      cardTitle="Add Contact Details"
      description="Add the phone, email and address shown on the website contact page."
    >
      <ContactDetailsForm
        mode="add"
        onSuccess={() => {
          dispatch(getContactDetailsList());
          router.push("/contact-details-table");
        }}
      />
    </AdminFormShell>
  );
}
