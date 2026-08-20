"use client";

export default function AppError({ reset }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm text-red-300" role="alert">
        Ocurrió un error inesperado.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="btn-primary rounded-lg px-4 py-2 font-mono text-sm"
      >
        Reintentar
      </button>
    </main>
  );
}
