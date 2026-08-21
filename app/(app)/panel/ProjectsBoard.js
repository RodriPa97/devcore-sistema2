"use client";

import { useEffect, useRef, useState } from "react";
import { estadoInfo } from "@/lib/estadosProyecto";

const INTERVALO_MS = 15000;

function proyectosIguales(actuales, siguientes) {
  if (!actuales || actuales.length !== siguientes.length) return false;

  return actuales.every((proyecto, index) => {
    const siguiente = siguientes[index];
    return (
      proyecto.id === siguiente.id &&
      proyecto.name === siguiente.name &&
      proyecto.status === siguiente.status &&
      proyecto.progress === siguiente.progress &&
      proyecto.notes === siguiente.notes
    );
  });
}

export function ProjectsBoard() {
  const [proyectos, setProyectos] = useState(null);
  const [error, setError] = useState("");
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const proyectosRef = useRef(null);
  const retryRef = useRef(null);

  useEffect(() => {
    let activo = true;
    let timer = null;
    let controller = null;
    let solicitudActiva = false;
    let solicitudPendiente = false;

    function cancelarTimer() {
      if (timer !== null) {
        window.clearTimeout(timer);
        timer = null;
      }
    }

    function programarSiguiente() {
      cancelarTimer();
      if (!activo || document.hidden) return;

      timer = window.setTimeout(() => {
        timer = null;
        void cargar();
      }, INTERVALO_MS);
    }

    async function cargar() {
      cancelarTimer();
      if (!activo || document.hidden) return;
      if (solicitudActiva) {
        solicitudPendiente = true;
        return;
      }

      solicitudActiva = true;
      solicitudPendiente = false;
      controller = new AbortController();
      const controllerActual = controller;

      if (proyectosRef.current === null) setLoading(true);

      try {
        const res = await fetch("/api/mis-proyectos", {
          cache: "no-store",
          signal: controllerActual.signal,
        });

        if (!res.ok) {
          if (activo) setError("No se pudo cargar tus proyectos.");
          return;
        }

        const data = await res.json();
        if (!activo) return;
        if (!Array.isArray(data.proyectos)) {
          throw new Error("Respuesta de proyectos inválida");
        }

        if (!proyectosIguales(proyectosRef.current, data.proyectos)) {
          proyectosRef.current = data.proyectos;
          setProyectos(data.proyectos);
          setUltimaActualizacion(new Date());
        }
        setError("");
      } catch (requestError) {
        if (requestError.name !== "AbortError" && activo) {
          setError("No se pudo conectar con el servidor.");
        }
      } finally {
        if (controller === controllerActual) controller = null;
        solicitudActiva = false;

        if (!activo) return;

        if (solicitudPendiente && !document.hidden) {
          solicitudPendiente = false;
          void cargar();
        } else {
          setLoading(false);
          programarSiguiente();
        }
      }
    }

    function solicitarAhora() {
      cancelarTimer();
      solicitudPendiente = true;

      if (!solicitudActiva) {
        void cargar();
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        solicitudPendiente = false;
        cancelarTimer();
        controller?.abort();
      } else {
        solicitarAhora();
      }
    }

    retryRef.current = solicitarAhora;
    solicitarAhora();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      activo = false;
      retryRef.current = null;
      cancelarTimer();
      controller?.abort();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  function retry() {
    retryRef.current?.();
  }

  if (loading && proyectos === null) {
    return (
      <p
        className="text-sm text-muted"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        Cargando tus proyectos...
      </p>
    );
  }

  if (error && proyectos === null) {
    return (
      <div className="flex flex-col items-start gap-3" role="alert">
        <p className="text-sm text-red-400">{error}</p>
        <button
          type="button"
          onClick={retry}
          className="min-h-11 rounded-md px-3 font-mono text-xs text-teal hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (proyectos.length === 0) {
    return (
      <div className="card p-4 text-sm text-muted sm:p-6">
        Todavía no tenés ningún proyecto cargado. Cuando el equipo de DevCore
        empiece a trabajar en el tuyo, va a aparecer acá automáticamente.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p className="text-sm text-amber-300" role="status" aria-live="polite">
          No se pudo actualizar. Mostrando la última información disponible.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {proyectos.map((p) => {
          const estado = estadoInfo(p.status);
          const progress = Math.max(0, Math.min(100, Number(p.progress) || 0));
          const progressId = `progress-${p.id}`;

          return (
            <div key={p.id} className="card min-w-0 p-4 sm:p-6">
              <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:justify-between">
                <h3 className="font-disp min-w-0 max-w-full break-words text-lg font-semibold [overflow-wrap:anywhere]">
                  {p.name}
                </h3>
                <span
                  className={
                    "shrink-0 rounded-md px-2 py-1 font-mono text-[10.5px] uppercase " +
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

              {p.notes && (
                <p className="mt-3 whitespace-pre-wrap break-words text-sm text-muted [overflow-wrap:anywhere]">
                  {p.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="font-mono text-[11px] text-muted-2" role="status">
        {ultimaActualizacion
          ? `Actualizado a las ${ultimaActualizacion.toLocaleTimeString()} - se refresca cada 15 segundos mientras la pestaña está activa.`
          : ""}
      </p>
    </div>
  );
}
