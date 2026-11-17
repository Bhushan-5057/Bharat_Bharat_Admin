import { Metadata } from "next";
import EventDetailClient from "./EventDetailClient";

export const metadata: Metadata = {
  title: "Bharat Bharati | Event Details",
  description: "Bharat Bharati | Admin Dashboard - Event Details Page",
};

export default function EventDetailPage() {
  return <EventDetailClient />;
}
