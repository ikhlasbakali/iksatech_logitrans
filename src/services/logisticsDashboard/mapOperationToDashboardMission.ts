import type { FleetDashboardMissionRow } from "./types";

/** Modèle minimal Operation (app LogiTrans) — champs optionnels tolérés */
export type OperationLike = {
  id: string;
  reference?: string;
  client_name?: string;
  type_operation?: string;
  status?: string;
  priority?: string;
  pickup_city?: string;
  delivery_city?: string;
  driver_id?: string | null;
  driver_name?: string | null;
  driver2_name?: string | null;
  vehicle_plate?: string | null;
  vehicle_id?: string | null;
  delay_minutes?: number | null;
  assigned_agent?: string | null;
  current_lat?: number | null;
  current_lng?: number | null;
};

/**
 * Mapper unique app → format attendu par le dashboard flotte.
 * Règles SoT :
 * - Chauffeur affiché : dérivé de driver_name pour l’UI ; identifiant canonique = driver_id.
 * - Pas de duplication TRACTEUR / vehicle_id dans cette ligne : on expose TRACTEUR = plaque (donnée terrain la plus lue).
 */
export function mapOperationToDashboardMission(op: OperationLike): FleetDashboardMissionRow {
  const trajet =
    op.pickup_city && op.delivery_city
      ? `${op.pickup_city} → ${op.delivery_city}`
      : op.pickup_city || op.delivery_city || "—";

  const chauffeur =
    [op.driver_name, op.driver2_name].filter(Boolean).join(" + ") || "—";

  const positionParts = [op.status, op.pickup_city, op.delivery_city].filter(Boolean);
  const POSITION = positionParts.length ? positionParts.join(" · ") : String(op.status ?? "—");

  return {
    id: String(op.id),
    REFERENCE: op.reference,
    CLIENT: op.client_name,
    "Int.Resp": op.assigned_agent ?? "",
    TRACTEUR: op.vehicle_plate ?? "",
    POSITION,
    IMPORT: op.type_operation ?? "",
    status: op.status,
    CHAUFFEUR: chauffeur,
    driver_id: op.driver_id ?? null,
    TRAJET: trajet,
    RETARD_MIN: typeof op.delay_minutes === "number" ? op.delay_minutes : 0,
    PRIORITE: op.priority ?? "",
    meta: {
      vehicle_id: op.vehicle_id ?? null,
      geo:
        op.current_lat != null && op.current_lng != null
          ? { lat: op.current_lat, lng: op.current_lng }
          : null,
    },
  };
}

export function mapOperationsToDashboardMissions(operations: OperationLike[]): FleetDashboardMissionRow[] {
  return operations.map(mapOperationToDashboardMission);
}
