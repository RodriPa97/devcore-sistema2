import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin, UnauthorizedError } from "@/lib/authz";
import { SignOutButton } from "@/components/SignOutButton";

// El proxy (proxy.js) ya bloquea /admin/* a nivel de red, pero
// repetimos el chequeo acá adentro (defensa en profundidad): si por
// cualquier motivo se llega a este layout sin ser admin, no se renderiza
// nada del panel.
export default async function AdminLayout({ children }) {
  let user;
  try {
    user = await requireAdmin();
  } catch (error) {
    if (!(error instanceof UnauthorizedError)) throw error;
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="card m-4 flex w-auto shrink-0 flex-row gap-1 overflow-x-auto rounded-2xl p-3 sm:w-56 sm:flex-col sm:p-4">
        <span className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted-2">
          devcore / admin
        </span>
        <Link
          href="/admin"
          className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-ink"
        >
          Panel
        </Link>
        <Link
          href="/admin/usuarios"
          className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-ink"
        >
          Usuarios
        </Link>
        <Link
          href="/admin/proyectos"
          className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-ink"
        >
          Proyectos
        </Link>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <span className="font-mono text-xs text-muted">
            Conectado como{" "}
            <span className="text-ink">{user.name}</span>{" "}
            <span className="text-teal">({user.role})</span>
          </span>
          <SignOutButton />
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
