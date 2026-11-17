import { Metadata } from "next";
import ActivityCreateClient from "./ActivityCreateClient";

export const metadata: Metadata = {
  title: "Bharat Bharati | Add Activity",
  description: "Bharat Bharati | Admin Dashboard - Add Activity",
};

export default function ActivityCreatePage() {
  return <ActivityCreateClient />;
}
