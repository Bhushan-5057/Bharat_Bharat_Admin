import { Metadata } from "next";
import CityDetailClient from "./CityDetailClient";


export const metadata: Metadata = {
  title: "Bharat Bharati | Cities Details",
  description: "Bharat Bharati | Admin Dashboard - Cities Details Page",
};

export const dynamic = "force-static";

export default function CitiesDeatilPage() {
  return <CityDetailClient />;
}
