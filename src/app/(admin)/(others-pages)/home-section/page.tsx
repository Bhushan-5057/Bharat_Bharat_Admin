import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: "Bharat Bharati |Banner Section",
  description:
    "Bharat Bharati | Admin Dashboard - Banner Section",
};

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { FileUpload } from '@/components/ui/fileupload/file-upload'

export default function HomeSection() {
  return (
    <>
        <PageBreadcrumb pageTitle="Banner Section" path="banner-table" label="Banners"/>
         <FileUpload />
    </>
  );
}
