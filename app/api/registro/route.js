import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registrationSchema } from "@/lib/validation";
import { enforceRateLimit, requestIp } from "@/lib/rateLimit";

// Registro público: siempre crea usuarios con rol CLIENTE. Nadie puede
// registrarse como ADMIN desde este formulario — los administradores se
// crean con el script de seed o los promueve otro administrador después
// (eso lo sumamos más adelante en el panel).
export async function POST(request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 16_384) {
    return NextResponse.json(
      { error: "La solicitud es demasiado grande." },
      { status: 413 }
    );
  }

  const ip = requestIp(request);
  const rate = await enforceRateLimit({
    key: `registration:${ip}`,
    limit: 5,
    window: "15 m",
    windowMs: 15 * 60 * 1000,
  });

  if (!rate.success) {
    return NextResponse.json(
      { error: "Demasiados intentos. Probá de nuevo más tarde." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((rate.reset - Date.now()) / 1000)) },
      }
    );
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "El cuerpo de la solicitud no es un JSON válido." },
        { status: 400 }
      );
    }

    const parsed = registrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Revisá los datos ingresados." },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese email." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    try {
      await prisma.user.create({
        data: { name, email, passwordHash, role: "CLIENTE" },
      });
    } catch (error) {
      if (error?.code === "P2002") {
        return NextResponse.json(
          { error: "Ya existe una cuenta con ese email." },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("registration failed", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Ocurrió un error inesperado. Probá de nuevo." },
      { status: 500 }
    );
  }
}
