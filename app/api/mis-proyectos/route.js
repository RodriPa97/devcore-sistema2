import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/authz";

export const dynamic = "force-dynamic";

// Este endpoint lo consulta el panel del cliente cada pocos segundos
// (ver app/panel/ProjectsBoard.js) para simular "tiempo real" sin
// necesitar infraestructura extra de websockets: cada vez que un admin
// cambia el estado de un proyecto, en la próxima consulta ya aparece
// actualizado.
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const proyectos = await prisma.project.findMany({
      where: { clientId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        status: true,
        progress: true,
        notes: true,
      },
    });

    return NextResponse.json(
      { proyectos },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    console.error("mis-proyectos failed", error);
    return NextResponse.json(
      { error: "No se pudieron cargar los proyectos." },
      { status: 500 }
    );
  }
}
