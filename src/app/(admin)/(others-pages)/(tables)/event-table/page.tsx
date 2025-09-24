import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Bharat Bharati | Event Table",
  description:
    "Bharat Bharati | Event Dashboard - Event's Table",

};

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EventTable from "@/components/EventTable/EventTable";


export default function EventTablePage() {
  return (
    <>
        <PageBreadcrumb pageTitle="Events" />
        <EventTable />
    </>
  );
}
