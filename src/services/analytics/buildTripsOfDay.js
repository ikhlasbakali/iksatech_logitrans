/**
 * Voyages du jour à partir des opérations (échéance ou création = aujourd’hui).
 */

function startEndToday() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function isToday(iso) {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  const { start, end } = startEndToday();
  return t >= start.getTime() && t < end.getTime();
}

function pickTime(op) {
  const raw = op.scheduled_pickup || op.scheduled_delivery || op.created_date;
  if (!raw) return "—";
  try {
    return new Date(raw).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "—";
  }
}

/**
 * @param {Array<Record<string, unknown>>} operations
 */
export function buildTripsOfDay(operations) {
  const list = (operations || []).filter(
    (op) =>
      isToday(op.scheduled_pickup) ||
      isToday(op.scheduled_delivery) ||
      isToday(op.created_date)
  );

  const importTrips = [];
  const exportTrips = [];
  const byKey = (arr, company, dest, time) => {
    const k = `${company}|${dest}`;
    const ex = arr.find((x) => x._k === k);
    if (ex) ex.count += 1;
    else arr.push({ company, destination: dest, time, count: 1, _k: k });
  };

  for (const op of list) {
    const company = String(op.client_name || "—");
    const dest = String(op.delivery_city || op.pickup_city || "—");
    const time = pickTime(op);
    if (String(op.type_operation) === "international") {
      byKey(importTrips, company, dest, time);
    } else {
      byKey(exportTrips, company, dest, time);
    }
  }

  const strip = (rows) =>
    rows.map(({ company, destination, time, count }) => ({ company, destination, time, count }));

  return {
    importTrips: strip(importTrips).slice(0, 12),
    exportTrips: strip(exportTrips).slice(0, 12),
    total: list.length,
    importCount: importTrips.reduce((s, r) => s + r.count, 0),
    exportCount: exportTrips.reduce((s, r) => s + r.count, 0),
  };
}
