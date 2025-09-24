import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Bharat Bharati | Education Table",
  description:
    "Bharat Bharati | Education Dashboard - Education Table",

};

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EducationTable from "@/components/EducationTable/EducationTable";


export default function EducationTablePage() {
  return (
    <>
        <PageBreadcrumb pageTitle="Educations" />
        <EducationTable/>
    </>
  );
}
