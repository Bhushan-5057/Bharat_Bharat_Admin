import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Bharat Bharati | Service Table",
  description:
    "Bharat Bharati | Service Dashboard - Service's Table",

};

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ServiceTable from "@/components/ServiceTable/ServiceTable";

export default function ServiceTablePage() {
  return (
    <>
        <PageBreadcrumb pageTitle="Services" />
        <ServiceTable />
    </>
  );
}
