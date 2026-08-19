import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Configuración central de autenticación (NextAuth). Se usa tanto en la
// ruta de la API (app/api/auth/[...nextauth]/route.js) como en cualquier
// lugar del servidor donde necesitemos leer la sesión actual
// (getServerSession(authOptions)).
export const authOptions = {
  session: {
    strategy: "jwt",
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user) {
          return null;
        }

        const passwordOk = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!passwordOk) {
          return null;
        }

        // Lo que devolvemos acá termina en el token/sesión (ver callbacks).
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // "user" solo viene definido en el momento del login; lo guardamos
      // en el token para no tener que consultar la base de datos en cada
      // request.
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
};
