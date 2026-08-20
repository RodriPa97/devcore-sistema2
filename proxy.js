import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { requiredSecret } from "@/lib/env";

const authSecret = requiredSecret("NEXTAUTH_SECRET");

export async function proxy(request) {
  let token;

  try {
    token = await getToken({
      req: request,
      secret: authSecret,
    });
  } catch {
    token = null;
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  if (isAdminRoute && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/no-autorizado", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/panel/:path*"],
};
