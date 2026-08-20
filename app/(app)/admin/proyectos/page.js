import { prisma } from "@/lib/prisma";
import { ESTADOS_PROYECTO } from "@/lib/estadosProyecto";
import { crearProyecto, actualizarProyecto, eliminarProyecto } from "../actions";

export default async function ProyectosAdminPage({ searchParams }) {
  const [proyectos, clientes] = await Promise.all([
    prisma.project.findMany({
      include: { client: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { role: "CLIENTE" },
      orderBy: { name: "asc" },
    }),
  ]);

  const error = searchParams?.error;
  const ok = searchParams?.ok;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-teal">
          // Proyectos
        </span>
        <h1 className="font-disp mt-2 text-2xl font-semibold">
          Proyectos de clientes
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Cada proyecto que crees acá lo ve el cliente correspondiente en su
          panel (<code>/panel</code>), actualizado automáticamente — no hace
          falta avisarle por otro lado cuando cambia el estado.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      {ok && (
        <div className="rounded-lg border border-lime/30 bg-lime/10 px-4 py-3 text-sm text-lime">
          Proyecto creado con éxito.
        </div>
      )}

      <div className="card p-6">
        <h2 className="font-disp text-lg font-semibold">Crear proyecto</h2>

        {clientes.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            Todavía no hay ningún cliente registrado. Un proyecto siempre
            tiene que estar asignado a un cliente — pedile que se registre
            en <code>/registro</code>, o creá vos la cuenta desde{" "}
            <code>/admin/usuarios</code> (ahí también podés crear clientes a
            mano si agregamos esa opción más adelante).
          </p>
        ) : (
          <form
            action={crearProyecto}
            className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4"
          >
            <input
              type="text"
              name="name"
              required
              placeholder="Nombre del proyecto"
              className="input-field rounded-md px-3 py-2 text-sm sm:col-span-2"
            />
            <select
              name="clientId"
              required
              defaultValue=""
              className="input-field rounded-md px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Elegir cliente
              </option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
            <select
              name="status"
              defaultValue="BACKLOG"
              className="input-field rounded-md px-3 py-2 text-sm"
            >
              {ESTADOS_PROYECTO.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="btn-primary rounded-lg px-4 py-2 font-mono text-sm font-medium sm:col-span-4 sm:w-fit"
            >
              Crear proyecto
            </button>
          </form>
        )}
      </div>

      <div className="card overflow-hidden">
        {proyectos.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted">
            Todavía no creaste ningún proyecto.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.02]">
              <tr className="font-mono text-[11px] uppercase tracking-wide text-muted-2">
                <th className="px-5 py-3">Proyecto</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Avance</th>
                <th className="px-5 py-3">Notas</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {proyectos.map((p) => (
                <tr key={p.id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3 align-top">{p.name}</td>
                  <td className="px-5 py-3 align-top text-muted">
                    {p.client.name}
                    <br />
                    <span className="text-xs text-muted-2">
                      {p.client.email}
                    </span>
                  </td>
                  <td className="px-5 py-3 align-top">
                    <form
                      action={actualizarProyecto}
                      className="flex flex-col gap-2"
                    >
                      <input type="hidden" name="id" value={p.id} />
                      <select
                        name="status"
                        defaultValue={p.status}
                        className="input-field rounded-md px-2 py-1 text-xs"
                      >
                        {ESTADOS_PROYECTO.map((e) => (
                          <option key={e.value} value={e.value}>
                            {e.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        name="progress"
                        min={0}
                        max={100}
                        defaultValue={p.progress}
                        className="input-field w-20 rounded-md px-2 py-1 text-xs"
                      />
                      <input
                        type="text"
                        name="notes"
                        defaultValue={p.notes || ""}
                        placeholder="Nota para el cliente (opcional)"
                        className="input-field rounded-md px-2 py-1 text-xs"
                      />
                      <button
                        type="submit"
                        className="w-fit font-mono text-[11px] text-teal hover:underline"
                      >
                        Guardar cambios
                      </button>
                    </form>
                  </td>
                  <td className="px-5 py-3 align-top">{p.progress}%</td>
                  <td className="px-5 py-3 align-top text-xs text-muted">
                    {p.notes || "—"}
                  </td>
                  <td className="px-5 py-3 align-top">
                    <form action={eliminarProyecto}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        type="submit"
                        className="font-mono text-[11px] text-red-400 hover:underline"
                      >
                        Eliminar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
