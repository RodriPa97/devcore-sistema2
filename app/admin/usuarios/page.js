import { prisma } from "@/lib/prisma";
import { cambiarRol } from "../actions";

export default async function UsuariosPage() {
  const usuarios = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-teal">
          // Usuarios
        </span>
        <h1 className="font-disp mt-2 text-2xl font-semibold">
          Usuarios y roles
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Acá podés ver quién se registró y cambiar quién tiene acceso de
          administrador al panel.
        </p>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr className="font-mono text-[11px] uppercase tracking-wide text-muted-2">
              <th className="px-5 py-3">Nombre</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Rol</th>
              <th className="px-5 py-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3">{u.name}</td>
                <td className="px-5 py-3 text-muted">{u.email}</td>
                <td className="px-5 py-3">
                  <span
                    className={
                      "rounded-md px-2 py-1 font-mono text-[10.5px] uppercase " +
                      (u.role === "ADMIN"
                        ? "bg-lime/10 text-lime"
                        : "bg-teal/10 text-teal")
                    }
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <form action={cambiarRol}>
                    <input type="hidden" name="userId" value={u.id} />
                    <input
                      type="hidden"
                      name="nuevoRol"
                      value={u.role === "ADMIN" ? "CLIENTE" : "ADMIN"}
                    />
                    <button
                      type="submit"
                      className="font-mono text-xs text-teal hover:underline"
                    >
                      {u.role === "ADMIN"
                        ? "Quitar admin"
                        : "Hacer administrador"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
