"use client";

import { SessionProvider } from "next-auth/react";

// next-auth necesita este "contexto" de React para que signIn/signOut y
// useSession funcionen en los componentes de cliente (formularios, etc).
export function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
