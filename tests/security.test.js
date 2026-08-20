import { describe, expect, it } from "vitest";
import { safeCallbackUrl } from "@/lib/callbackUrl";
import { estadoInfo } from "@/lib/estadosProyecto";
import {
  projectUpdateSchema,
  registrationSchema,
} from "@/lib/validation";
import { enforceRateLimit } from "@/lib/rateLimit";

describe("safeCallbackUrl", () => {
  it("accepts internal paths", () => {
    expect(safeCallbackUrl("/admin/proyectos?ok=1")).toBe(
      "/admin/proyectos?ok=1"
    );
  });

  it("rejects external URLs and dangerous schemes", () => {
    expect(safeCallbackUrl("https://evil.example", "/panel")).toBe("/panel");
    expect(safeCallbackUrl("//evil.example", "/panel")).toBe("/panel");
    expect(safeCallbackUrl("javascript:alert(1)", "/panel")).toBe("/panel");
    expect(safeCallbackUrl("/\\evil", "/panel")).toBe("/panel");
  });
});

describe("input validation", () => {
  it("normalizes registration emails", () => {
    const parsed = registrationSchema.parse({
      name: " Cliente ",
      email: " CLIENTE@EXAMPLE.COM ",
      password: "correct-password",
    });

    expect(parsed).toEqual({
      name: "Cliente",
      email: "cliente@example.com",
      password: "correct-password",
    });
  });

  it("rejects oversized project notes and progress outside the domain", () => {
    expect(
      projectUpdateSchema.safeParse({
        id: "project-1",
        status: "EN_CURSO",
        progress: 101,
        notes: "ok",
        updatedAt: new Date().toISOString(),
      }).success
    ).toBe(false);
  });
});

describe("project states", () => {
  it("does not hide unknown persisted states as Backlog", () => {
    expect(estadoInfo("CORRUPTED").label).toBe("Estado desconocido");
  });
});

describe("rate limiting fallback", () => {
  it("blocks a key after its configured limit", async () => {
    const key = `test:${Date.now()}`;
    expect((await enforceRateLimit({ key, limit: 2, windowMs: 60_000 })).success).toBe(true);
    expect((await enforceRateLimit({ key, limit: 2, windowMs: 60_000 })).success).toBe(true);
    expect((await enforceRateLimit({ key, limit: 2, windowMs: 60_000 })).success).toBe(false);
  });
});
