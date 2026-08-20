"use client";

import { useFormStatus } from "react-dom";

export function FormSubmitButton({ children, pendingLabel = "Guardando...", className }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className || ""} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

export function ConfirmSubmitButton({ children, message, className }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      className={`${className || ""} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending ? "Procesando..." : children}
    </button>
  );
}
