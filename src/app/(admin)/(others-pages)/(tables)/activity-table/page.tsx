import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Bharat Bharati | Activity Table",
  description:
    "Bharat Bharati | Activity Dashboard - Activities Table", 

};

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ActivityTable from "@/components/ActivityTable/ActivityTable";


export default function EventTablePage() {
  return (
    <>
        <PageBreadcrumb pageTitle="Activities" />
        <ActivityTable />
    </>
  );
}
