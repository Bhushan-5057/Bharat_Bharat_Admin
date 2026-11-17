import { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ContactDetailsTable from "@/components/ContactDetailsTable/ContactDetailsTable";

export const metadata: Metadata = {
  title: "Bharat Bharati | Contact Details",
  description: "Bharat Bharati | Dashboard - Contact Details",
};

export default function ContactDetailsTablePage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Contact Details" />
      <ContactDetailsTable />
    </>
  );
}
