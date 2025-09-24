"use client"
import OverviewSection from "@/components/overview/overview-section";
import Widgets from "@/components/ui/widgets/widgets";
import { fetchDashboardThunk } from "@/store/redux/slice/dashboardSlice";
import { AppDispatch, RootState } from "@/store/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser) as User);
    }
  }, []);

  const { data, loading } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardThunk());
  }, [dispatch]);


  return (
    <div className='p-6 space-x-4'>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {user ? (
              <>
                Welcome back, <b>{user.name}</b>! Here&#39;s what&#39;s happening today. <br />
              </>
            ) : (
              <>Welcome back, Guest!</>
            )}
          </p>
        </div>
      </div>
      <div className='mt-2'>
        <Widgets data={data} loading={loading} />
      </div>
      <div>
        <OverviewSection />
      </div>
    </div>
  );
}
