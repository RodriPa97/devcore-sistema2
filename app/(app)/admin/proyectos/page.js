import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ESTADOS_PROYECTO } from "@/lib/estadosProyecto";
import { crearProyecto, actualizarProyecto, eliminarProyecto } from "../actions";
import {
  ConfirmSubmitButton,
  FormSubmitButton,
} from "@/components/FormSubmitButton";
import { AdminPagination } from "@/components/admin/Pagination";

const PROJECT_ERRORS = {
  "invalid-project": "Revisá el nombre, el cliente y el estado del proyecto.",
  "invalid-client": "Elegí un cliente activo válido.",
  "invalid-update": "Revisá el estado, el avance y las notas antes de guardar.",
  "invalid-delete": "No se pudo identificar el proyecto que querés eliminar.",
  "project-not-found": "El proyecto ya no existe. La lista fue actualizada.",
  "stale-project": "El proyecto cambió en otra sesión. Revisá los datos actualizados e intentá nuevamente.",
};
const PAGE_SIZE = 20;

function singleParam(value) {
  return typeof value === "string" ? value : undefined;
}

function getFeedback(params) {
  const error = PROJECT_ERRORS[singleParam(params?.error)];
  if (error) return { type: "error", message: error };

  const success = singleParam(params?.success);
  const subject = singleParam(params?.subject)?.slice(0, 160);
  const project = subject ? `“${subject}”` : "El proyecto";

  if (success === "project-created") {
    return { type: "success", message: `${project} fue creado.` };
  }
  if (success === "project-updated") {
    return { type: "success", message: `${project} fue actualizado.` };
  }
  if (success === "project-deleted") {
    return { type: "success", message: `${project} fue eliminado.` };
  }

  return null;
}

function ClientDetails({ client }) {
  return (
    <div className="min-w-0">
      <p className="break-words text-sm text-muted">{client.name}</p>
      <p className="mt-0.5 break-all text-xs text-muted-2">{client.email}</p>
    </div>
  );
}

