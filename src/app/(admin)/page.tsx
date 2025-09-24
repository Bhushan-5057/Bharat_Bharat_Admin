import { Metadata } from "next";
import HomePage from "./HomePage";

export const metadata: Metadata = {
  title: "Dashboard - BHARAT BHARATI ADMIN",
  description: "View your admin dashboard with insights on projects, clients, staff, and more.",
};
export default function Ecommerce() {

  return (
   <>
   <div>

   <HomePage/>
   </div>
   </>
  );
}
