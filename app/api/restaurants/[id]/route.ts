import { NextResponse } from "next/server";
import { restaurantApi } from "@/lib/api/restaurantApi";
import { ApiError } from "@/lib/api/http";
import type { UpdateRestaurantPayload } from "@/lib/types/restaurants";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
  try {
    const updated = await restaurantApi.updateRestaurant(
      id,
      body as UpdateRestaurantPayload,
    );
    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { message: "No se pudo actualizar el restaurante" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    await restaurantApi.deleteRestaurant(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { message: "No se pudo eliminar el restaurante" },
      { status: 500 },
    );
  }
}
