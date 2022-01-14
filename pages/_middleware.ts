import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // Token will exist if user is logged in
  const token = await getToken({
    req: req as unknown as NextApiRequest,
    secret: process.env.JWT_SECRET as string,
    secureCookie:
      process.env.NEXTAUTH_URL?.startsWith("https://") ??
      !!process.env.VERCEL_URL,
  });

  const { pathname } = req.nextUrl;

  // Redirect to home page if accessing login when already authenticated
  if (pathname?.includes("/login") && token) {
    return NextResponse.redirect("/");
  }

  // Allow request if request for session & provider is fetching or if token exists
  if (pathname?.includes("/api/auth" || token)) {
    return NextResponse.next();
  }

  // Redirect to login if user is trying to access protected route and has not been authenticated
  if (!token && pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
}
