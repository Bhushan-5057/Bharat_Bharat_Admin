"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store/redux/store";
import { fetchCityByIdThunk } from "@/store/redux/slice/citySlice";
import EditCityForm from "@/components/form/City/EditCityForm";
import AdminFormShell from "@/components/common/AdminFormShell";
import { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function CityEditPage() {
  const { id } = useParams();
  const cityId = String(id ?? "");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCity, error } = useSelector(
    (state: RootState) => state.cities
  );

  useEffect(() => {
    if (cityId) {
      dispatch(fetchCityByIdThunk(cityId));
    }
  }, [cityId, dispatch]);

  const goDetail = () => router.push(`/cities/${cityId}`);

  return (
    <AdminFormShell
      pageTitle="Edit City"
      listPath="/city-table"
      listLabel="Our Presence"
      cardTitle="Edit City"
      description="Update the city details below."
    >
      {!(selectedCity && String(selectedCity.id) === cityId) && !error && (
        <AdminPageSkeleton />
      )}
      {error && <p className="text-red-500">Error loading city</p>}
      {selectedCity && String(selectedCity.id) === cityId && !error && (
        <EditCityForm key={cityId} city={selectedCity} closeModal={goDetail} />
      )}
    </AdminFormShell>
  );
}
