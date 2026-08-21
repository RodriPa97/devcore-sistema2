import { prisma } from "@/lib/prisma";
import { cambiarRol, crearAdmin } from "../actions";
import {
  ConfirmSubmitButton,
  FormSubmitButton,
} from "@/components/FormSubmitButton";
import { AdminPagination } from "@/components/admin/Pagination";

const PAGE_SIZE = 20;

const USER_ERRORS = {
  "invalid-admin": "Revisá el nombre, el email y la contraseña.",
  "email-exists": "Ya existe una cuenta con ese email.",
  "invalid-role": "No se pudo validar el cambio de rol.",
  "self-role": "No podés quitarte tu propio rol de administrador.",
  "user-not-found": "El usuario ya no existe. La lista fue actualizada.",
  "last-admin": "Debe quedar al menos un administrador activo.",
  "role-conflict": "El rol cambió al mismo tiempo en otra sesión. Intentá nuevamente.",
};

function singleParam(value) {
  return typeof value === "string" ? value : undefined;
}

function getFeedback(params) {
  const error = USER_ERRORS[singleParam(params?.error)];
  if (error) return { type: "error", message: error };

  const success = singleParam(params?.success);
  const subject = singleParam(params?.subject)?.slice(0, 120);
  if (success === "admin-created") {
    return {
      type: "success",
      message: subject
        ? `La cuenta de administrador de ${subject} fue creada.`
        : "La cuenta de administrador fue creada.",
    };
  }
  if (success === "role-updated") {
    return {
      type: "success",
      message: subject
        ? `El rol de ${subject} fue actualizado.`
        : "El rol del usuario fue actualizado.",
    };
  }

  return null;
}

function RoleBadge({ role }) {
  return (
    <span
      className={
        "inline-flex rounded-md px-2 py-1 font-mono text-[10.5px] uppercase " +
        (role === "ADMIN" ? "bg-lime/10 text-lime" : "bg-teal/10 text-teal")
      }
    >
      {role}
    </span>
  );
}

function RoleAction({ user, fullWidth = false }) {
  const nextRole = user.role === "ADMIN" ? "CLIENTE" : "ADMIN";

  return (
    <form action={cambiarRol}>
      <input type="hidden" name="userId" value={user.id} />
      <input type="hidden" name="nuevoRol" value={nextRole} />
      <ConfirmSubmitButton
        message={
          user.role === "ADMIN"
            ? `¿Quitar el rol de administrador a ${user.name}?`
            : `¿Hacer administrador a ${user.name}?`
        }
        className={`min-h-11 rounded-lg px-3 py-2 font-mono text-xs text-teal hover:bg-teal/10 ${
          fullWidth ? "w-full" : ""
        }`}
      >
        {user.role === "ADMIN" ? "Quitar admin" : "Hacer administrador"}
      </ConfirmSubmitButton>
    </form>
  );
}

