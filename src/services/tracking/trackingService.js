/**
 * Simulation temps réel : déplace les véhicules vers la ville de livraison de l’opération liée,
 * calcule ETA heuristique, détecte immobilité prolongée → événement workflow.
 */
import { dataRepository } from "@/services/repository/dataRepository";
import { coordsForCity } from "@/services/tracking/cityCoords";
import { processWorkflowTrigger } from "@/services/workflow/workflowEngine";

const ACTIVE_OP_STATUSES = new Set(["in_transit", "loading", "unloading", "incident"]);

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** Distance km (haversine simplifié). */
export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** ETA = distance / vitesse moyenne (plancher 40 km/h urbain simulé). */
export function estimateEtaMinutes(fromLat, fromLng, toCity, assumedSpeedKmh = 72) {
  const dest = coordsForCity(toCity);
  const km = haversineKm(fromLat, fromLng, dest.lat, dest.lng);
  const speed = Math.max(40, assumedSpeedKmh);
  return Math.round((km / speed) * 60);
}

/**
 * Un tick de simulation : à appeler toutes les 3–5 s depuis le client.
 */
export async function trackingTick() {
  const [vehicles, operations] = await Promise.all([
    dataRepository.vehicles.list(),
    dataRepository.operations.list(),
  ]);

  const activeOps = operations.filter((o) => ACTIVE_OP_STATUSES.has(o.status));

  for (const v of vehicles) {
    if (v.asset_category === "trailer" || v.current_lat == null || v.current_lng == null) continue;

    const op = activeOps.find((o) => o.vehicle_plate === v.plate_number);
    if (!op) continue;

    const dest = coordsForCity(op.delivery_city);
    const step = op.status === "in_transit" || op.status === "incident" ? 0.018 : 0.006;

    const nlat = lerp(v.current_lat, dest.lat, step);
    const nlng = lerp(v.current_lng, dest.lng, step);

    const moved = haversineKm(v.current_lat, v.current_lng, nlat, nlng) > 0.08;
    const dkm = haversineKm(v.current_lat, v.current_lng, nlat, nlng);
    /** Vitesse dérivée du déplacement sur ~4,5 s (intervalle client), sans valeur aléatoire. */
    const dtHours = 4.5 / 3600;
    const speedKmh = moved ? Math.min(130, Math.max(0, Math.round(dkm / dtHours))) : 0;

    let stationary_ticks = moved ? 0 : (v.stationary_ticks || 0) + 1;
    let inactive_alert_sent = v.inactive_alert_sent;

    if (moved) inactive_alert_sent = false;

    const patch = {
      current_lat: nlat,
      current_lng: nlng,
      last_position_at: new Date().toISOString(),
      speed_kmh: speedKmh,
      stationary_ticks,
      inactive_alert_sent,
    };

    if (
      (op.status === "in_transit" || op.status === "incident") &&
      stationary_ticks >= 10 &&
      !inactive_alert_sent
    ) {
      patch.inactive_alert_sent = true;
      await dataRepository.vehicles.update(v.id, patch);
      await processWorkflowTrigger("vehicle.inactive", {
        plate_number: v.plate_number,
        reference: op.reference,
        message: `Immobilité simulée (${stationary_ticks} ticks) — vérifier le chauffeur ou le capteur.`,
        minutes: String(stationary_ticks * 4),
      });
      continue;
    }

    await dataRepository.vehicles.update(v.id, patch);
  }
}

/**
 * Vue fusionnée pour la carte : véhicules géolocalisés + opération liée + ETA.
 */
export async function buildLiveFleetView() {
  const [vehicles, operations, drivers] = await Promise.all([
    dataRepository.vehicles.list(),
    dataRepository.operations.list(),
    dataRepository.drivers.list(),
  ]);

  return vehicles
    .filter((v) => v.current_lat != null && v.current_lng != null && v.asset_category !== "trailer")
    .map((v) => {
      const op = operations.find((o) => o.vehicle_plate === v.plate_number);
      const driverRow = op?.driver_id
        ? drivers.find((d) => d.id === op.driver_id)
        : drivers.find((d) => `${d.first_name} ${d.last_name}`.trim() === String(op?.driver_name || "").trim());
      const etaMin = op
        ? estimateEtaMinutes(v.current_lat, v.current_lng, op.delivery_city, v.speed_kmh || 70)
        : null;
      const etaDate =
        etaMin != null ? new Date(Date.now() + etaMin * 60 * 1000) : null;
      const delayed = (op?.delay_minutes ?? 0) > 25;

      return {
        id: v.id,
        operation_id: op?.id ?? null,
        lat: v.current_lat,
        lng: v.current_lng,
        plate_number: v.plate_number,
        vehicle: v.plate_number,
        reference: op?.reference ?? v.plate_number,
        driver: op?.driver_name ?? v.current_driver ?? "—",
        phone: driverRow?.phone || "—",
        client: op?.client_name ?? "—",
        destination: op?.delivery_city ?? "—",
        status: op?.status ?? v.status,
        speed: v.speed_kmh ?? 0,
        delayed,
        delay_minutes: op?.delay_minutes ?? 0,
        eta: etaDate,
        route:
          op &&
          [
            [v.current_lat, v.current_lng],
            [
              (v.current_lat + coordsForCity(op.delivery_city).lat) / 2,
              (v.current_lng + coordsForCity(op.delivery_city).lng) / 2,
            ],
            [coordsForCity(op.delivery_city).lat, coordsForCity(op.delivery_city).lng],
          ],
      };
    });
}
