// Este script crea el usuario administrador inicial, usando las variables
// explícitas de tu archivo ".env". No sobrescribe cuentas existentes.
// Se corre con: npm run seed

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";

  if (
    !email ||
    !email.includes("@") ||
    password.length < 12 ||
    /cambiar|replace|example/i.test(password)
  ) {
    throw new Error(
      "ADMIN_EMAIL y ADMIN_PASSWORD son obligatorios; la contraseña debe ser aleatoria y tener al menos 12 caracteres."
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (existing.role !== "ADMIN") {
      throw new Error(
        "La cuenta indicada ya existe como CLIENTE. No se promoverá automáticamente desde el seed."
      );
    }
    console.log(`El administrador ${email} ya existe; no se modificó.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      name: "Administrador DevCore",
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Usuario administrador listo:");
  console.log("  Email:   " + admin.email);
  console.log("  Rol:     " + admin.role);
  console.log("  La contraseña se leyó desde ADMIN_PASSWORD y no se imprime.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
