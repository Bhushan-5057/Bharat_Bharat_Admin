import { Metadata } from "next";
import BlogEditClient from "./BlogEditClient";

export const metadata: Metadata = {
  title: "Bharat Bharati | Edit Blog",
  description: "Bharat Bharati | Admin Dashboard - Edit Blog",
};

export default function BlogEditPage() {
  return <BlogEditClient />;
}
