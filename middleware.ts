import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Never run auth logic for Next.js assets/static files.
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname === "/favicon.ico" ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("authToken")?.value;

  const protectedRoutes = ["/", "/admin", "/dashboard"];
  const authRoutes = ["/signin", "/signup"];

  const isProtectedRoute = protectedRoutes.some((path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path)
  );
  const isAuthRoute = authRoutes.includes(pathname);

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/validate`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};

