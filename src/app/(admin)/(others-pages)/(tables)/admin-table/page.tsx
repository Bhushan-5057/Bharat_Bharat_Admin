import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Bharat Bharati | Admin Table",
  description:
    "Bharat Bharati | Admin Dashboard - Admin Table",

};

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminTable from "@/components/AdminTable/AdminTable";

export default function AdminTablePage() {
  return (
    <>
        <PageBreadcrumb pageTitle="Admin" />
        <AdminTable />
    </>
  );
}
