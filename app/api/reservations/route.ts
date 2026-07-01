import { NextResponse } from "next/server";
import { reservationApi } from "@/lib/api/reservationApi";
import { ApiError } from "@/lib/api/http";
import type { CreateReservationPayload } from "@/lib/types/reservations";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const payload = body as CreateReservationPayload;
  if (!payload?.restaurantId || !payload.startDate || !payload.partySize) {
    return NextResponse.json(
      { message: "Missing reservation fields" },
      { status: 400 },
    );
  }

  try {
    const reservation = await reservationApi.createReservation(payload);
    return NextResponse.json(reservation, { status: 201 });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { message: "No se pudo crear la reserva" },
      { status: 500 },
    );
  }
}
