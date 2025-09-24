import { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DonationTable from "@/components/DonationTable/DonationTable";

export const metadata: Metadata = {
  title: "Bharat Bharati | Donation Table",
  description: "Bharat Bharati | Dashboard - Donation Table",
};

export default function DonationTablePage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Donation" />
      <DonationTable />
    </>
  );
}
