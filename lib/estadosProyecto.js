// Estados posibles de un proyecto, en el mismo orden en que se muestran
// las columnas. Se usa tanto en el panel de admin (para editarlos) como
// en el panel del cliente (para mostrarlos), así quedan siempre iguales.
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
    ESTADOS_PROYECTO.find((e) => e.value === value) || ESTADOS_PROYECTO[0]
  );
}
