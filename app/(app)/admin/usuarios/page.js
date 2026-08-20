import { prisma } from "@/lib/prisma";
import { cambiarRol, crearAdmin } from "../actions";

function UsersTable({ usuarios }) {
  if (usuarios.length === 0) {
    return (
      <p className="px-5 py-6 text-sm text-muted">
        Todavía no hay nadie en esta lista.
      </p>
    );
  }

  return (
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
                  {u.role === "ADMIN" ? "Quitar admin" : "Hacer administrador"}
                </button>
              </form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default async function UsuariosPage({ searchParams }) {
  const usuarios = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const administradores = usuarios.filter((u) => u.role === "ADMIN");
  const clientes = usuarios.filter((u) => u.role !== "ADMIN");

  const error = searchParams?.error;
  const ok = searchParams?.ok;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-teal">
          // Usuarios
        </span>
        <h1 className="font-disp mt-2 text-2xl font-semibold">
          Usuarios y roles
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Acá ves por separado a los clientes y a los administradores, y
          podés cambiar quién tiene acceso al panel o crear un nuevo
          administrador directamente.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      {ok && (
        <div className="rounded-lg border border-lime/30 bg-lime/10 px-4 py-3 text-sm text-lime">
          Administrador creado con éxito.
        </div>
      )}

      <div className="card p-6">
        <h2 className="font-disp text-lg font-semibold">
          Crear nuevo administrador
        </h2>
        <p className="mt-1 text-xs text-muted">
          Esto crea una cuenta que ya arranca con permiso de administrador
          (no hace falta que esa persona se registre por su cuenta primero).
        </p>
        <form
          action={crearAdmin}
          className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          <input
            type="text"
            name="name"
            required
            placeholder="Nombre"
            className="input-field rounded-md px-3 py-2 text-sm"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="input-field rounded-md px-3 py-2 text-sm"
          />
          <input
            type="password"
            name="password"
            required
            minLength={8}
            placeholder="Contraseña (mín. 8 caracteres)"
            className="input-field rounded-md px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="btn-primary rounded-lg px-4 py-2 font-mono text-sm font-medium sm:col-span-3 sm:w-fit"
          >
            Crear administrador
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-disp mb-3 text-lg font-semibold">
          Administradores{" "}
          <span className="text-sm font-normal text-muted-2">
            ({administradores.length})
          </span>
        </h2>
        <div className="card overflow-hidden">
          <UsersTable usuarios={administradores} />
        </div>
      </div>

      <div>
        <h2 className="font-disp mb-3 text-lg font-semibold">
          Clientes{" "}
          <span className="text-sm font-normal text-muted-2">
            ({clientes.length})
          </span>
        </h2>
        <div className="card overflow-hidden">
          <UsersTable usuarios={clientes} />
        </div>
      </div>
    </div>
  );
}
