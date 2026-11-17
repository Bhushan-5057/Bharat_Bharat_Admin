import { Metadata } from "next";
import CertificateDetailClient from "./CertificateDetailClient";

export const metadata: Metadata = {
  title: "Bharat Bharati | Certificate Details",
  description: "Bharat Bharati | Admin Dashboard - Certificate Details Page",
};

export default function CertificateDetailPage() {
  return <CertificateDetailClient />;
}
