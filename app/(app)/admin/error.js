"use client";

export default function AdminError({ reset }) {
  return (
    <div className="card flex flex-col gap-4 p-6">
      <p className="text-sm text-red-300" role="alert">
        No se pudo cargar esta sección.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="btn-primary w-fit rounded-lg px-4 py-2 font-mono text-sm"
      >
        Reintentar
      </button>
    </div>
  );
}
