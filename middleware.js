import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Este archivo corre ANTES de cargar cualquier página que empiece con
// /admin o /panel. Si no hay sesión, manda al login. Si la ruta es
// /admin y el rol no es ADMIN, manda a /no-autorizado. /panel solo pide
// estar logueado (cualquier rol). Esta es la protección real (server
// side) — el chequeo dentro de cada página es un refuerzo, no el único
// lugar donde se controla el acceso.
export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const esRutaAdmin = request.nextUrl.pathname.startsWith("/admin");
  if (esRutaAdmin && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/no-autorizado", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/panel/:path*"],
};
