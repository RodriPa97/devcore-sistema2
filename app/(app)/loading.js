export default function AppLoading() {
  return (
    <main
      className="mx-auto min-h-dvh w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10"
      aria-busy="true"
      aria-labelledby="app-loading-status"
    >
      <p
        id="app-loading-status"
        className="sr-only"
        role="status"
        aria-live="polite"
      >
        Cargando contenido...
      </p>
      <div
        className="animate-pulse space-y-6 motion-reduce:animate-none"
        aria-hidden="true"
      >
        <div className="h-3 w-32 rounded bg-white/10" />
        <div className="h-8 w-64 max-w-full rounded bg-white/10" />
        <div className="h-4 w-full max-w-xl rounded bg-white/10" />
        <div className="card space-y-4 p-4 sm:p-6">
          <div className="h-6 w-2/3 rounded bg-white/10" />
          <div className="h-2 w-full rounded-full bg-white/10" />
          <div className="h-3 w-24 rounded bg-white/10" />
        </div>
      </div>
    </main>
  );
}
