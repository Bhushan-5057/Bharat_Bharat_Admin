"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store/redux/store";
import { fetchEventByIdThunk } from "@/store/redux/slice/eventSlice";
import EditEventForm from "@/components/form/event/EditEventForm";
import AdminFormShell from "@/components/common/AdminFormShell";
import { AdminPageSkeleton } from "@/components/common/AdminPageActions";

export default function EventEditClient() {
  const { id } = useParams();
  const eventId = String(id ?? "");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedEvent, loading, error } = useSelector(
    (state: RootState) => state.events
  );

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventByIdThunk(eventId));
    }
  }, [eventId, dispatch]);

  const goDetail = () => router.push(`/events/${eventId}`);

  return (
    <AdminFormShell
      pageTitle="Edit Event"
      listPath="/event-table"
      listLabel="Events"
      cardTitle="Edit Event"
      description="Update the event details below."
    >
      {loading && <AdminPageSkeleton />}
      {error && <p className="text-red-500">Error loading event</p>}
      {!loading && !error && selectedEvent && (
        <EditEventForm event={selectedEvent} closeModal={goDetail} />
      )}
    </AdminFormShell>
  );
}
