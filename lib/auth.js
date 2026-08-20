import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/validation";
import { enforceRateLimit } from "@/lib/rateLimit";
import { requiredSecret } from "@/lib/env";

const DUMMY_PASSWORD_HASH =
  "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

// Configuración central de autenticación (NextAuth). Se usa tanto en la
// ruta de la API (app/api/auth/[...nextauth]/route.js) como en cualquier
// lugar del servidor donde necesitemos leer la sesión actual
// (getServerSession(authOptions)).
export const authOptions = {
  secret: requiredSecret("NEXTAUTH_SECRET"),
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials, request) {
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string"
        ) {
          return null;
        }

        const email = normalizeEmail(credentials.email);
        if (!email || email.length > 254) return null;

        const header = (name) =>
          request?.headers?.get?.(name) ?? request?.headers?.[name];
        const forwarded = header("x-forwarded-for");
        const ip =
          (Array.isArray(forwarded) ? forwarded[0] : forwarded)
            ?.split(",")[0]
            ?.trim() ||
          header("x-real-ip") ||
          "unknown";
        const rate = await enforceRateLimit({
          key: `login:${ip}:${email}`,
          limit: 10,
          window: "15 m",
          windowMs: 15 * 60 * 1000,
        });
        if (!rate.success) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            passwordHash: true,
            role: true,
            active: true,
            sessionVersion: true,
          },
        });

        const passwordOk = await bcrypt.compare(
          credentials.password,
          user?.passwordHash || DUMMY_PASSWORD_HASH
        );

        if (!user || !user.active || !passwordOk) {
          return null;
        }

        // Lo que devolvemos acá termina en el token/sesión (ver callbacks).
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          sessionVersion: user.sessionVersion,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.sessionVersion = user.sessionVersion;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.sessionVersion = token.sessionVersion;
      }
      return session;
    },
  },
};