function UsersList({
  users,
  emptyTitle,
  emptyDescription,
  page,
  totalPages,
  pageParam,
}) {
  if (users.length === 0) {
    return (
      <div className="px-5 py-8 text-center">
        <p className="font-disp text-base font-semibold">{emptyTitle}</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr className="font-mono text-[11px] uppercase tracking-wide text-muted-2">
              <th scope="col" className="px-5 py-3">Nombre</th>
              <th scope="col" className="px-5 py-3">Email</th>
              <th scope="col" className="px-5 py-3">Rol</th>
              <th scope="col" className="px-5 py-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-white/5 last:border-0">
                <td className="max-w-52 break-words px-5 py-3">{user.name}</td>
                <td className="break-all px-5 py-3 text-muted">{user.email}</td>
                <td className="px-5 py-3"><RoleBadge role={user.role} /></td>
                <td className="px-5 py-2"><RoleAction user={user} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-white/5 md:hidden">
        {users.map((user) => (
          <article key={user.id} className="p-4">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <h3 className="min-w-0 break-words font-medium">{user.name}</h3>
              <RoleBadge role={user.role} />
            </div>
            <p className="mt-2 break-all text-sm text-muted">{user.email}</p>
            <div className="mt-4">
              <RoleAction user={user} fullWidth />
            </div>
          </article>
        ))}
      </div>
      <AdminPagination
        pathname="/admin/usuarios"
        page={page}
        totalPages={totalPages}
        paramName={pageParam}
        label={emptyTitle}
      />
    </>
  );
}

function parsePage(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export const dynamic = "force-dynamic";

export default async function UsuariosPage({ searchParams }) {
  const params = await searchParams;
  const requestedAdminPage = parsePage(params?.adminPage);
  const requestedClientPage = parsePage(params?.clientPage);
  const [adminCount, clientCount] = await Promise.all([
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count({ where: { role: "CLIENTE" } }),
  ]);
  const adminTotalPages = Math.max(1, Math.ceil(adminCount / PAGE_SIZE));
  const clientTotalPages = Math.max(1, Math.ceil(clientCount / PAGE_SIZE));
  const adminPage = Math.min(requestedAdminPage, adminTotalPages);
  const clientPage = Math.min(requestedClientPage, clientTotalPages);
  const [administradores, clientes] = await Promise.all([
    prisma.user.findMany({
      where: { role: "ADMIN" },
      orderBy: { createdAt: "desc" },
      skip: (adminPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { id: true, name: true, email: true, role: true },
    }),
    prisma.user.findMany({
      where: { role: "CLIENTE" },
      orderBy: { createdAt: "desc" },
      skip: (clientPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { id: true, name: true, email: true, role: true },
    }),
  ]);
  const feedback = getFeedback(params);

  return (
    <div className="flex min-w-0 flex-col gap-8">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-teal">
          {"// Usuarios"}
        </span>
        <h1 className="font-disp mt-2 text-2xl font-semibold">
          Usuarios y roles
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Administrá el acceso al panel y creá cuentas de administración sin
          salir de esta sección.
        </p>
      </div>

      {feedback ? (
        <div
          role={feedback.type === "error" ? "alert" : "status"}
          className={`rounded-lg border px-4 py-3 text-sm ${
            feedback.type === "error"
              ? "border-red-400/30 bg-red-400/10 text-red-300"
              : "border-lime/30 bg-lime/10 text-lime"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <section className="card p-4 sm:p-6" aria-labelledby="create-admin-title">
        <h2 id="create-admin-title" className="font-disp text-lg font-semibold">
          Crear nuevo administrador
        </h2>
        <p className="mt-1 text-xs text-muted">
          La cuenta se crea con acceso administrativo desde el primer ingreso.
        </p>
        <form
          action={crearAdmin}
          className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <label htmlFor="admin-name" className="flex flex-col gap-2 text-sm text-muted">
            <span>Nombre</span>
            <input
              id="admin-name"
              type="text"
              name="name"
              required
              maxLength={120}
              autoComplete="name"
              className="input-field min-h-11 rounded-md px-3 py-2 text-sm text-ink"
            />
          </label>
          <label htmlFor="admin-email" className="flex flex-col gap-2 text-sm text-muted">
            <span>Email</span>
            <input
              id="admin-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              className="input-field min-h-11 rounded-md px-3 py-2 text-sm text-ink"
            />
          </label>
          <label htmlFor="admin-password" className="flex flex-col gap-2 text-sm text-muted">
            <span>Contraseña (mínimo 12 caracteres)</span>
            <input
              id="admin-password"
              type="password"
              name="password"
              required
              minLength={12}
              maxLength={72}
              autoComplete="new-password"
              className="input-field min-h-11 rounded-md px-3 py-2 text-sm text-ink"
            />
          </label>
          <FormSubmitButton
            pendingLabel="Creando..."
            className="btn-primary min-h-11 rounded-lg px-4 py-2 font-mono text-sm font-medium sm:col-span-3 sm:w-fit"
          >
            Crear administrador
          </FormSubmitButton>
        </form>
      </section>

      <section aria-labelledby="admins-title">
        <h2 id="admins-title" className="font-disp mb-3 text-lg font-semibold">
          Administradores{" "}
          <span className="text-sm font-normal text-muted-2">
            ({adminCount})
          </span>
        </h2>
        <div className="card overflow-hidden">
           <UsersList
             users={administradores}
             emptyTitle="No hay administradores en esta lista"
             emptyDescription="Creá una cuenta arriba o asigná el rol de administrador a un cliente."
              page={adminPage}
              totalPages={adminTotalPages}
              pageParam="adminPage"
           />
        </div>
      </section>

      <section aria-labelledby="clients-title">
        <h2 id="clients-title" className="font-disp mb-3 text-lg font-semibold">
          Clientes{" "}
          <span className="text-sm font-normal text-muted-2">
            ({clientCount})
          </span>
        </h2>
        <div className="card overflow-hidden">
           <UsersList
             users={clientes}
             emptyTitle="Todavía no hay clientes"
             emptyDescription="Cuando una persona se registre como cliente, aparecerá acá para que puedas administrar su rol."
              page={clientPage}
              totalPages={clientTotalPages}
              pageParam="clientPage"
           />
        </div>
      </section>
    </div>
  );
}
