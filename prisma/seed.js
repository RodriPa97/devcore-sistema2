// Este script crea (o actualiza) el usuario administrador inicial, usando
// el email y contraseña que pusiste en tu archivo ".env".
// Se corre con: npm run seed

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@devcore.com";
  const password = process.env.ADMIN_PASSWORD || "CambiarEsta123!";
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", passwordHash },
    create: {
      name: "Administrador DevCore",
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Usuario administrador listo:");
  console.log("  Email:   " + admin.email);
  console.log("  Rol:     " + admin.role);
  console.log("  (La contraseña es la que pusiste en ADMIN_PASSWORD en tu .env)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
