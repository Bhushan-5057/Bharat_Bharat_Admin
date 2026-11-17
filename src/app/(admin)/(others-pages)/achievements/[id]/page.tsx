import { Metadata } from "next";
import AchievementDetailClient from "./AchievementDetailClient";

export const metadata: Metadata = {
  title: "Bharat Bharati | Achievement Details",
  description: "Bharat Bharati | Admin Dashboard - Achievement Details Page",
};

export default function AchievementDetailPage() {
  return <AchievementDetailClient />;
}
