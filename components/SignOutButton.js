"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);

    try {
      await signOut({ callbackUrl: "/" });
    } catch {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending}
      aria-busy={pending}
      aria-live="polite"
      className="min-h-11 shrink-0 rounded-md px-3 font-mono text-xs text-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Cerrando sesión..." : "Cerrar sesión"}
    </button>
  );
}
