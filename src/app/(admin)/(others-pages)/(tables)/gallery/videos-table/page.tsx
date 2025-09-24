import { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import VideosTable from "@/components/VideosTable/VideosTable";

export const metadata: Metadata = {
  title: "Bharat Bharati | Videos Table",
  description: "Bharat Bharati | Gallery Dashboard - Videos Table",
};

export default function VideosTablePage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Videos" />
      <VideosTable />
    </>
  );
}
