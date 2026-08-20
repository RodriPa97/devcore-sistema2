import { isPlaceholderSecret } from "@/lib/validation";

export function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Falta la variable de entorno requerida: ${name}`);
  }
  if (
    name === "DATABASE_URL" &&
    !value.startsWith("postgresql://") &&
    !value.startsWith("postgres://")
  ) {
    throw new Error("DATABASE_URL debe apuntar a una base PostgreSQL.");
  }
  return value;
}

export function requiredSecret(name) {
  const value = requiredEnv(name);
  if (isPlaceholderSecret(value)) {
    throw new Error(`${name} debe ser un secreto aleatorio de al menos 32 caracteres.`);
  }
  return value;
}
