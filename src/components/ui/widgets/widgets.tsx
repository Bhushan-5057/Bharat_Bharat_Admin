"use client";

import NewtonsCradleLoader from "@/components/common/NewtonsCradleLoader/NewtonsCradleLoader";
import { DashboardResponse } from "@/store/api/dashboardApi";
import { ArrowRight, BookOpen, BriefcaseBusiness, CalendarDays, SquareActivity } from "lucide-react";
import Link from "next/link";


type WidgetsProps = {
  data?: DashboardResponse | null;
  loading?: boolean;
};

export function Widgets({ data, loading }: WidgetsProps) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
      <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 dark:bg-black flex flex-col gap-3 w-full max-w-xs">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 dark:bg-blue-200 text-blue-600 rounded-full">
            <CalendarDays className="w-7 h-7" />
          </div>
        </div>
        <p className="text-lg font-medium text-gray-800 dark:text-white">Total Events</p>
        <div className="h-[50px] flex items-center justify-start">
          {loading ? (
            <NewtonsCradleLoader />
          ) : (
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {data?.dashboard?.integrations?.count}
            </p>
          )}
        </div>
        <Link href="/event-table" className="text-lg sm:text-sm text-blue-600 hover:underline mt-1 flex gap-2 items-center">
          View All <ArrowRight size={14} />
        </Link>
      </div>
      <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 dark:bg-black flex flex-col gap-3 w-full max-w-xs">
        <div className="flex items-center">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <SquareActivity className="w-7 h-7" />
          </div>
        </div>
        <p className="text-lg font-medium text-gray-800 dark:text-white">Total Activities</p>
        <div className="h-[50px] flex items-center justify-start">
          {loading ? (
            <NewtonsCradleLoader />
          ) : (
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {data?.dashboard?.activities?.count}
            </p>
          )}
        </div>
        <Link href="/activity-table" className="text-lg sm:text-sm text-green-600 hover:underline mt-1 flex gap-2 items-center">
          View All <ArrowRight size={14} />
        </Link>
      </div>
      <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 dark:bg-black flex flex-col gap-3 w-full max-w-xs">
        <div className="flex items-center">
          <div className="p-3 bg-teal-100 text-teal-600 rounded-full">
            <BriefcaseBusiness className="w-7 h-7" />
          </div>
        </div>
        <p className="text-lg font-medium text-gray-800 dark:text-white">Total Services</p>
        <div className="h-[50px] flex items-center justify-start">
          {loading ? (
            <NewtonsCradleLoader />
          ) : (
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {data?.dashboard?.services?.count}
            </p>
          )}
        </div>
        <Link href="/services-table" className="text-lg sm:text-sm text-teal-600 hover:underline mt-1 flex gap-2 items-center">
          View All <ArrowRight size={14} />
        </Link>
      </div>
      <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 dark:bg-black flex flex-col gap-3 w-full max-w-xs">
        <div className="flex items-center">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
            <BookOpen className="w-7 h-7" />
          </div>
        </div>
        <p className="text-lg font-medium text-gray-800 dark:text-white">Total Publications</p>
        <div className="h-[50px] flex items-center justify-start">
          {loading ? (
            <NewtonsCradleLoader />
          ) : (
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {data?.dashboard?.certificates?.count}
            </p>
          )}
        </div>
        <Link href="/publication-table" className="text-lg sm:text-sm text-indigo-600 hover:underline mt-1 flex gap-2 items-center">
          View All <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default Widgets;
