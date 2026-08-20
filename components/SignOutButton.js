"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="font-mono text-xs text-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
    >
      Cerrar sesión
    </button>
  );
}
