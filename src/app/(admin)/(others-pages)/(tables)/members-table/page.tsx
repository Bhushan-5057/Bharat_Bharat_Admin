import { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MembersTable from "@/components/MembersTable/MembersTable";

export const metadata: Metadata = {
  title: "Bharat Bharati | Members Table",
  description: "Bharat Bharati | Dashboard - Members Table",
};

export default function MembersTablePage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Members" />
      <MembersTable />
    </>
  );
}
