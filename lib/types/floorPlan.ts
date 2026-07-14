export type TableShape = "RECTANGLE" | "SQUARE" | "CIRCLE";

export type TableStatus = "FREE" | "PENDING" | "RESERVED" | "SEATED";

export interface TableState {
  // Layout
  tableId: number;
  label: string;
  capacity: number;
  minCapacity?: number | null;
  zone?: string | null;
  shape: TableShape;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;

  // Ocupación en el instante consultado
  status: TableStatus;
  reservationId?: number | null;
  partySize?: number | null;
  bookerEmail?: string | null;
  occupiedUntil?: string | null;
}

export interface FloorPlan {
  restaurantId: number;
  queriedAt: string;
  planWidth: number;
  planHeight: number;
  tables: TableState[];
}
