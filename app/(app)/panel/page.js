import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/authz";
import { SignOutButton } from "@/components/SignOutButton";
import { ProjectsBoard } from "./ProjectsBoard";

// Panel del cliente: cualquiera que tenga una cuenta (rol CLIENTE o
// ADMIN) puede entrar acá y ver sus propios proyectos. No hace falta ser
// admin para esta pantalla — a diferencia de /admin, que sí lo exige.
export const dynamic = "force-dynamic";

export default async function PanelPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/panel");
  }

  return (
    <main className="min-h-dvh">
      <header className="flex flex-col items-start gap-2 border-b border-white/5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6">
        <span className="min-w-0 max-w-full font-mono text-xs text-muted">
          Conectado como{" "}
          <span className="break-words text-ink [overflow-wrap:anywhere]">
            {user.name}
          </span>
        </span>
        <SignOutButton />
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <span className="font-mono text-xs uppercase tracking-widest text-teal">
          {"// Mis proyectos"}
        </span>
        <h1 className="font-disp mt-2 text-2xl font-semibold">
          Así va tu proyecto
        </h1>
        <p className="mt-2 text-sm text-muted">
          Esta pantalla se actualiza sola. Cuando el equipo de DevCore
          avance con tu proyecto, lo vas a ver reflejado acá sin tener que
          preguntar.
        </p>

        <div className="mt-6 sm:mt-8">
          <ProjectsBoard />
        </div>
      </div>
    </main>
  );
}
