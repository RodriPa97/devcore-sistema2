import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Registro público: siempre crea usuarios con rol CLIENTE. Nadie puede
// registrarse como ADMIN desde este formulario — los administradores se
// crean con el script de seed o los promueve otro administrador después
// (eso lo sumamos más adelante en el panel).
export async function POST(request) {
  try {
    const body = await request.json();
    const name = (body.name || "").trim();
    const email = (body.email || "").toLowerCase().trim();
    const password = body.password || "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Completá nombre, email y contraseña." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "La contraseña tiene que tener al menos 8 caracteres." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese email." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { name, email, passwordHash, role: "CLIENTE" },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Ocurrió un error inesperado. Probá de nuevo." },
      { status: 500 }
    );
  }
}
