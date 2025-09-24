"use client";
 
import NewtonsCradleLoader from "@/components/common/NewtonsCradleLoader/NewtonsCradleLoader";
import { fetchAllActivitiesThunk } from "@/store/redux/slice/activitySlice";
import { fetchAllEventsThunk } from "@/store/redux/slice/eventSlice";
import { getPublications } from "@/store/redux/slice/publicationSlice";
import { fetchAllServicesThunk } from "@/store/redux/slice/serviceSlice";
import { AppDispatch, RootState } from "@/store/redux/store";
import { ArrowRight, BookOpen, BriefcaseBusiness, CalendarDays, SquareActivity } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
 
export function Widgets() {
  const dispatch = useDispatch<AppDispatch>();
 
  const { events = [], loading, } = useSelector(
    (state: RootState) => state.events
  );
 
  const { activities = [] } = useSelector(
    (state: RootState) => state.activities
  );
 
  const { services = [] } = useSelector(
    (state: RootState) => state.service
  );
 
  const { publications=[] } = useSelector(
    (state: RootState) => state.publications
  );
 
  useEffect(() => {
    dispatch(fetchAllEventsThunk());
    dispatch(fetchAllActivitiesThunk());
    dispatch(fetchAllServicesThunk());
    dispatch(getPublications());
  }, [dispatch]);
 
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
              {events?.length || 0}
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
              {activities?.length || 0}
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
              {services?.length || 0}
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
              {publications?.length || 0}
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
 
 