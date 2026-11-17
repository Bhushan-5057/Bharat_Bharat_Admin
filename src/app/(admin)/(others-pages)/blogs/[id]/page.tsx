import { Metadata } from "next";
import BlogDetailClient from "./BlogDetailClient";

export const metadata: Metadata = {
  title: "Bharat Bharati | Blog Details",
  description: "Bharat Bharati | Admin Dashboard - Blog Details Page",
};

export default function BlogDetailPage() {
  return <BlogDetailClient />;
}
