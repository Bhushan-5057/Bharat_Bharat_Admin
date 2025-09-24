"use client"
import OverviewSection from "@/components/overview/overview-section";
import Widgets from "@/components/ui/widgets/widgets";

import { useEffect, useState } from "react";
 
 
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}
 
export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
 
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser) as User);
    }
  }, []);
 
 
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
        <Widgets />
      </div>
      <div>
        <OverviewSection />
      </div>
    </div>
  );
}
 
 