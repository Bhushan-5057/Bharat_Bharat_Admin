"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState, AppDispatch } from "@/store/redux/store";
import { getEducationById } from "@/store/redux/slice/educationSlice";
import EducationView from "@/components/form/Education/EducationView";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

function EducationSkeleton() {
  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto py-6">
      <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="space-y-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="h-24 w-full rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
    </div>
  );
}

export default function EducationDetailClient() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { selected, loading, error } = useSelector(
    (state: RootState) => state.education
  );

  useEffect(() => {
    if (id) {
      dispatch(getEducationById(id as string));
    }
  }, [id, dispatch]);

  return (
    <div className="w-full mx-auto py-6">
      <PageBreadcrumb pageTitle="Education Details" path="/education-table" label="Educations"/>

      {loading && <EducationSkeleton />}
      {error && <p className="p-6 text-red-500">Error loading education</p>}
      {!loading && !error && selected && (
        <EducationView education={selected} onClose={() => { }} />
      )}
    </div>
  );
}
