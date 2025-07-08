import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = cookies();
  const token = cookieStore.get("authToken")?.value;

  // Public routes that don't need protection
  const publicRoutes = ["/login"];

  // If user has a token and tries to access auth pages
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  // If user doesn't have a token and tries to access protected routes
  if (!token && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
