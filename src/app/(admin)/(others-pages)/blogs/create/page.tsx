import { Metadata } from "next";
import BlogCreateClient from "./BlogCreateClient";

export const metadata: Metadata = {
  title: "Bharat Bharati | Add Blog",
  description: "Bharat Bharati | Admin Dashboard - Add Blog",
};

export default function BlogCreatePage() {
  return <BlogCreateClient />;
}
