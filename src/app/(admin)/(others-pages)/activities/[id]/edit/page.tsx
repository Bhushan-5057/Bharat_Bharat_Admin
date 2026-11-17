import { Metadata } from "next";
import ActivityEditClient from "./ActivityEditClient";

export const metadata: Metadata = {
  title: "Bharat Bharati | Edit Activity",
  description: "Bharat Bharati | Admin Dashboard - Edit Activity",
};

export default function ActivityEditPage() {
  return <ActivityEditClient />;
}
