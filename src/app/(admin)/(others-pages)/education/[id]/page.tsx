import { Metadata } from "next";
import EducationDetailClient from "./EducationDetailClient";

export const metadata: Metadata = {
  title: "Bharat Bharati | Education Details",
  description: "Bharat Bharati | Admin Dashboard - Education Details Page",
};

export default function EducationDetailPage() {
  return <EducationDetailClient />;
}
