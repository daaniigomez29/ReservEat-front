import { NextResponse } from "next/server";
import { authApi } from "@/lib/api/authApi";
import { ApiError } from "@/lib/api/http";
import type { Role } from "@/lib/types/auth";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { email, password, name, username, tlf, role } =
    (body as {
      email?: string;
      password?: string;
      name?: string;
      username?: string;
      tlf?: string;
      role?: Role;
    }) ?? {};

  if (!email || !password || !name || !username || !tlf) {
    return NextResponse.json(
      { message: "Email, contraseña, nombre, usuario y teléfono son obligatorios" },
      { status: 400 },
    );
  }

  try {
    // El backend crea la cuenta y envía un email de verificación.
    // NO devuelve token, así que aquí NO iniciamos sesión: solo
    // reenviamos su mensaje para que el usuario revise su correo.
    const result = await authApi.register({
      email,
      password,
      name,
      username,
      tlf,
      role,
    });
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 },
    );
  }
}
