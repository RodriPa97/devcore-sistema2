import { z } from "zod";
import { PROJECT_STATUS_VALUES } from "@/lib/estadosProyecto";

export const ROLES = ["ADMIN", "CLIENTE"];
export const PROJECT_STATUSES = PROJECT_STATUS_VALUES;

const name = z.string().trim().min(1).max(120);
const email = z.string().trim().toLowerCase().email().max(254);
const password = z.string().min(8).max(72);
const projectName = z.string().trim().min(1).max(160);
const notes = z.string().trim().max(2000);

export const registrationSchema = z.object({
  name,
  email,
  password,
});

export const adminSchema = z.object({
  name,
  email,
  password: z.string().min(12).max(72),
});

export const projectCreationSchema = z.object({
  name: projectName,
  clientId: z.string().trim().min(1).max(100),
  status: z.enum(PROJECT_STATUSES).default("BACKLOG"),
});

export const projectUpdateSchema = z.object({
  id: z.string().trim().min(1).max(100),
  status: z.enum(PROJECT_STATUSES),
  progress: z.coerce.number().int().min(0).max(100),
  notes,
  updatedAt: z.string().datetime(),
});

export const roleChangeSchema = z.object({
  userId: z.string().trim().min(1).max(100),
  nuevoRol: z.enum(ROLES),
});

export function formDataObject(formData) {
  return Object.fromEntries(formData.entries());
}

export function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function isPlaceholderSecret(value) {
  if (!value) return true;

  const normalized = value.trim().toLowerCase();
  return (
    normalized.length < 32 ||
    normalized.includes("cambiar") ||
    normalized.includes("replace") ||
    normalized.includes("example")
  );
}
