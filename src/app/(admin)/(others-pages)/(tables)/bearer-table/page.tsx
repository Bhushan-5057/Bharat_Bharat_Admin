import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Bharat Bharati | Office Bearer Table",
  description:
    "Bharat Bharati | Admin Dashboard - Office Bearer Table",

};

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import OfficeBearerTable from "@/components/OfficeBearerTable/OfficeBearerTable";

export default function OfficeBearerTablePage() {
  return (
    <>
        <PageBreadcrumb pageTitle="Office Bearer" />
        <OfficeBearerTable />
    </>
  );
}
