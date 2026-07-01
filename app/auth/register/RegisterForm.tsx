"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { Role } from "@/lib/types/auth";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [tlf, setTlf] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("USER");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Cuando el registro va bien, guardamos el mensaje del backend
  // ("revisa tu correo…") y mostramos la pantalla de confirmación.
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, tlf, password, role }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          (data && typeof data === "object" && "message" in data
            ? String((data as { message: unknown }).message)
            : null) ?? "No se pudo crear la cuenta",
        );
      }
      // NO redirigimos ni iniciamos sesión: la cuenta aún no está verificada.
      setSuccessMessage(
        (data && typeof data === "object" && "message" in data
          ? String((data as { message: unknown }).message)
          : null) ??
          "Cuenta creada. Revisa tu correo para verificarla antes de iniciar sesión.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  if (successMessage) {
    return (
      <div className="flex flex-col gap-4 rounded-lg border border-green-200 bg-green-50 p-6">
        <h2 className="text-lg font-semibold text-green-800">
          ¡Casi listo! 📧
        </h2>
        <p className="text-sm text-green-700">{successMessage}</p>
        <Link
          href="/auth/login"
          className="rounded bg-brand-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-brand-700"
        >
          Ir a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-6"
    >
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Nombre</span>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Nombre de usuario</span>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Teléfono</span>
        <input
          type="tel"
          required
          value={tlf}
          onChange={(e) => setTlf(e.target.value)}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Contraseña</span>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-gray-700">Tipo de cuenta</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        >
          <option value="USER">Cliente</option>
          <option value="OWNER">Propietario de restaurante</option>
        </select>
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {submitting ? "Creando…" : "Crear cuenta"}
      </button>
      <p className="text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className="text-brand-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
