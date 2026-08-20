import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalUsuarios, totalAdmins] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-teal">
          {"// Panel"}
        </span>
        <h1 className="font-disp mt-2 text-2xl font-semibold">
          Resumen general
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card p-6">
          <span className="font-mono text-[11px] uppercase text-muted-2">
            Usuarios totales
          </span>
          <p className="font-disp mt-2 text-3xl">{totalUsuarios}</p>
        </div>
        <div className="card p-6">
          <span className="font-mono text-[11px] uppercase text-muted-2">
            Administradores
          </span>
          <p className="font-disp mt-2 text-3xl">{totalAdmins}</p>
        </div>
        <div className="card p-6">
          <span className="font-mono text-[11px] uppercase text-muted-2">
            Clientes
          </span>
          <p className="font-disp mt-2 text-3xl">
            {totalUsuarios - totalAdmins}
          </p>
        </div>
      </div>

      <p className="text-sm text-muted">
        Esta es la base del sistema de gestión: login real, roles de usuario
        y un panel que solo pueden ver los administradores. Los próximos
        módulos (Stock, Ventas, Administración) se agregan acá adentro,
        cada uno como una sección nueva del panel.
      </p>
    </div>
  );
}
