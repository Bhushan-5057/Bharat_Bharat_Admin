import { Metadata } from "next";
import EventCreateClient from "./EventCreateClient";

export const metadata: Metadata = {
  title: "Bharat Bharati | Add Event",
  description: "Bharat Bharati | Admin Dashboard - Add Event",
};

export default function EventCreatePage() {
  return <EventCreateClient />;
}
