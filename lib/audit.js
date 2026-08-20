import { prisma } from "@/lib/prisma";

export async function recordAudit({
  db = prisma,
  actorId,
  action,
  entity,
  entityId,
  metadata,
}) {
  return db.auditLog.create({
    data: {
      actorId: actorId || null,
      action,
      entity,
      entityId: entityId || null,
      metadata,
    },
  });
}
