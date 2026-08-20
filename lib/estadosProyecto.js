export const PROJECT_STATUS_VALUES = [
  "BACKLOG",
  "EN_CURSO",
  "EN_REVISION",
  "ENTREGADO",
];

export const ESTADOS_PROYECTO = [
  { value: "BACKLOG", label: "Backlog", badgeClass: "bg-white/10 text-muted" },
  { value: "EN_CURSO", label: "En curso", badgeClass: "bg-teal/10 text-teal" },
  {
    value: "EN_REVISION",
    label: "En revisión",
    badgeClass: "bg-yellow-400/10 text-yellow-300",
  },
  { value: "ENTREGADO", label: "Entregado", badgeClass: "bg-lime/10 text-lime" },
];

export function estadoInfo(value) {
  return (
    ESTADOS_PROYECTO.find((e) => e.value === value) || {
      label: "Estado desconocido",
      badgeClass: "bg-red-400/10 text-red-300",
    }
  );
}
