import { NextResponse } from "next/server";
import { restaurantApi } from "@/lib/api/restaurantApi";
import { ApiError } from "@/lib/api/http";
import type { CreateRestaurantPayload } from "@/lib/types/restaurants";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
  try {
    const created = await restaurantApi.createRestaurant(
      body as CreateRestaurantPayload,
    );
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { message: "No se pudo crear el restaurante" },
      { status: 500 },
    );
  }
}
