import { redirect } from "next/navigation";
import { requireAdmin, UnauthorizedError } from "@/lib/authz";
import { SignOutButton } from "@/components/SignOutButton";
import { AdminNav } from "@/components/admin/AdminNav";

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
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="card m-3 shrink-0 overflow-x-auto rounded-2xl p-3 sm:m-4 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:w-56 lg:overflow-x-visible lg:p-4">
        <span className="mb-2 block whitespace-nowrap px-3 font-mono text-[11px] uppercase tracking-widest text-muted-2 lg:mb-4">
          devcore / admin
        </span>
        <AdminNav />
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex min-w-0 flex-wrap items-center gap-3 border-b border-white/5 px-4 py-4 sm:px-6">
          <span className="min-w-0 flex-1 break-words font-mono text-xs leading-5 text-muted">
            Conectado como{" "}
            <span className="text-ink [overflow-wrap:anywhere]">{user.name}</span>{" "}
            <span className="text-teal">({user.role})</span>
          </span>
          <div className="shrink-0 [&_button]:min-h-11 [&_button]:px-2">
            <SignOutButton />
          </div>
        </header>
        <main className="min-w-0 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
