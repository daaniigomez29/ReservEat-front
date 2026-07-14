"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { FloorPlan, TableState, TableStatus } from "@/lib/types/floorPlan";

interface FloorPlanViewProps {
  restaurantId: string;
  plan: FloorPlan;
  /** Valor inicial del control de tiempo (formato datetime-local), o "" para "ahora". */
  initialAt: string;
}

const STATUS_META: Record<
  TableStatus,
  { label: string; fill: string; ring: string }
> = {
  FREE: { label: "Libre", fill: "#10b981", ring: "#047857" },
  PENDING: { label: "Pendiente", fill: "#f59e0b", ring: "#b45309" },
  RESERVED: { label: "Reservada", fill: "#3b82f6", ring: "#1d4ed8" },
  SEATED: { label: "Ocupada", fill: "#ef4444", ring: "#b91c1c" },
};

function formatDateTime(iso?: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FloorPlanView({
  restaurantId,
  plan,
  initialAt,
}: FloorPlanViewProps) {
  const router = useRouter();
  const [atInput, setAtInput] = useState(initialAt);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const counts = useMemo(() => {
    const acc: Record<TableStatus, number> = {
      FREE: 0,
      PENDING: 0,
      RESERVED: 0,
      SEATED: 0,
    };
    for (const table of plan.tables) acc[table.status] += 1;
    return acc;
  }, [plan.tables]);

  const selected = plan.tables.find((t) => t.tableId === selectedId) ?? null;

  function applyInstant(value: string) {
    const params = new URLSearchParams();
    if (value) {
      // datetime-local -> ISO LocalDateTime que espera el backend
      params.set("at", value.length === 16 ? `${value}:00` : value);
    }
    const qs = params.toString();
    router.push(
      `/dashboard/restaurants/${restaurantId}/floor-plan${qs ? `?${qs}` : ""}`,
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Control de instante consultado */}
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Ver ocupación en</span>
          <input
            type="datetime-local"
            value={atInput}
            onChange={(e) => setAtInput(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={() => applyInstant(atInput)}
          className="rounded bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          Aplicar
        </button>
        <button
          type="button"
          onClick={() => {
            setAtInput("");
            applyInstant("");
          }}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Ahora
        </button>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Actualizar
        </button>
        <p className="ml-auto text-xs text-gray-500">
          Instante: {formatDateTime(plan.queriedAt)}
        </p>
      </div>

      {/* Leyenda + resumen */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 text-sm">
        {(Object.keys(STATUS_META) as TableStatus[]).map((status) => (
          <span key={status} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: STATUS_META[status].fill }}
            />
            <span className="text-gray-700">
              {STATUS_META[status].label}
              <span className="ml-1 text-gray-400">({counts[status]})</span>
            </span>
          </span>
        ))}
        <span className="ml-auto text-gray-500">
          {plan.tables.length} mesas
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        {/* Plano */}
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          {plan.tables.length === 0 ? (
            <p className="p-6 text-center text-sm text-gray-500">
              Este restaurante todavía no tiene mesas configuradas.
            </p>
          ) : (
            <svg
              viewBox={`0 0 ${plan.planWidth} ${plan.planHeight}`}
              className="h-auto w-full rounded bg-gray-50"
              role="img"
              aria-label="Plano de mesas"
            >
              {/* Rejilla de referencia */}
              {Array.from({ length: 9 }, (_, i) => {
                const step = plan.planWidth / 10;
                const pos = step * (i + 1);
                return (
                  <g key={`grid-${i}`} stroke="#e5e7eb" strokeWidth={1}>
                    <line x1={pos} y1={0} x2={pos} y2={plan.planHeight} />
                    <line x1={0} y1={pos} x2={plan.planWidth} y2={pos} />
                  </g>
                );
              })}

              {plan.tables.map((table) => (
                <TableShapeNode
                  key={table.tableId}
                  table={table}
                  selected={table.tableId === selectedId}
                  onSelect={() =>
                    setSelectedId((prev) =>
                      prev === table.tableId ? null : table.tableId,
                    )
                  }
                />
              ))}
            </svg>
          )}
        </div>

        {/* Detalle de la mesa seleccionada */}
        <aside className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
          {selected ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                  Mesa {selected.label}
                </h2>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                  style={{ backgroundColor: STATUS_META[selected.status].fill }}
                >
                  {STATUS_META[selected.status].label}
                </span>
              </div>
              <dl className="flex flex-col gap-1 text-gray-700">
                <Row label="Capacidad">
                  {selected.capacity}
                  {selected.minCapacity ? ` (mín. ${selected.minCapacity})` : ""}
                </Row>
                {selected.zone && <Row label="Zona">{selected.zone}</Row>}
                <Row label="Forma">{selected.shape}</Row>
                {selected.status !== "FREE" && (
                  <>
                    <Row label="Comensales">{selected.partySize ?? "—"}</Row>
                    <Row label="Cliente">{selected.bookerEmail ?? "—"}</Row>
                    <Row label="Ocupada hasta">
                      {formatDateTime(selected.occupiedUntil)}
                    </Row>
                    <Row label="Reserva #">{selected.reservationId ?? "—"}</Row>
                  </>
                )}
              </dl>
            </div>
          ) : (
            <p className="text-gray-500">
              Selecciona una mesa en el plano para ver su detalle.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-right font-medium text-gray-900">{children}</dd>
    </div>
  );
}

function TableShapeNode({
  table,
  selected,
  onSelect,
}: {
  table: TableState;
  selected: boolean;
  onSelect: () => void;
}) {
  const meta = STATUS_META[table.status];
  const cx = table.x + table.width / 2;
  const cy = table.y + table.height / 2;
  const strokeWidth = selected ? 6 : 2;
  const stroke = selected ? "#111827" : meta.ring;

  return (
    <g
      transform={`rotate(${table.rotation} ${cx} ${cy})`}
      onClick={onSelect}
      className="cursor-pointer"
    >
      <title>
        {`Mesa ${table.label} · ${meta.label} · ${table.capacity} pax`}
      </title>
      {table.shape === "CIRCLE" ? (
        <ellipse
          cx={cx}
          cy={cy}
          rx={table.width / 2}
          ry={table.height / 2}
          fill={meta.fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      ) : (
        <rect
          x={table.x}
          y={table.y}
          width={table.width}
          height={table.height}
          rx={8}
          fill={meta.fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      )}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#ffffff"
        fontSize={Math.max(14, Math.min(table.width, table.height) / 3)}
        fontWeight={700}
        style={{ pointerEvents: "none" }}
      >
        {table.label}
      </text>
    </g>
  );
}
