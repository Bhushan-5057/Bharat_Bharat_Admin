import { Metadata } from "next";
import EventEditClient from "./EventEditClient";

export const metadata: Metadata = {
  title: "Bharat Bharati | Edit Event",
  description: "Bharat Bharati | Admin Dashboard - Edit Event",
};

export default function EventEditPage() {
  return <EventEditClient />;
}
