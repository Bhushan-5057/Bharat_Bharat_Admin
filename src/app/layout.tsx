
"use client";

import { useEffect, useState } from "react";
import { Outfit } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Provider } from "react-redux";
import { store } from "@/store/redux/store";
import { Toaster } from "sonner";
import ProtectedRoute from "@/ProtectedRoute";
import IndianFlagLoader from "@/components/ui/Loader/IndianFlagLoader";


const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
 
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900 relative`}>
        {loading ? (
          <IndianFlagLoader />
        ) : (
          <>
            <div
              className=""
            />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

            <Provider store={store}>
              <Toaster position="top-right" />
              <ThemeProvider>
                <ProtectedRoute>
                  <SidebarProvider>{children}</SidebarProvider>
                </ProtectedRoute>
              </ThemeProvider>
            </Provider>
          </>
        )}
      </body>
    </html>
  );
}
