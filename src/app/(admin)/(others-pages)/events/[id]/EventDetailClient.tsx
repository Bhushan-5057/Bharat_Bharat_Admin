"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState, AppDispatch } from "@/store/redux/store";
import { fetchEventByIdThunk } from "@/store/redux/slice/eventSlice";
import EventView from "@/components/form/event/EventView";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminPageActions, { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function EventDetailClient() {
  const { id } = useParams();
  const eventId = String(id ?? "");
  const dispatch = useDispatch<AppDispatch>();
  const { selectedEvent, loading, error } = useSelector(
    (state: RootState) => state.events
  );

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventByIdThunk(eventId));
    }
  }, [eventId, dispatch]);

  return (
    <div className="w-full mx-auto py-6">
      <PageBreadcrumb
        pageTitle="Event Details"
        path="/event-table"
        label="Events"
      />
      <AdminPageActions
        backHref="/event-table"
        editHref={eventId ? `/events/${eventId}/edit` : undefined}
        editLabel="Edit Event"
      />

      {loading && <AdminPageSkeleton />}
      {error && <p className="p-6 text-red-500">Error loading event</p>}
      {!loading && !error && selectedEvent && (
        <EventView event={selectedEvent} />
      )}
    </div>
  );
}
