import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "./SignOutButton";

// El middleware (middleware.js) ya bloquea /admin/* a nivel de red, pero
// repetimos el chequeo acá adentro (defensa en profundidad): si por
// cualquier motivo se llega a este layout sin ser admin, no se renderiza
// nada del panel.
export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="card m-4 hidden w-56 shrink-0 flex-col gap-1 rounded-2xl p-4 sm:flex">
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
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <span className="font-mono text-xs text-muted">
            Conectado como{" "}
            <span className="text-ink">{session.user?.name}</span>{" "}
            <span className="text-teal">({session.user?.role})</span>
          </span>
          <SignOutButton />
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
