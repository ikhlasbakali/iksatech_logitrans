/**
 * Annuaire clients pour le module CRM « Clients » — dérivé des opérations et devis en base.
 */

function hashString(s) {
  let h = 0;
  const str = String(s || "");
  for (let i = 0; i < str.length; i += 1) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * @param {Array<Record<string, unknown>>} operations
 * @param {Array<Record<string, unknown>>} quotes
 * @returns {Array<Record<string, unknown>>}
 */
export function buildClientDirectoryFromStore(operations, quotes) {
  const byClient = new Map();

  for (const op of operations || []) {
    const name = String(op.client_name || "").trim();
    if (!name) continue;
    if (!byClient.has(name)) {
      byClient.set(name, {
        name,
        ops: [],
        cities: [],
      });
    }
    const row = byClient.get(name);
    row.ops.push(op);
    const city = String(op.delivery_city || op.pickup_city || "").trim();
    if (city) row.cities.push(city);
  }

  const quoteHtByClient = (clientName) =>
    (quotes || [])
      .filter((q) => String(q.client_company || "").trim() === clientName)
      .reduce((s, q) => s + (Number(q.amount_ht) || 0), 0);

  const rows = [...byClient.entries()].map(([name, { ops, cities }], index) => {
    const revenue = quoteHtByClient(name);
    const lastDates = ops
      .map((o) => new Date(o.actual_delivery || o.scheduled_delivery || o.created_date).getTime())
      .filter((t) => Number.isFinite(t));
    const lastOrder = lastDates.length ? new Date(Math.max(...lastDates)).toISOString().slice(0, 10) : "";
    const modeCity =
      cities.length === 0
        ? "—"
        : [...cities].sort(
            (a, b) =>
              cities.filter((x) => x === b).length - cities.filter((x) => x === a).length
          )[0];

    const growth = 0;

    return {
      id: String(hashString(name) || index + 1),
      rank: index + 1,
      name,
      revenue: Math.round(revenue),
      growth,
      sector: "Logistics & transport",
      location: modeCity,
      isPremium: revenue >= 20000,
      lastOrder,
      contact: {
        name: ops[0]?.driver_name ? `Réf. ${ops[0].driver_name}` : "—",
        email: "—",
        phone: "—",
      },
    };
  });

  rows.sort((a, b) => b.revenue - a.revenue);
  return rows.map((r, i) => ({ ...r, rank: i + 1 }));
}
