"use client";

import { useEffect, useState, useCallback } from "react";
import { estadoInfo } from "@/lib/estadosProyecto";

// Se actualiza solo cada 5 segundos, consultando /api/mis-proyectos. No es
// un "tiempo real" instantáneo con websockets (eso pide otra
// infraestructura aparte), pero para este caso de uso — ver cómo avanza
// tu proyecto — alcanza de sobra: si un admin cambia algo, en menos de 5
// segundos ya se ve reflejado acá sin que el cliente tenga que recargar.
const INTERVALO_MS = 5000;

export function ProjectsBoard() {
  const [proyectos, setProyectos] = useState(null);
  const [error, setError] = useState("");
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

  const cargar = useCallback(async () => {
    try {
      const res = await fetch("/api/mis-proyectos", { cache: "no-store" });
      if (!res.ok) {
        setError("No se pudo cargar tus proyectos.");
        return;
      }
      const data = await res.json();
      setProyectos(data.proyectos || []);
      setUltimaActualizacion(new Date());
      setError("");
    } catch {
      setError("No se pudo conectar con el servidor.");
    }
  }, []);

  useEffect(() => {
    cargar();
    const id = setInterval(cargar, INTERVALO_MS);
    return () => clearInterval(id);
  }, [cargar]);

  if (proyectos === null && !error) {
    return <p className="text-sm text-muted">Cargando tus proyectos...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (proyectos.length === 0) {
    return (
      <div className="card p-6 text-sm text-muted">
        Todavía no tenés ningún proyecto cargado. Cuando el equipo de
        DevCore empiece a trabajar en el tuyo, va a aparecer acá
        automáticamente.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {proyectos.map((p) => {
          const estado = estadoInfo(p.status);
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

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${p.progress}%`,
                    background:
                      "linear-gradient(120deg, #8FE23A 0%, #2FCBA6 55%, #17B8A6 100%)",
                  }}
                />
              </div>
              <p className="mt-1 font-mono text-[11px] text-muted-2">
                {p.progress}% completado
              </p>

              {p.notes && (
                <p className="mt-3 text-sm text-muted">{p.notes}</p>
              )}
            </div>
          );
        })}
      </div>

      <p className="font-mono text-[11px] text-muted-2">
        {ultimaActualizacion
          ? `Actualizado a las ${ultimaActualizacion.toLocaleTimeString()} — se refresca solo cada 5 segundos.`
          : ""}
      </p>
    </div>
  );
}
