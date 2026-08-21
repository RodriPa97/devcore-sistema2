"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";
import { recordAudit } from "@/lib/audit";
import {
  adminSchema,
  formDataObject,
  projectCreationSchema,
  projectUpdateSchema,
  roleChangeSchema,
} from "@/lib/validation";

const SERIALIZABLE = { isolationLevel: Prisma.TransactionIsolationLevel.Serializable };
const ADMIN_PATHS = new Set(["/admin/usuarios", "/admin/proyectos"]);

class AdminActionError extends Error {
  constructor(code) {
    super(code);
    this.name = "AdminActionError";
    this.code = code;
  }
}

function redirectAdmin(path, params) {
  if (!ADMIN_PATHS.has(path)) throw new Error("Ruta de administración inválida.");
  redirect(`${path}?${new URLSearchParams(params).toString()}`);
}

export async function cambiarRol(formData) {
  const actor = await requireAdmin();
  const parsed = roleChangeSchema.safeParse(formDataObject(formData));

  if (!parsed.success) {
    redirectAdmin("/admin/usuarios", { error: "invalid-role" });
  }

  const { userId, nuevoRol } = parsed.data;
  if (userId === actor.id && nuevoRol !== "ADMIN") {
    redirectAdmin("/admin/usuarios", { error: "self-role" });
  }

  let targetName;
  try {
    targetName = await prisma.$transaction(async (tx) => {
      const target = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, role: true, active: true },
      });

      if (!target) throw new AdminActionError("user-not-found");

      if (target.role === "ADMIN" && nuevoRol === "CLIENTE") {
        const adminCount = await tx.user.count({
          where: { role: "ADMIN", active: true },
        });
        if (adminCount <= 1) {
          throw new AdminActionError("last-admin");
        }
      }

      await tx.user.update({
        where: { id: userId },
        data: { role: nuevoRol, sessionVersion: { increment: 1 } },
      });

      await recordAudit({
        db: tx,
        actorId: actor.id,
        action: "ROLE_CHANGED",
        entity: "User",
        entityId: userId,
        metadata: { from: target.role, to: nuevoRol },
      });

      return target.name;
    }, SERIALIZABLE);
  } catch (error) {
    if (error instanceof AdminActionError) {
      redirectAdmin("/admin/usuarios", { error: error.code });
    }
    if (error?.code === "P2034") {
      redirectAdmin("/admin/usuarios", { error: "role-conflict" });
    }
    throw error;
  }

  revalidatePath("/admin/usuarios");
  redirectAdmin("/admin/usuarios", {
    success: "role-updated",
    subject: targetName,
  });
}

export async function crearAdmin(formData) {
  const actor = await requireAdmin();
  const parsed = adminSchema.safeParse(formDataObject(formData));

  if (!parsed.success) {
    redirectAdmin("/admin/usuarios", { error: "invalid-admin" });
  }

  const { name, email, password } = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      const passwordHash = await bcrypt.hash(password, 10);
      const admin = await tx.user.create({
        data: { name, email, passwordHash, role: "ADMIN" },
      });
      await recordAudit({
        db: tx,
        actorId: actor.id,
        action: "ADMIN_CREATED",
        entity: "User",
        entityId: admin.id,
      });
    });
  } catch (error) {
    if (error?.code === "P2002") {
      redirectAdmin("/admin/usuarios", { error: "email-exists" });
    }
    throw error;
  }

  revalidatePath("/admin/usuarios");
  redirectAdmin("/admin/usuarios", {
    success: "admin-created",
    subject: name,
  });
}

export async function crearProyecto(formData) {
  const actor = await requireAdmin();
  const parsed = projectCreationSchema.safeParse(formDataObject(formData));

  if (!parsed.success) {
    redirectAdmin("/admin/proyectos", { error: "invalid-project" });
  }

  const { name, clientId, status } = parsed.data;
  const client = await prisma.user.findUnique({
    where: { id: clientId },
    select: { id: true, role: true, active: true },
  });

  if (!client || client.role !== "CLIENTE" || !client.active) {
    redirectAdmin("/admin/proyectos", { error: "invalid-client" });
  }

  let project;
  try {
    project = await prisma.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: { name, clientId, status, progress: 0 },
      });
      await recordAudit({
        db: tx,
        actorId: actor.id,
        action: "PROJECT_CREATED",
        entity: "Project",
        entityId: created.id,
        metadata: { clientId, status },
      });
      return created;
    });
  } catch (error) {
    if (error?.code === "P2003") {
      redirectAdmin("/admin/proyectos", { error: "invalid-client" });
    }
    throw error;
  }

  revalidatePath("/admin/proyectos");
  revalidatePath("/panel");
  redirectAdmin("/admin/proyectos", {
    success: "project-created",
    subject: project.name,
  });
}

export async function actualizarProyecto(formData) {
  const actor = await requireAdmin();
  const raw = formDataObject(formData);
  const parsed = projectUpdateSchema.safeParse(raw);

  if (!parsed.success) {
    redirectAdmin("/admin/proyectos", { error: "invalid-update" });
  }

  const { id, status, progress, notes, updatedAt } = parsed.data;

  let projectName;
  try {
    projectName = await prisma.$transaction(async (tx) => {
      const previous = await tx.project.findUnique({
        where: { id },
        select: {
          name: true,
          status: true,
          progress: true,
          notes: true,
          updatedAt: true,
        },
      });
      if (!previous) throw new AdminActionError("project-not-found");
      if (previous.updatedAt.getTime() !== new Date(updatedAt).getTime()) {
        throw new AdminActionError("stale-project");
      }

      await tx.project.update({
        where: { id },
        data: { status, progress, notes: notes || null },
      });
      await recordAudit({
        db: tx,
        actorId: actor.id,
        action: "PROJECT_UPDATED",
        entity: "Project",
        entityId: id,
        metadata: {
          from: {
            status: previous.status,
            progress: previous.progress,
            notes: previous.notes,
          },
          to: { status, progress, notes: notes || null },
        },
      });

      return previous.name;
    });
  } catch (error) {
    if (error instanceof AdminActionError) {
      redirectAdmin("/admin/proyectos", { error: error.code });
    }
    if (error?.code === "P2025") {
      redirectAdmin("/admin/proyectos", { error: "project-not-found" });
    }
    throw error;
  }

  revalidatePath("/admin/proyectos");
  revalidatePath("/panel");
  redirectAdmin("/admin/proyectos", {
    success: "project-updated",
    subject: projectName,
  });
}

export async function eliminarProyecto(formData) {
  const actor = await requireAdmin();
  const id = formData.get("id")?.toString().trim();
  if (!id || id.length > 100) {
    redirectAdmin("/admin/proyectos", { error: "invalid-delete" });
  }

  let projectName;
  try {
    projectName = await prisma.$transaction(async (tx) => {
      const project = await tx.project.findUnique({
        where: { id },
        select: { name: true, clientId: true },
      });
      if (!project) throw new AdminActionError("project-not-found");

      await tx.project.delete({ where: { id } });
      await recordAudit({
        db: tx,
        actorId: actor.id,
        action: "PROJECT_DELETED",
        entity: "Project",
        entityId: id,
        metadata: project,
      });

      return project.name;
    });
  } catch (error) {
    if (error instanceof AdminActionError || error?.code === "P2025") {
      redirectAdmin("/admin/proyectos", { error: "project-not-found" });
    }
    throw error;
  }

  revalidatePath("/admin/proyectos");
  revalidatePath("/panel");
  redirectAdmin("/admin/proyectos", {
    success: "project-deleted",
    subject: projectName,
  });
}
