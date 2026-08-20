import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "../admin/SignOutButton";
import { ProjectsBoard } from "./ProjectsBoard";

// Panel del cliente: cualquiera que tenga una cuenta (rol CLIENTE o
// ADMIN) puede entrar acá y ver sus propios proyectos. No hace falta ser
// admin para esta pantalla — a diferencia de /admin, que sí lo exige.
export default async function PanelPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/panel");
  }

  return (
    <main className="min-h-screen">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <span className="font-mono text-xs text-muted">
          Conectado como{" "}
          <span className="text-ink">{session.user?.name}</span>
        </span>
        <SignOutButton />
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <span className="font-mono text-xs uppercase tracking-widest text-teal">
          // Mis proyectos
        </span>
        <h1 className="font-disp mt-2 text-2xl font-semibold">
          Así va tu proyecto
        </h1>
        <p className="mt-2 text-sm text-muted">
          Esta pantalla se actualiza sola. Cuando el equipo de DevCore
          avance con tu proyecto, lo vas a ver reflejado acá sin tener que
          preguntar.
        </p>

        <div className="mt-8">
          <ProjectsBoard />
        </div>
      </div>
    </main>
  );
}
