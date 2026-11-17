import { Metadata } from "next";
import ActivityDetailClient from "./ActivityDetailClient";

export const metadata: Metadata = {
  title: "Bharat Bharati | Activity Details",
  description: "Bharat Bharati | Admin Dashboard - Activity Details Page",
};

export default function ActivityDetailPage() {
  return <ActivityDetailClient />;
}
