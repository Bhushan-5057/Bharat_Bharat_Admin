import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Bharat Bharati | Banner Table",
  description:
    "Bharat Bharati | Admin Dashboard - Banner Table",

};

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BannerTable from "@/components/BannerTable/BannerTable";

export default function BannerTablePage() {
  return (
    <>
        <PageBreadcrumb pageTitle="Banners" />
        <BannerTable />
    </>
  );
}
