"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState, AppDispatch } from "@/store/redux/store";
import { fetchCityByIdThunk } from "@/store/redux/slice/citySlice";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CityView from "@/components/form/City/CityView";
import AdminPageActions, { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function CityDetailClient() {
  const { id } = useParams();
  const cityId = String(id ?? "");
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCity, error } = useSelector(
    (state: RootState) => state.cities
  );

  useEffect(() => {
    if (cityId) {
      dispatch(fetchCityByIdThunk(cityId));
    }
  }, [cityId, dispatch]);

  return (
    <div className="w-full mx-auto py-6">
      <PageBreadcrumb pageTitle="City Details" path="/city-table" label="Our Presence" />
      <AdminPageActions
        backHref="/city-table"
        editHref={cityId ? `/cities/${cityId}/edit` : undefined}
        editLabel="Edit City"
      />

      {!(selectedCity && String(selectedCity.id) === cityId) && !error && (
        <AdminPageSkeleton />
      )}
      {error && <p className="p-6 text-red-500">Error loading city</p>}
      {selectedCity && String(selectedCity.id) === cityId && !error && (
        <CityView city={selectedCity} onClose={() => {}} />
      )}
    </div>
  );
}
