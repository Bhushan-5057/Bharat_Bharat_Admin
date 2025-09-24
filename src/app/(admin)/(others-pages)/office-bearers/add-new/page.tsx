"use client";

import React from "react";
import AddBearerForm from "@/components/form/OfficeBearer/AddBearerForm";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function AddBearerPage() {
  return (<>
      <PageBreadcrumb pageTitle="Add New Office Bearer" path="/bearer-table" label="Bearers" />
    <div className="p-6 max-w-4xl mx-auto">
      <ComponentCard title="Add New Office Bearer">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Add New Bearer
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Fill in the details below to add a new Bearer to the database.
          </p>
        </div>
        <AddBearerForm />
      </ComponentCard>
    </div>
    </>
  );
}
