import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  active: true,
  sessionVersion: true,
};

export class UnauthorizedError extends Error {
  constructor() {
    super("No autorizado.");
    this.name = "UnauthorizedError";
  }
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;

  if (!sessionUser?.id || sessionUser.sessionVersion === undefined) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: userSelect,
  });

  if (
    !user ||
    !user.active ||
    user.sessionVersion !== sessionUser.sessionVersion
  ) {
    return null;
  }

  return user;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError();
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new UnauthorizedError();
  }
  return user;
}
