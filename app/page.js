import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-teal">
        // DevCore — Sistema de gestión
      </span>
      <h1 className="font-disp text-3xl font-semibold sm:text-4xl">
        Panel interno de DevCore
      </h1>
      <p className="max-w-md text-sm text-muted">
        Ingresá con tu cuenta o registrate para empezar a usar el sistema.
      </p>
      <div className="flex gap-3">
        <Link
          href="/login"
          className="btn-primary rounded-lg px-6 py-3 font-mono text-sm font-medium"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/registro"
          className="card rounded-lg px-6 py-3 font-mono text-sm font-medium"
        >
          Crear cuenta
        </Link>
      </div>
    </main>
  );
}
