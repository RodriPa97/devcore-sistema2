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

function redirectError(path, message) {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function cambiarRol(formData) {
  const actor = await requireAdmin();
  const parsed = roleChangeSchema.safeParse(formDataObject(formData));

  if (!parsed.success) throw new Error("Datos inválidos.");

  const { userId, nuevoRol } = parsed.data;
  if (userId === actor.id && nuevoRol !== "ADMIN") {
    throw new Error("No podés quitarte tu propio rol de administrador.");
  }

  await prisma.$transaction(async (tx) => {
    const target = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, active: true },
    });

    if (!target) throw new Error("El usuario no existe.");

    if (target.role === "ADMIN" && nuevoRol === "CLIENTE") {
      const adminCount = await tx.user.count({
        where: { role: "ADMIN", active: true },
      });
      if (adminCount <= 1) {
        throw new Error("Debe quedar al menos un administrador activo.");
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
  }, SERIALIZABLE);

  revalidatePath("/admin/usuarios");
}

export async function crearAdmin(formData) {
  const actor = await requireAdmin();
  const parsed = adminSchema.safeParse(formDataObject(formData));

  if (!parsed.success) {
    redirectError("/admin/usuarios", "Revisá nombre, email y contraseña.");
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
      redirectError("/admin/usuarios", "Ya existe una cuenta con ese email.");
    }
    throw error;
  }

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?ok=1");
}

export async function crearProyecto(formData) {
  const actor = await requireAdmin();
  const parsed = projectCreationSchema.safeParse(formDataObject(formData));

  if (!parsed.success) {
    redirectError("/admin/proyectos", "Revisá el nombre, cliente y estado.");
  }

  const { name, clientId, status } = parsed.data;
  const client = await prisma.user.findUnique({
    where: { id: clientId },
    select: { id: true, role: true, active: true },
  });

  if (!client || client.role !== "CLIENTE" || !client.active) {
    redirectError("/admin/proyectos", "Elegí un cliente activo válido.");
  }

  const project = await prisma.$transaction(async (tx) => {
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

  revalidatePath("/admin/proyectos");
  revalidatePath("/panel");
  redirect(`/admin/proyectos?ok=1&project=${encodeURIComponent(project.id)}`);
}

export async function actualizarProyecto(formData) {
  const actor = await requireAdmin();
  const raw = formDataObject(formData);
  const parsed = projectUpdateSchema.safeParse(raw);

  if (!parsed.success) throw new Error("Datos inválidos.");

  const { id, status, progress, notes, updatedAt } = parsed.data;

  await prisma.$transaction(async (tx) => {
    const previous = await tx.project.findUnique({
      where: { id },
      select: { status: true, progress: true, notes: true, updatedAt: true },
    });
    if (!previous) throw new Error("El proyecto no existe.");
    if (previous.updatedAt.getTime() !== new Date(updatedAt).getTime()) {
      throw new Error("El proyecto cambió mientras lo editabas. Recargá la página.");
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
  });

  revalidatePath("/admin/proyectos");
  revalidatePath("/panel");
}

export async function eliminarProyecto(formData) {
  const actor = await requireAdmin();
  const id = formData.get("id")?.toString().trim();
  if (!id) throw new Error("Datos inválidos.");

  await prisma.$transaction(async (tx) => {
    const project = await tx.project.findUnique({
      where: { id },
      select: { name: true, clientId: true },
    });
    if (!project) throw new Error("El proyecto no existe.");

    await tx.project.delete({ where: { id } });
    await recordAudit({
      db: tx,
      actorId: actor.id,
      action: "PROJECT_DELETED",
      entity: "Project",
      entityId: id,
      metadata: project,
    });
  });

  revalidatePath("/admin/proyectos");
  revalidatePath("/panel");
}
