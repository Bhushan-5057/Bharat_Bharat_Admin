import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Bharat Bharati |  Blogs Table",
  description:
    "Bharat Bharati | Admin Dashboard - Office Blogs Table",

};

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BlogsTable from "@/components/BlogsTable/BlogsTable";

export default function BlogTablePage() {
  return (
    <>
        <PageBreadcrumb pageTitle="Blogs" />
        <BlogsTable/>
    </>
  );
}
