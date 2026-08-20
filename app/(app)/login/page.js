"use client";

import { Suspense, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Si el middleware nos mandó acá porque intentaste entrar a una página
  // protegida (por ejemplo /admin/usuarios), "callbackUrl" trae esa
  // dirección y volvemos ahí después de loguearte. Si no hay ninguna
  // (entraste al login directamente), decidimos el destino según el rol
  // una vez que sabemos quién sos: los admins van a /admin, los clientes
  // a /panel.
  const callbackUrlExplicito = searchParams.get("callbackUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      setError("Email o contraseña incorrectos.");
      return;
    }

    let destino = callbackUrlExplicito;
    if (!destino) {
      const session = await getSession();
      destino = session?.user?.role === "ADMIN" ? "/admin" : "/panel";
    }

    setLoading(false);
    router.push(destino);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="card w-full max-w-sm p-8">
        <span className="font-mono text-xs uppercase tracking-widest text-teal">
          // Acceso
        </span>
        <h1 className="font-disp mt-2 text-2xl font-semibold">
          Iniciar sesión
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs text-muted">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full rounded-md px-3 py-2 text-sm"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full rounded-md px-3 py-2 text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2 rounded-lg px-4 py-3 font-mono text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          ¿No tenés cuenta?{" "}
          <Link href="/registro" className="text-teal">
            Registrate acá
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
