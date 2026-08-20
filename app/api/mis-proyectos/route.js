import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Este endpoint lo consulta el panel del cliente cada pocos segundos
// (ver app/panel/ProjectsBoard.js) para simular "tiempo real" sin
// necesitar infraestructura extra de websockets: cada vez que un admin
// cambia el estado de un proyecto, en la próxima consulta ya aparece
// actualizado.
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const proyectos = await prisma.project.findMany({
    where: { clientId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ proyectos });
}
