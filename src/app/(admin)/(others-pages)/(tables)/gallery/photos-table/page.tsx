import { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PhotosTable from "@/components/PhotosTable/PhotosTable";

export const metadata: Metadata = {
  title: "Bharat Bharati | Photos Table",
  description: "Bharat Bharati | Gallery Dashboard - Photos Table",
};

export default function PhotosTablePage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Photos" />
      <PhotosTable />
    </>
  );
}
