import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Bharat Bharati | Publication Table",
  description: "Bharat Bharati | Admin Dashboard - Publication Table",
};

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PublicationTable from "@/components/PublicationTable/PublicationTable";

export default function PublicationTablePage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Publications" />
      <PublicationTable />
    </>
  );
}
