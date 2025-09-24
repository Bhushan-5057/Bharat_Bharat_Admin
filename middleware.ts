import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  const protectedRoutes = ["/", "/admin", "/dashboard"];
  const authRoutes = ["/signin", "/signup"];

  const isProtectedRoute = protectedRoutes.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );
  const isAuthRoute = authRoutes.includes(req.nextUrl.pathname);

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const response = NextResponse.redirect(new URL("/signin", req.url));
        response.cookies.delete("authToken");
        return response;
      }
    } catch (err) {
      const response = NextResponse.redirect(new URL("/signin", req.url));
      response.cookies.delete("authToken");
      return response;
    }
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

