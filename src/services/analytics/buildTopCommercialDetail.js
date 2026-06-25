/**
 * Détail « top commercial » à partir des devis (commercial_owner + agrégats).
 */

const MONTHS_FR = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

/**
 * @param {Array<Record<string, unknown>>} quotes
 */
export function buildTopCommercialDetail(quotes) {
  const list = quotes || [];
  const byOwner = new Map();
  for (const q of list) {
    const owner = String(q.commercial_owner || "Non assigné").trim() || "Non assigné";
    if (!byOwner.has(owner)) byOwner.set(owner, []);
    byOwner.get(owner).push(q);
  }

  let topName = "—";
  let topList = [];
  let best = -1;
  for (const [name, arr] of byOwner) {
    const rev = arr
      .filter((q) => q.status === "accepted" || q.status === "invoiced")
      .reduce((s, q) => s + (Number(q.amount_ht) || 0), 0);
    const total = arr.reduce((s, q) => s + (Number(q.amount_ht) || 0), 0);
    const score = rev * 1.2 + total * 0.1;
    if (score > best) {
      best = score;
      topName = name;
      topList = arr;
    }
  }

  if (topList.length === 0) {
    return {
      commercialData: null,
      monthlyPerformance: [],
      topClients: [],
    };
  }

  const won = topList.filter((q) => q.status === "accepted" || q.status === "invoiced");
  const revenue = won.reduce((s, q) => s + (Number(q.amount_ht) || 0), 0);
  const y = new Date().getFullYear();
  const monthlyPerformance = MONTHS_FR.map((month, idx) => {
    const mrev = topList
      .filter((q) => {
        const d = new Date(String(q.created_date));
        return (
          !Number.isNaN(d.getTime()) &&
          d.getFullYear() === y &&
          d.getMonth() === idx &&
          (q.status === "accepted" || q.status === "invoiced")
        );
      })
      .reduce((s, q) => s + (Number(q.amount_ht) || 0), 0);
    const target = mrev > 0 ? Math.round(mrev * 1.08) : 8000;
    const achievement = target > 0 ? (100 * mrev) / target : 0;
    return { month, revenue: Math.round(mrev), target, achievement: Math.round(achievement * 10) / 10 };
  });

  const clientMap = new Map();
  for (const q of topList) {
    const c = String(q.client_company || "—");
    if (!clientMap.has(c)) clientMap.set(c, { revenue: 0, n: 0 });
    const cell = clientMap.get(c);
    cell.revenue += Number(q.amount_ht) || 0;
    cell.n += 1;
  }
  const topClients = [...clientMap.entries()]
    .map(([client, { revenue, n }]) => ({
      client,
      revenue: Math.round(revenue),
      transactions: n,
      status: "Actif",
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  const dealsTotal = topList.length;
  const dealsClosed = won.length;
  const conversionRate = dealsTotal > 0 ? (100 * dealsClosed) / dealsTotal : 0;
  const monthlyTarget = Math.max(8000, Math.round(revenue / Math.max(1, won.length || 1)));
  const curIdx = new Date().getMonth();
  const curM = monthlyPerformance[curIdx];
  const targetAchievement =
    curM && curM.target > 0 ? Math.round((100 * curM.revenue) / curM.target * 10) / 10 : 0;

  const commercialData = {
    name: topName,
    revenue: Math.round(revenue),
    growth: 0,
    rank: 1,
    clients: clientMap.size,
    transactions: dealsTotal,
    averageTicket: dealsClosed > 0 ? Math.round(revenue / dealsClosed) : 0,
    conversionRate: Math.round(conversionRate * 10) / 10,
    targetAchievement,
    monthlyTarget,
    yearToDate: Math.round(revenue),
    lastMonth: monthlyPerformance[curIdx]?.revenue ?? 0,
  };

  return { commercialData, monthlyPerformance, topClients };
}
