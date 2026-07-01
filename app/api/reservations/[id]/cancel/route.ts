import { NextResponse } from "next/server";
import { reservationApi } from "@/lib/api/reservationApi";
import { ApiError } from "@/lib/api/http";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const reservation = await reservationApi.cancelReservation(id);
    return NextResponse.json(reservation);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { message: "No se pudo cancelar la reserva" },
      { status: 500 },
    );
  }
}
