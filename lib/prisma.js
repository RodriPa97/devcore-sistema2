// Un solo cliente de Prisma reutilizado en toda la app (evita abrir
// demasiadas conexiones a la base de datos durante el desarrollo, cuando
// Next.js recarga el código en caliente).
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
