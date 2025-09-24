"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/redux/store";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { getAppointments, viewAppointment } from "@/store/redux/slice/appointmentSlice";
import { Bell } from "lucide-react";
import Image from "next/image";
import { Appointment } from "@/store/api/appointmentApi";
import { avatars } from "../common/constants/utlis";


const NotificationSkeleton = () => (
  <div className="flex items-center justify-between px-4 py-3 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
      <div>
        <div className="h-3 w-28 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
        <div className="h-2 w-20 bg-gray-200 dark:bg-gray-600 rounded" />
      </div>
    </div>
    <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded" />
  </div>
);

export default function NotificationDropdown() {
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, loading } = useSelector((state: RootState) => state.appointment);
  const [isMobile, setIsMobile] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [viewAllOpen, setViewAllOpen] = useState(false);

  const ignoreCloseRef = useRef(false);

  useEffect(() => {
    dispatch(getAppointments());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 820);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = () => setIsOpen((s) => !s);

  const getAvatar = (id: number) => avatars[id % avatars.length];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const hasUnseen = appointments.some((a) => !a.view);

  const handleDropdownClose = () => {
    if (ignoreCloseRef.current) {
      ignoreCloseRef.current = false;
      return;
    }
    if (selected || viewAllOpen) return;
    setIsOpen(false);
  };

  const closeSelectedModal = () => {
    ignoreCloseRef.current = true;
    setSelected(null);
  };

  const closeViewAllModal = () => {
    ignoreCloseRef.current = true;
    setViewAllOpen(false);
  };

  const renderNotificationItem = (item: Appointment, closeDropdown?: boolean) => (
    <button
      key={item.id}
      type="button"
      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition w-full text-left focus:outline-none"
      onClick={() => {
        setSelected(item);
        dispatch(viewAppointment(item.id));
        if (closeDropdown) setIsOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setSelected(item);
          if (closeDropdown) setIsOpen(false);
        }
      }}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Image src={getAvatar(Number(item.id))} alt="User" width={40} height={40} className="rounded-full object-cover" />
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${!item.view ? "bg-green-500" : "bg-gray-300"
              }`}
          />
        </div>
        <div>
          <p className="text-sm text-gray-800 dark:text-white">
            <span className="font-medium">{item.name}</span>{" "}
            <span className="text-gray-500 dark:text-gray-400">– {item.reason_of_meeting}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(item.createdAt)}</p>
        </div>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 ${item.view ? "text-blue-500" : "text-gray-400"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7M9 13l4 4L23 7" />
      </svg>
    </button>
  );

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative flex items-center justify-center text-gray-500 bg-white border rounded-full h-11 w-11 hover:text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-400"
      >
        {hasUnseen && <span className="absolute top-0.5 right-0.5 h-2 w-2 bg-orange-400 rounded-full animate-ping" />}
        <Bell size={20} />
      </button>
      {isOpen &&
        (isMobile ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={handleDropdownClose}>
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h5 className="text-lg font-semibold text-gray-800 dark:text-white">Notifications</h5>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  ✕
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto notification-scroll">
                {loading ? (
                  <>
                    <NotificationSkeleton />
                    <NotificationSkeleton />
                    <NotificationSkeleton />
                  </>
                ) : appointments.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No notifications</p>
                ) : (
                  appointments.map((item) => renderNotificationItem(item, true))
                )}
              </div>
              {appointments.length > 0 && (
                <div className="border-t dark:border-gray-700">
                  <button
                    onClick={() => {
                      setViewAllOpen(true);
                      setIsOpen(false);
                    }}
                    className="w-full py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-200"
                  >
                    View All Notifications
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Dropdown
            isOpen={isOpen}
            onClose={handleDropdownClose}
            className="absolute top-[60px] right-0 flex flex-col w-[360px] max-h-[480px] bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden z-50"
          >
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <h5 className="text-lg font-semibold text-gray-800 dark:text-white">Notifications</h5>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                ✕
              </button>
            </div>

            <div className="max-h-[380px] overflow-y-auto notification-scroll">
              {loading ? (
                <>
                  <NotificationSkeleton />
                  <NotificationSkeleton />
                  <NotificationSkeleton />
                </>
              ) : appointments.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No notifications</p>
              ) : (
                appointments.map((item) => renderNotificationItem(item))
              )}
            </div>

            {appointments.length > 0 && (
              <div className="border-t dark:border-gray-700">
                <button onClick={() => setViewAllOpen(true)} className="w-full py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-200">
                  View All Notifications
                </button>
              </div>
            )}
          </Dropdown>
        ))}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeSelectedModal}>
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Notification</h3>
              <button onClick={() => { ignoreCloseRef.current = true; setSelected(null); }} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                ✕
              </button>
            </div>
           <div className="p-4 space-y-3">
  <div className="flex items-start gap-3">
    <Image
      src={getAvatar(Number(selected.id))}
      alt="User"
      width={50}
      height={50}
      className="rounded-full object-cover"
    />
    <div>
      <p className="text-lg font-semibold text-gray-800 dark:text-white">{selected.name}</p>
      <p className="text-sm text-gray-500">{selected.email}</p>
      <p className="text-sm text-gray-500">{selected.contact_number}</p>
    </div>
  </div>

  <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
    <p><span className="font-medium">Date:</span> {selected.date}</p>
    <p><span className="font-medium">Time:</span> {selected.time}</p>
    <p><span className="font-medium">Reason:</span> {selected.reason_of_meeting}</p>
    <p><span className="font-medium">Expectation:</span> {selected.your_expectation || "N/A"}</p>
    <p><span className="font-medium">Details:</span> {selected.more_details}</p>
    <p><span className="font-medium">Created:</span> {formatTimeAgo(selected.createdAt)}</p>
  </div>
</div>

          </div>
        </div>
      )}
      {viewAllOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeViewAllModal}>
          <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-2xl shadow-lg overflow-y-auto max-h-[80vh] p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">All Notifications</h2>
              <button onClick={() => { ignoreCloseRef.current = true; setViewAllOpen(false); }} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto notification-scroll">
              {appointments.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setSelected(item); setViewAllOpen(false); dispatch(viewAppointment(item.id)); }}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { setSelected(item); setViewAllOpen(false); dispatch(viewAppointment(item.id)); } }}
                  className="flex items-start gap-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 w-full text-left focus:outline-none"
                >
                  <Image src={getAvatar(Number(item.id))} alt="User" width={40} height={40} className="rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 dark:text-white"><span className="font-medium">{item.name}</span> {item.reason_of_meeting}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.more_details} · {item.time}</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${item.view ? "text-blue-500" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7M9 13l4 4L23 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



