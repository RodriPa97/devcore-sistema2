import Link from "next/link";

export default function NoAutorizadoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-red-400">
        // Acceso restringido
      </span>
      <h1 className="font-disp text-2xl font-semibold">
        No tenés permiso para ver esta sección
      </h1>
      <p className="max-w-sm text-sm text-muted">
        Esta parte del sistema es solo para administradores. Si pensás que
        esto es un error, contactate con quien administra el sistema.
      </p>
      <Link href="/" className="text-teal text-sm">
        Volver al inicio
      </Link>
    </main>
  );
}
