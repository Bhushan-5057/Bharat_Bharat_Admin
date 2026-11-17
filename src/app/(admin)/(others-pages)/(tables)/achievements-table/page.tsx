import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Bharat Bharati | Achievements Table",
  description:
    "Bharat Bharati | Achievements Dashboard - Achievements Table",

};

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AchievementTable from "@/components/AchievementTable/AchievementTable";


export default function AchievementTablePage() {
  return (
    <>
        <PageBreadcrumb pageTitle="Achievements" />
        <AchievementTable/>
    </>
  );
}
