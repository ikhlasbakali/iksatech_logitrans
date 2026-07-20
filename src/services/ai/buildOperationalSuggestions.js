/**
 * Suggestions opérationnelles dérivées des entités (pas de scénario inventé).
 */

/**
 * @param {{
 *   vehicles?: Array<Record<string, unknown>>,
 *   operations?: Array<Record<string, unknown>>,
 *   anomalies?: Array<Record<string, unknown>>,
 * }} input
 */
export function buildOperationalSuggestions({ vehicles = [], operations = [], anomalies = [] }) {
  const out = [];

  for (const a of anomalies.slice(0, 3)) {
    const plate = a.plate_number ? String(a.plate_number) : "";
    out.push({
      type: "alert",
      title: plate ? `Flotte — ${plate}` : "Anomalie flotte",
      description: String(a.detail || a.message || a.description || "Élément à vérifier."),
      impact: String(a.type || "surveillance"),
      priority: "medium",
    });
  }

  const now = Date.now();
  const week = 7 * 86400000;
  const maintSoon = vehicles.filter((v) => {
    if (!v.next_maintenance) return false;
    const t = new Date(String(v.next_maintenance)).getTime();
    return Number.isFinite(t) && t <= now + week;
  });
  for (const v of maintSoon.slice(0, 2)) {
    out.push({
      type: "alert",
      title: `Maintenance — ${v.plate_number}`,
      description: `Échéance maintenance / contrôle : ${String(v.next_maintenance).slice(0, 10)}.`,
      impact: "Planifier atelier ou contrôle",
      priority: "high",
    });
  }

  const delayed = operations
    .filter((o) => (Number(o.delay_minutes) || 0) > 25)
    .sort((a, b) => (Number(b.delay_minutes) || 0) - (Number(a.delay_minutes) || 0))
    .slice(0, 3);
  for (const o of delayed) {
    out.push({
      type: "optimization",
      title: `Retard — ${o.reference || "dossier"}`,
      description: `${o.client_name || "Client"} : +${o.delay_minutes} min vs prévision.`,
      impact: "Ajuster ETA ou notifier le client",
      priority: (Number(o.delay_minutes) || 0) > 60 ? "high" : "medium",
    });
  }

  const byDay = new Map();
  for (const o of operations) {
    const d = String(o.scheduled_delivery || o.scheduled_pickup || "").slice(0, 10);
    if (!d) continue;
    byDay.set(d, (byDay.get(d) || 0) + 1);
  }
  let maxDay = "";
  let maxN = 0;
  for (const [d, n] of byDay) {
    if (n > maxN) {
      maxN = n;
      maxDay = d;
    }
  }
  if (maxN >= 4 && maxDay) {
    out.push({
      type: "capacity",
      title: "Charge planifiée élevée",
      description: `${maxN} opérations prévues le ${maxDay} — vérifier capacité flotte / sous-traitance.`,
      impact: "Anticipation capacité",
      priority: "medium",
    });
  }

  return out.slice(0, 8);
}
