export default function AdminLoading() {
  return (
    <section
      aria-busy="true"
      aria-labelledby="admin-loading-status"
      className="space-y-6"
    >
      <p
        id="admin-loading-status"
        className="sr-only"
        role="status"
        aria-live="polite"
      >
        Cargando administración...
      </p>
      <div
        className="animate-pulse space-y-4 motion-reduce:animate-none"
        aria-hidden="true"
      >
        <div className="h-8 w-64 max-w-full rounded bg-white/10" />
        <div className="h-4 w-full max-w-lg rounded bg-white/10" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card h-32 p-4" />
          <div className="card h-32 p-4" />
        </div>
      </div>
    </section>
  );
}
