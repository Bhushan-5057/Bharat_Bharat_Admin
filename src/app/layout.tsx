"use client";

import { useEffect, useState } from "react";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { Provider } from "react-redux";
import { store } from "@/store/redux/store";
import { Toaster } from "sonner";
import ProtectedRoute from "@/ProtectedRoute";
import IndianFlagLoader from "@/components/ui/Loader/IndianFlagLoader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    try {
      localStorage.removeItem("theme");
    } catch {
      /* ignore */
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {loading ? (
          <IndianFlagLoader />
        ) : (
          <Provider store={store}>
            <Toaster position="top-right" theme="light" />
            <ProtectedRoute>
              <SidebarProvider>{children}</SidebarProvider>
            </ProtectedRoute>
          </Provider>
        )}
      </body>
    </html>
  );
}
