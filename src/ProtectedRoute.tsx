"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const publicRoutes = ["/signin", "/signup", "/forgot-password"];

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasToken = document.cookie.includes("authToken=");

    if (!hasToken && !publicRoutes.includes(pathname)) {
      router.replace("/signin");
    } else if (hasToken && publicRoutes.includes(pathname)) {
      router.replace("/");
    } else {
      setLoading(false);
    }
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
}
