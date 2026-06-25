/**
 * Intelligence simulée : prédictions de retard, anomalies flotte, recommandations d’action.
 * Remplace par modèles ML + données trafic quand un backend est disponible.
 */
import { dataRepository } from "@/services/repository/dataRepository";
import { estimateEtaMinutes } from "@/services/tracking/trackingService";
import { processWorkflowTrigger } from "@/services/workflow/workflowEngine";

const notifiedDelayOps = new Set();

export async function predictOperationDelays() {
  const [operations, vehicles] = await Promise.all([
    dataRepository.operations.list(),
    dataRepository.vehicles.list(),
  ]);

  return operations.map((op) => {
    const v = vehicles.find((x) => x.plate_number === op.vehicle_plate);
    let risk = 18;
    if ((op.delay_minutes ?? 0) > 0) risk += 28;
    if (op.priority === "urgent") risk += 12;
    if (op.status === "incident") risk += 35;
    if (!v?.current_lat) risk += 8;
    risk = Math.min(100, Math.round(risk));

    const eta_minutes_remaining =
      v?.current_lat != null
        ? estimateEtaMinutes(v.current_lat, v.current_lng, op.delivery_city, v.speed_kmh || 70)
        : null;

    let predicted_delay_min = 0;
    if (risk > 55) predicted_delay_min = 12 + Math.round(risk * 0.35);
    if (op.scheduled_delivery && new Date(op.scheduled_delivery).getTime() < Date.now()) {
      predicted_delay_min += 18;
    }

    const factors = [];
    if ((op.delay_minutes ?? 0) > 0) factors.push("Retard déjà enregistré");
    if (op.priority === "urgent") factors.push("Priorité urgente");
    if (op.status === "incident") factors.push("Incident ouvert");
    if (eta_minutes_remaining != null && eta_minutes_remaining > 180) factors.push("ETA longue");

    const recommendation =
      risk > 68
        ? "Prévenir le client, ajuster le créneau, vérifier disponibilité quai."
        : risk > 42
          ? "Surveillance renforcée sur la carte ; relancer le chauffeur si besoin."
          : "Situation dans les marges habituelles.";

    return {
      operation_id: op.id,
      reference: op.reference,
      risk_score: risk,
      predicted_delay_min,
      factors,
      recommendation,
      eta_minutes_remaining,
    };
  });
}

export async function detectFleetAnomalies() {
  const vehicles = await dataRepository.vehicles.list();
  const now = Date.now();
  const out = [];
  for (const v of vehicles) {
    if (!v.last_position_at) continue;
    const ageMin = (now - new Date(v.last_position_at).getTime()) / 60000;
    if (ageMin > 90 && v.status === "in_transit") {
      out.push({
        type: "stale_gps",
        plate_number: v.plate_number,
        detail: `Pas de point GPS récent (${Math.round(ageMin)} min) — vérifier connectivité.`,
      });
    }
  }
  return out;
}

export async function recommendActionsForOperation(operationId) {
  const rows = await dataRepository.operations.filter({ id: operationId });
  const op = rows[0];
  if (!op) return null;
  return {
    route_hint: `Trajet type : ${op.pickup_city} → réseau principal → ${op.delivery_city}.`,
    action: "Éviter livraison centre-ville entre 8h–10h ; privilégier créneau 13h–15h.",
    capacity_hint:
      "Si retard > 30 min, évaluer une mise en cross-dock partenaire selon vos accords contractuels.",
  };
}

/** Déclenche delay.detected une fois par opération tant que le score reste élevé (session). */
export async function scanHighRiskDelaysAndNotify() {
  const preds = await predictOperationDelays();
  for (const p of preds) {
    if (p.risk_score < 70 || p.predicted_delay_min < 22) continue;
    if (notifiedDelayOps.has(p.operation_id)) continue;
    notifiedDelayOps.add(p.operation_id);
    await processWorkflowTrigger("delay.detected", {
      reference: p.reference,
      message: `Risque ${p.risk_score}% — retard estimé ~${p.predicted_delay_min} min. ${p.recommendation}`,
      delay_minutes: String(p.predicted_delay_min),
    });
  }
}
