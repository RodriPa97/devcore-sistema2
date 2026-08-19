"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
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
