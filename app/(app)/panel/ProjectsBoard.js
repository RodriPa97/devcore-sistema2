"use client";

import { useEffect, useState } from "react";
import { estadoInfo } from "@/lib/estadosProyecto";

const INTERVALO_MS = 15000;

export function ProjectsBoard() {
  const [proyectos, setProyectos] = useState(null);
  const [error, setError] = useState("");
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let timer;
    let controller;

    async function cargar() {
      if (document.hidden) return;

      controller?.abort();
      controller = new AbortController();

      try {
        const res = await fetch("/api/mis-proyectos", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          if (mounted) setError("No se pudo cargar tus proyectos.");
          return;
        }

        const data = await res.json();
        if (!mounted) return;

        setProyectos(data.proyectos || []);
        setUltimaActualizacion(new Date());
        setError("");
      } catch (requestError) {
        if (requestError.name !== "AbortError" && mounted) {
          setError("No se pudo conectar con el servidor.");
        }
      } finally {
        if (mounted && !document.hidden) {
          timer = window.setTimeout(cargar, INTERVALO_MS);
        }
        if (mounted) setLoading(false);
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        window.clearTimeout(timer);
        controller?.abort();
      } else {
        cargar();
      }
    }

    cargar();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      mounted = false;
      window.clearTimeout(timer);
      controller?.abort();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  function retry() {
    window.location.reload();
  }

  if (loading && proyectos === null) {
    return <p className="text-sm text-muted">Cargando tus proyectos...</p>;
  }

  if (error && proyectos === null) {
    return (
      <div className="flex flex-col items-start gap-3" role="alert">
        <p className="text-sm text-red-400">{error}</p>
        <button
          type="button"
          onClick={retry}
          className="font-mono text-xs text-teal hover:underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (proyectos.length === 0) {
    return (
      <div className="card p-6 text-sm text-muted">
        Todavía no tenés ningún proyecto cargado. Cuando el equipo de DevCore
        empiece a trabajar en el tuyo, va a aparecer acá automáticamente.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p className="text-sm text-amber-300" role="status">
          No se pudo actualizar. Mostrando la última información disponible.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {proyectos.map((p) => {
          const estado = estadoInfo(p.status);
          const progress = Math.max(0, Math.min(100, Number(p.progress) || 0));
          const progressId = `progress-${p.id}`;

          return (
            <div key={p.id} className="card p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-disp text-lg font-semibold">{p.name}</h3>
                <span
                  className={
                    "rounded-md px-2 py-1 font-mono text-[10.5px] uppercase " +
                    estado.badgeClass
                  }
                >
                  {estado.label}
                </span>
              </div>

              <div
                className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-label={`Avance de ${p.name}`}
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-describedby={progressId}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background:
                      "linear-gradient(120deg, #8FE23A 0%, #2FCBA6 55%, #17B8A6 100%)",
                  }}
                />
              </div>
              <p id={progressId} className="mt-1 font-mono text-[11px] text-muted-2">
                {progress}% completado
              </p>

              {p.notes && <p className="mt-3 text-sm text-muted">{p.notes}</p>}
            </div>
          );
        })}
      </div>

      <p className="font-mono text-[11px] text-muted-2">
        {ultimaActualizacion
          ? `Actualizado a las ${ultimaActualizacion.toLocaleTimeString()} - se refresca cada 15 segundos mientras la pestaña está activa.`
          : ""}
      </p>
    </div>
  );
}
