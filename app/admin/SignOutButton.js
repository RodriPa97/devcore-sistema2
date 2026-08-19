"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="font-mono text-xs text-muted hover:text-ink"
    >
      Cerrar sesión
    </button>
  );
}
