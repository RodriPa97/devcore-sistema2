"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegistroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        setError("No pudimos procesar la respuesta. Probá de nuevo.");
        return;
      }

      if (!res.ok) {
        setError(data.error || "No se pudo crear la cuenta.");
        return;
      }

      router.replace("/login?registered=1");
    } catch {
      setError("No se pudo conectar con el servidor. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh justify-center overflow-y-auto px-4 py-6 sm:px-6">
      <div className="card my-auto w-full max-w-sm p-5 sm:p-8">
        <span className="font-mono text-xs uppercase tracking-widest text-teal">
           {"// Crear cuenta"}
        </span>
        <h1 className="font-disp mt-2 text-2xl font-semibold">Registro</h1>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4"
          aria-busy={loading}
        >
          <div>
            <label htmlFor="register-name" className="mb-1 block text-xs text-muted">
              Nombre
            </label>
            <input
              id="register-name"
              type="text"
              required
              maxLength={120}
              autoComplete="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "register-error" : undefined}
              className="input-field w-full rounded-md px-3 py-2 text-sm"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label htmlFor="register-email" className="mb-1 block text-xs text-muted">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "register-error" : undefined}
              className="input-field w-full rounded-md px-3 py-2 text-sm"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label htmlFor="register-password" className="mb-1 block text-xs text-muted">
              Contraseña
            </label>
            <input
              id="register-password"
              type="password"
              required
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "register-error" : undefined}
              className="input-field w-full rounded-md px-3 py-2 text-sm"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          {error && (
            <p id="register-error" className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            aria-live="polite"
            className="btn-primary mt-2 rounded-lg px-4 py-3 font-mono text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-teal">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
