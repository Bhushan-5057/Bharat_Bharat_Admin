import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Bharat Bharati | City Table",
    description:
        "Bharat Bharati | Activity Dashboard - Cities Table",

};

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CityTable from "@/components/CityTable/CityTable";


export default function EventTablePage() {
    return (
        <>
            <PageBreadcrumb pageTitle="Cities" />
            <CityTable />
        </>
    );
}
