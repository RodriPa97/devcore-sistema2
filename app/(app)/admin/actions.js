"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// "Server action": corre en el servidor, nunca en el navegador del
// usuario. La verificación de rol se hace acá también (no solo en el
// middleware), porque esta función se podría llamar directamente sin
// pasar por una página protegida.
export async function cambiarRol(formData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("No autorizado.");
  }

  const userId = formData.get("userId");
  const nuevoRol = formData.get("nuevoRol");

  if (!userId || (nuevoRol !== "ADMIN" && nuevoRol !== "CLIENTE")) {
    throw new Error("Datos inválidos.");
  }

  // Evita que un admin se saque el rol de admin a sí mismo por error y se
  // quede afuera del panel sin querer.
  if (userId === session.user.id && nuevoRol !== "ADMIN") {
    throw new Error("No podés quitarte tu propio rol de administrador.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: nuevoRol },
  });

  revalidatePath("/admin/usuarios");
}

// Crea directamente un usuario con rol ADMIN, sin pasar por el registro
// público. Solo lo puede usar alguien que ya es admin.
export async function crearAdmin(formData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("No autorizado.");
  }

  const name = (formData.get("name") || "").toString().trim();
  const email = (formData.get("email") || "").toString().toLowerCase().trim();
  const password = (formData.get("password") || "").toString();

  if (!name || !email || !password) {
    redirect(
      "/admin/usuarios?error=" +
        encodeURIComponent("Completá nombre, email y contraseña.")
    );
  }

  if (password.length < 8) {
    redirect(
      "/admin/usuarios?error=" +
        encodeURIComponent("La contraseña tiene que tener al menos 8 caracteres.")
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect(
      "/admin/usuarios?error=" +
        encodeURIComponent("Ya existe una cuenta con ese email.")
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, passwordHash, role: "ADMIN" },
  });

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?ok=1");
}

const ESTADOS_VALIDOS = ["BACKLOG", "EN_CURSO", "EN_REVISION", "ENTREGADO"];

// Crea un proyecto nuevo asignado a un cliente. Solo admins.
export async function crearProyecto(formData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("No autorizado.");
  }

  const name = (formData.get("name") || "").toString().trim();
  const clientId = (formData.get("clientId") || "").toString();
  const status = (formData.get("status") || "BACKLOG").toString();

  if (!name || !clientId) {
    redirect(
      "/admin/proyectos?error=" +
        encodeURIComponent("Completá el nombre del proyecto y elegí un cliente.")
    );
  }

  if (!ESTADOS_VALIDOS.includes(status)) {
    throw new Error("Estado inválido.");
  }

  const cliente = await prisma.user.findUnique({ where: { id: clientId } });
  if (!cliente) {
    redirect(
      "/admin/proyectos?error=" + encodeURIComponent("Ese cliente no existe.")
    );
  }

  await prisma.project.create({
    data: { name, clientId, status, progress: 0 },
  });

  revalidatePath("/admin/proyectos");
  redirect("/admin/proyectos?ok=1");
}

// Actualiza el estado / avance / notas de un proyecto existente. Solo
// admins. El cliente dueño del proyecto lo ve reflejado automáticamente
// en /panel (esa pantalla vuelve a pedir los datos cada pocos segundos).
export async function actualizarProyecto(formData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("No autorizado.");
  }

  const id = (formData.get("id") || "").toString();
  const status = (formData.get("status") || "").toString();
  let progress = parseInt(formData.get("progress"), 10);
  const notes = (formData.get("notes") || "").toString().trim();

  if (!id || !ESTADOS_VALIDOS.includes(status)) {
    throw new Error("Datos inválidos.");
  }

  if (Number.isNaN(progress)) progress = 0;
  progress = Math.max(0, Math.min(100, progress));

  await prisma.project.update({
    where: { id },
    data: { status, progress, notes: notes || null },
  });

  revalidatePath("/admin/proyectos");
  revalidatePath("/panel");
}

// Elimina un proyecto. Solo admins.
export async function eliminarProyecto(formData) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("No autorizado.");
  }

  const id = (formData.get("id") || "").toString();
  if (!id) {
    throw new Error("Datos inválidos.");
  }

  await prisma.project.delete({ where: { id } });

  revalidatePath("/admin/proyectos");
  revalidatePath("/panel");
}