function ProjectEditor({ project, view }) {
  const prefix = `${view}-project-${project.id}`;

  return (
    <form action={actualizarProyecto} className="min-w-0">
      <input type="hidden" name="id" value={project.id} />
      <input type="hidden" name="updatedAt" value={project.updatedAt.toISOString()} />
      <div
        className={
          view === "desktop"
            ? "grid min-w-[470px] grid-cols-[minmax(8rem,0.8fr)_5.5rem_minmax(12rem,1.4fr)] gap-3"
            : "grid grid-cols-1 gap-4"
        }
      >
        <label htmlFor={`${prefix}-status`} className="flex flex-col gap-2 text-xs text-muted">
          <span>Estado</span>
          <select
            id={`${prefix}-status`}
            name="status"
            defaultValue={project.status}
            className="input-field min-h-11 rounded-md px-3 py-2 text-sm text-ink"
          >
            {ESTADOS_PROYECTO.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor={`${prefix}-progress`} className="flex flex-col gap-2 text-xs text-muted">
          <span>Avance %</span>
          <input
            id={`${prefix}-progress`}
            type="number"
            name="progress"
            min={0}
            max={100}
            defaultValue={project.progress}
            className="input-field min-h-11 rounded-md px-3 py-2 text-sm text-ink"
          />
        </label>
        <label htmlFor={`${prefix}-notes`} className="flex flex-col gap-2 text-xs text-muted">
          <span>Notas para el cliente</span>
          <textarea
            id={`${prefix}-notes`}
            name="notes"
            rows={view === "desktop" ? 1 : 3}
            maxLength={2000}
            defaultValue={project.notes || ""}
            placeholder="Opcional"
            className="input-field min-h-11 resize-y rounded-md px-3 py-2 text-sm text-ink"
          />
        </label>
      </div>
      <FormSubmitButton
        pendingLabel="Guardando..."
        className={`mt-3 min-h-11 rounded-lg px-4 py-2 font-mono text-xs text-teal hover:bg-teal/10 ${
          view === "mobile" ? "w-full" : ""
        }`}
      >
        Guardar cambios
      </FormSubmitButton>
    </form>
  );
}

function DeleteProject({ project, fullWidth = false }) {
  return (
    <form action={eliminarProyecto}>
      <input type="hidden" name="id" value={project.id} />
      <ConfirmSubmitButton
        message={`¿Eliminar el proyecto "${project.name}"? Esta acción no se puede deshacer.`}
        className={`min-h-11 rounded-lg px-3 py-2 font-mono text-xs text-red-400 hover:bg-red-400/10 ${
          fullWidth ? "w-full" : ""
        }`}
      >
        Eliminar proyecto
      </ConfirmSubmitButton>
    </form>
  );
}

function ProjectsList({ projects, hasClients, page, totalPages }) {
  if (projects.length === 0) {
    return (
      <div className="px-5 py-10 text-center">
        <p className="font-disp text-lg font-semibold">Todavía no hay proyectos</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          {hasClients
            ? "Completá el formulario de arriba para crear el primero y asignarlo a un cliente."
            : "Primero necesitás al menos un cliente activo para poder crear un proyecto."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.02]">
            <tr className="font-mono text-[11px] uppercase tracking-wide text-muted-2">
              <th scope="col" className="px-5 py-3">Proyecto</th>
              <th scope="col" className="px-5 py-3">Cliente</th>
              <th scope="col" className="px-5 py-3">Actualizar</th>
              <th scope="col" className="px-5 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-white/5 last:border-0">
                <th scope="row" className="max-w-52 break-words px-5 py-4 align-top font-medium">
                  {project.name}
                </th>
                <td className="max-w-52 px-5 py-4 align-top">
                  <ClientDetails client={project.client} />
                </td>
                <td className="px-5 py-4 align-top">
                  <ProjectEditor project={project} view="desktop" />
                </td>
                <td className="px-5 py-4 align-top">
                  <DeleteProject project={project} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-white/5 lg:hidden">
        {projects.map((project) => (
          <article key={project.id} className="p-4 sm:p-5">
            <h3 className="break-words font-disp text-lg font-semibold">
              {project.name}
            </h3>
            <div className="mt-2 border-b border-white/5 pb-4">
              <span className="font-mono text-[10px] uppercase tracking-wide text-muted-2">
                Cliente
              </span>
              <ClientDetails client={project.client} />
            </div>
            <div className="mt-4">
              <ProjectEditor project={project} view="mobile" />
            </div>
            <div className="mt-3 border-t border-white/5 pt-3">
              <DeleteProject project={project} fullWidth />
            </div>
          </article>
        ))}
      </div>
      <AdminPagination
        pathname="/admin/proyectos"
        page={page}
        totalPages={totalPages}
        paramName="projectPage"
        label="proyectos"
      />
    </>
  );
}

function parsePage(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export const dynamic = "force-dynamic";

export default async function ProyectosAdminPage({ searchParams }) {
  const params = await searchParams;
  const requestedPage = parsePage(params?.projectPage);
  const [projectCount, clientes] = await Promise.all([
    prisma.project.count(),
    prisma.user.findMany({
      where: { role: "CLIENTE", active: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(projectCount / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const proyectos = await prisma.project.findMany({
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      name: true,
      status: true,
      progress: true,
      notes: true,
      updatedAt: true,
      client: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const feedback = getFeedback(params);

  return (
    <div className="flex min-w-0 flex-col gap-8">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-teal">
          {"// Proyectos"}
        </span>
        <h1 className="font-disp mt-2 text-2xl font-semibold">
          Proyectos de clientes
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Los cambios de estado, avance y notas quedan disponibles para el
          cliente en su panel.
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

      <section className="card p-4 sm:p-6" aria-labelledby="create-project-title">
        <h2 id="create-project-title" className="font-disp text-lg font-semibold">
          Crear proyecto
        </h2>

        {clientes.length === 0 ? (
          <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <p className="text-sm text-muted">
              No hay clientes activos. Cuando exista una cuenta cliente activa,
              vas a poder asignarle un proyecto desde acá.
            </p>
            <Link
              href="/admin/usuarios"
              className="mt-3 inline-flex min-h-11 items-center rounded-lg px-3 py-2 font-mono text-xs text-teal hover:bg-teal/10"
            >
              Revisar usuarios
            </Link>
          </div>
        ) : (
          <form
            action={crearProyecto}
            className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <label htmlFor="project-name" className="flex flex-col gap-2 text-sm text-muted sm:col-span-2">
              <span>Nombre del proyecto</span>
              <input
                id="project-name"
                type="text"
                name="name"
                required
                maxLength={160}
                className="input-field min-h-11 rounded-md px-3 py-2 text-sm text-ink"
              />
            </label>
            <label htmlFor="project-client" className="flex flex-col gap-2 text-sm text-muted">
              <span>Cliente</span>
              <select
                id="project-client"
                name="clientId"
                required
                defaultValue=""
                className="input-field min-h-11 rounded-md px-3 py-2 text-sm text-ink"
              >
                <option value="" disabled>Elegir cliente</option>
                {clientes.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.email})
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="project-status" className="flex flex-col gap-2 text-sm text-muted">
              <span>Estado inicial</span>
              <select
                id="project-status"
                name="status"
                defaultValue="BACKLOG"
                className="input-field min-h-11 rounded-md px-3 py-2 text-sm text-ink"
              >
                {ESTADOS_PROYECTO.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
            <FormSubmitButton
              pendingLabel="Creando..."
              className="btn-primary min-h-11 rounded-lg px-4 py-2 font-mono text-sm font-medium sm:col-span-2 sm:w-fit xl:col-span-4"
            >
              Crear proyecto
            </FormSubmitButton>
          </form>
        )}
      </section>

      <section className="card overflow-hidden" aria-label="Listado de proyectos">
        <ProjectsList
          projects={proyectos}
          hasClients={clientes.length > 0}
          page={page}
          totalPages={totalPages}
        />
      </section>
    </div>
  );
}
