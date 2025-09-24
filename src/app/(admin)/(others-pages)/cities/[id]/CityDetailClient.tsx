"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState, AppDispatch } from "@/store/redux/store";
import { fetchCityByIdThunk } from "@/store/redux/slice/citySlice";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CityView from "@/components/form/City/CityView";


function CitySkeleton() {
  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto py-6">
      <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="space-y-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
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

export default function CityDetailClient() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCity, loading, error } = useSelector(
    (state: RootState) => state.cities
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchCityByIdThunk(id as string));
    }
  }, [id, dispatch]);

  return (
    <div className="w-full mx-auto py-6">
      <PageBreadcrumb pageTitle="City Details" path="/city-table" label="Cities"/>

      {loading && <CitySkeleton />}
      {error && <p className="p-6 text-red-500">Error loading city</p>}
      {!loading && !error && selectedCity && (
        <CityView city={selectedCity} onClose={() => {}} />
      )}
    </div>
  );
}
