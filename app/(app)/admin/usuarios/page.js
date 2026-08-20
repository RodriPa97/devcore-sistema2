import { prisma } from "@/lib/prisma";
import { cambiarRol, crearAdmin } from "../actions";
import { ConfirmSubmitButton, FormSubmitButton } from "@/components/FormSubmitButton";

function UsersTable({ usuarios }) {
  if (usuarios.length === 0) {
    return (
      <p className="px-5 py-6 text-sm text-muted">
        Todavía no hay nadie en esta lista.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] text-left text-sm">
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
                <ConfirmSubmitButton
                  message={
                    u.role === "ADMIN"
                      ? `¿Quitar el rol de administrador a ${u.name}?`
                      : `¿Hacer administrador a ${u.name}?`
                  }
                  className="font-mono text-xs text-teal hover:underline"
                >
                  {u.role === "ADMIN" ? "Quitar admin" : "Hacer administrador"}
                </ConfirmSubmitButton>
              </form>
            </td>
          </tr>
        ))}
      </tbody>
      </table>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default async function UsuariosPage({ searchParams }) {
  const params = await searchParams;
  const usuarios = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const administradores = usuarios.filter((u) => u.role === "ADMIN");
  const clientes = usuarios.filter((u) => u.role === "CLIENTE");

  const error = params?.error;
  const ok = params?.ok;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-teal">
          {"// Usuarios"}
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
          <label htmlFor="admin-name" className="sr-only">
            Nombre
          </label>
          <input
            id="admin-name"
            type="text"
            name="name"
            required
            maxLength={120}
            autoComplete="name"
            placeholder="Nombre"
            className="input-field rounded-md px-3 py-2 text-sm"
          />
          <label htmlFor="admin-email" className="sr-only">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="Email"
            className="input-field rounded-md px-3 py-2 text-sm"
          />
          <label htmlFor="admin-password" className="sr-only">
            Contraseña
          </label>
          <input
            id="admin-password"
            type="password"
            name="password"
            required
            minLength={12}
            maxLength={72}
            autoComplete="new-password"
            placeholder="Contraseña (mín. 12 caracteres)"
            className="input-field rounded-md px-3 py-2 text-sm"
          />
          <FormSubmitButton
            pendingLabel="Creando..."
            className="btn-primary rounded-lg px-4 py-2 font-mono text-sm font-medium sm:col-span-3 sm:w-fit"
          >
            Crear administrador
          </FormSubmitButton>
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
