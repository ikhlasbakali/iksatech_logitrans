/**
 * Données CRM dérivées exclusivement du stockage applicatif (appApi / localStorage).
 * Les montants et volumes proviennent des champs `Operation`, `SalesQuote`, `Incident`, etc.
 */
import { appApi } from "@/api/appApi";
import { EUR_TO_MAD } from "@/config/fx";
import { coordsForCity } from "@/services/tracking/cityCoords";
import type {
  CustomerMetrics,
  DashboardMetrics,
  GeographicData,
  OpportunityDetails,
  ProductPerformance,
  SalespersonDetails,
  SalespersonPerformance,
} from "../types/crm";

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

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function loadCore() {
  const [operations, quotes, vehicles, drivers, incidents] = await Promise.all([
    appApi.entities.Operation.list("-created_date", 500),
    appApi.entities.SalesQuote.list("-created_date", 500),
    appApi.entities.Vehicle.list(),
    appApi.entities.Driver.list(),
    appApi.entities.Incident.list("-created_date", 300),
  ]);
  return { operations, quotes, vehicles, drivers, incidents };
}

function clientQuoteHt(client: string, quotes: Record<string, unknown>[]) {
  return quotes
    .filter((q) => String(q.client_company) === String(client))
    .reduce((s, q) => s + (Number(q.amount_ht) || 0), 0);
}

function clientOpCount(client: string, operations: Record<string, unknown>[]) {
  return Math.max(1, operations.filter((o) => String(o.client_name) === String(client)).length);
}

function quoteToOpportunityStatus(
  status: string
): OpportunityDetails["status"] {
  switch (status) {
    case "draft":
      return "prospect";
    case "sent":
      return "devis";
    case "accepted":
    case "invoiced":
      return "signature";
    case "rejected":
    case "expired":
      return "perdu";
    default:
      return "qualification";
  }
}

function quoteProbability(status: string): number {
  switch (status) {
    case "draft":
      return 20;
    case "sent":
      return 55;
    case "accepted":
    case "invoiced":
      return 100;
    case "rejected":
    case "expired":
      return 0;
    default:
      return 35;
  }
}

function buildDashboardMetrics(
  operations: Record<string, unknown>[],
  quotes: Record<string, unknown>[]
): DashboardMetrics {
  const accepted = quotes.filter((q) => q.status === "accepted" || q.status === "invoiced");
  const totalHt = accepted.reduce((s, q) => s + (Number(q.amount_ht) || 0), 0);
  const totalTtc = accepted.reduce((s, q) => s + (Number(q.amount_ttc) || 0), 0);
  const pipeline = quotes
    .filter((q) => q.status === "draft" || q.status === "sent")
    .reduce((s, q) => s + (Number(q.amount_ttc) || 0), 0);
  const lost = quotes
    .filter((q) => q.status === "rejected" || q.status === "expired")
    .reduce((s, q) => s + (Number(q.amount_ttc) || 0), 0);
  const activeLeads = quotes.filter((q) => q.status === "draft" || q.status === "sent").length;
  const closedDeals = accepted.length;
  const decided = quotes.filter((q) =>
    ["accepted", "invoiced", "rejected", "expired"].includes(String(q.status))
  ).length;
  const conversion = decided > 0 ? (100 * closedDeals) / decided : 0;
  const avgDeal = closedDeals > 0 ? totalHt / closedDeals : 0;

  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const sumQuotesMonth = (year: number, month: number, pred: (q: Record<string, unknown>) => boolean) =>
    quotes
      .filter((q) => {
        const d = new Date(String(q.created_date));
        if (Number.isNaN(d.getTime())) return false;
        return d.getFullYear() === year && d.getMonth() === month && pred(q);
      })
      .reduce((s, q) => s + (Number(q.amount_ht) || 0), 0);

  const currentMonthRevenue = sumQuotesMonth(y, m, (q) => q.status === "accepted" || q.status === "invoiced");
  const prevMonth = m === 0 ? 11 : m - 1;
  const prevYear = m === 0 ? y - 1 : y;
  const previousMonthRevenue = sumQuotesMonth(prevYear, prevMonth, (q) => q.status === "accepted" || q.status === "invoiced");

  const yearRev = (year: number) =>
    quotes
      .filter((q) => {
        const d = new Date(String(q.created_date));
        return (
          !Number.isNaN(d.getTime()) &&
          d.getFullYear() === year &&
          (q.status === "accepted" || q.status === "invoiced")
        );
      })
      .reduce((s, q) => s + (Number(q.amount_ht) || 0), 0);

  const importTrips = operations.filter((o) => String(o.type_operation) === "international").length;
  const exportTrips = operations.length - importTrips;

  const growth =
    previousMonthRevenue > 0
      ? (100 * (currentMonthRevenue - previousMonthRevenue)) / previousMonthRevenue
      : 0;
  const cy = yearRev(y);
  const py = yearRev(y - 1);
  const growthYear = py > 0 ? (100 * (cy - py)) / py : 0;

  return {
    total_revenue_ht: Math.round(totalHt),
    total_revenue_ttc: Math.round(totalTtc),
    total_revenue_dh: Math.round(totalTtc * EUR_TO_MAD),
    revenue_growth: Math.round(growth * 10) / 10,
    revenue_growth_previous_year: Math.round(growthYear * 10) / 10,
    pipeline_value: Math.round(pipeline),
    pipeline_lost: Math.round(lost),
    conversion_rate: Math.round(conversion * 10) / 10,
    active_leads: activeLeads,
    closed_deals: closedDeals,
    avg_deal_value: Math.round(avgDeal),
    total_trips: operations.length,
    import_trips: importTrips,
    export_trips: Math.max(0, exportTrips),
    objective_evaluation_rate:
      operations.length > 0
        ? Math.round((100 * operations.filter((o) => (Number(o.delay_minutes) || 0) <= 30).length) / operations.length * 10) / 10
        : 0,
    current_month_revenue: Math.round(currentMonthRevenue),
    previous_month_revenue: Math.round(previousMonthRevenue),
    current_year_revenue: Math.round(cy),
    previous_year_revenue: Math.round(py),
  };
}

function buildSalespeople(quotes: Record<string, unknown>[]): SalespersonPerformance[] {
  const byOwner = new Map<string, Record<string, unknown>[]>();
  for (const q of quotes) {
    const owner = String(q.commercial_owner || "Non assigné").trim() || "Non assigné";
    if (!byOwner.has(owner)) byOwner.set(owner, []);
    byOwner.get(owner)!.push(q);
  }
  let id = 1;
  const rows: SalespersonPerformance[] = [];
  for (const [name, list] of byOwner) {
    const won = list.filter((q) => q.status === "accepted" || q.status === "invoiced");
    const achieved = won.reduce((s, q) => s + (Number(q.amount_ht) || 0), 0);
    const target = achieved > 0 ? Math.round(achieved * 1.12) : Math.round(list.length * 5000);
    const dealsClosed = won.length;
    const dealsTotal = list.length;
    const conversion = dealsTotal > 0 ? (100 * dealsClosed) / dealsTotal : 0;
    rows.push({
      id: id++,
      name,
      revenue_achieved: Math.round(achieved),
      revenue_target: target,
      deals_closed: dealsClosed,
      deals_total: dealsTotal,
      conversion_rate: Math.round(conversion * 10) / 10,
      avg_deal_time: dealsClosed > 0 ? Math.round(24 + dealsTotal / dealsClosed) : 0,
    });
  }
  return rows.sort((a, b) => b.revenue_achieved - a.revenue_achieved);
}

function buildGeographic(operations: Record<string, unknown>[], quotes: Record<string, unknown>[]): GeographicData[] {
  const map = new Map<string, { revenue: number; deals: number }>();
  for (const op of operations) {
    const city = String(op.delivery_city || op.pickup_city || "Autre").trim() || "Autre";
    if (!map.has(city)) map.set(city, { revenue: 0, deals: 0 });
    const cell = map.get(city)!;
    cell.deals += 1;
    const client = String(op.client_name || "");
    const alloc = client ? clientQuoteHt(client, quotes) / clientOpCount(client, operations) : 0;
    cell.revenue += alloc;
  }
  return [...map.entries()]
    .map(([country, v]) => {
      const c = coordsForCity(country);
      return {
        country,
        revenue: Math.round(v.revenue),
        deals: v.deals,
        lat: c.lat,
        lng: c.lng,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

function buildProducts(operations: Record<string, unknown>[], quotes: Record<string, unknown>[]): ProductPerformance[] {
  const byType = new Map<string, number>();
  for (const op of operations) {
    const t = String(op.type_operation || "national");
    byType.set(t, (byType.get(t) || 0) + 1);
  }
  const totalRev = quotes
    .filter((q) => q.status === "accepted" || q.status === "invoiced")
    .reduce((s, q) => s + (Number(q.amount_ht) || 0), 0);
  const total = operations.length || 1;
  let id = 1;
  const rows: ProductPerformance[] = [];
  for (const [type, count] of byType) {
    const share = count / total;
    const label = type === "international" ? "Transport international" : "Transport national";
    rows.push({
      id: id++,
      name: label,
      category: "Transport",
      revenue: Math.round(totalRev * share),
      quantity_sold: count,
      margin: 0,
      growth_rate: 0,
    });
  }
  return rows.sort((a, b) => b.revenue - a.revenue);
}

function buildCustomers(operations: Record<string, unknown>[], quotes: Record<string, unknown>[]): CustomerMetrics[] {
  const clients = [...new Set(operations.map((o) => String(o.client_name || "")).filter(Boolean))];
  let id = 1;
  const rows: CustomerMetrics[] = [];
  for (const name of clients) {
    const ops = operations.filter((o) => String(o.client_name) === name);
    const rev = clientQuoteHt(name, quotes);
    const last = ops
      .map((o) => new Date(String(o.actual_delivery || o.scheduled_delivery || o.created_date)).getTime())
      .filter(Number.isFinite)
      .sort((a, b) => b - a)[0];
    const imp = ops.filter((o) => String(o.type_operation) === "international").length;
    const late = ops.filter((o) => (Number(o.delay_minutes) || 0) > 30).length;
    const evaluationScore = Math.round((5 - Math.min(2, (late / Math.max(1, ops.length)) * 3)) * 10) / 10;
    rows.push({
      id: id++,
      name,
      revenue: Math.round(rev),
      orders_count: ops.length,
      avg_order_value: ops.length > 0 ? Math.round(rev / ops.length) : 0,
      last_order_date: last ? new Date(last).toISOString().slice(0, 10) : "",
      category: "Client transport",
      country: "France",
      trips_count: ops.length,
      import_trips: imp,
      export_trips: ops.length - imp,
      revenue_growth: 0,
      revenue_previous_year: 0,
      evaluation_score: evaluationScore,
    });
  }
  return rows.sort((a, b) => b.revenue - a.revenue);
}

function buildRevenueEvolution(quotes: Record<string, unknown>[]) {
  const y = new Date().getFullYear();
  const data: Array<{ date: string; revenue: number; forecast: number }> = [];
  for (let m = 0; m < 12; m += 1) {
    const rev = quotes
      .filter((q) => {
        const d = new Date(String(q.created_date));
        return (
          !Number.isNaN(d.getTime()) &&
          d.getFullYear() === y &&
          d.getMonth() === m &&
          (q.status === "accepted" || q.status === "invoiced")
        );
      })
      .reduce((s, q) => s + (Number(q.amount_ht) || 0), 0);
    const d = new Date(y, m, 1);
    data.push({
      date: d.toISOString().split("T")[0],
      revenue: Math.round(rev),
      forecast: Math.round(rev * 1.05),
    });
  }
  return data;
}

function buildRevenueEvaluation(quotes: Record<string, unknown>[]) {
  const y = new Date().getFullYear();
    const currentYearData = MONTHS_FR.map((month, idx) => {
    const revenue = quotes
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
    return {
      month,
      revenue: Math.round(revenue),
      target: Math.round(revenue > 0 ? revenue * 1.08 : 8000),
    };
  });
  const py = y - 1;
  const previousYearData = MONTHS_FR.map((month, idx) => {
    const revenue = quotes
      .filter((q) => {
        const d = new Date(String(q.created_date));
        return (
          !Number.isNaN(d.getTime()) &&
          d.getFullYear() === py &&
          d.getMonth() === idx &&
          (q.status === "accepted" || q.status === "invoiced")
        );
      })
      .reduce((s, q) => s + (Number(q.amount_ht) || 0), 0);
    return { month, revenue: Math.round(revenue) };
  });
  return { currentYearData, previousYearData };
}

function buildOpportunities(quotes: Record<string, unknown>[]): OpportunityDetails[] {
  return quotes.map((q, idx) => {
    const st = String(q.status || "draft");
    return {
      id: idx + 1,
      client_name: String(q.client_company || "—"),
      category: String(q.title || "Devis").slice(0, 48),
      services: {
        transport_international: String(q.title || "").toLowerCase().includes("international") ? 1 : 0,
        transport_national: 1,
        stockage: 0,
        parking: 0,
      },
      status: quoteToOpportunityStatus(st),
      value: Math.round(Number(q.amount_ht) || 0),
      probability: quoteProbability(st),
      created_date: String(q.created_date || "").slice(0, 10),
    };
  });
}

function buildSalespersonDetails(quotes: Record<string, unknown>[]): SalespersonDetails[] {
  const byOwner = new Map<string, Record<string, unknown>[]>();
  for (const q of quotes) {
    const owner = String(q.commercial_owner || "Non assigné").trim() || "Non assigné";
    if (!byOwner.has(owner)) byOwner.set(owner, []);
    byOwner.get(owner)!.push(q);
  }
  let id = 1;
  const rows: SalespersonDetails[] = [];
  for (const [name, list] of byOwner) {
    const won = list.filter((q) => q.status === "accepted" || q.status === "invoiced");
    const revenue = won.reduce((s, q) => s + (Number(q.amount_ht) || 0), 0);
    rows.push({
      id: id++,
      name,
      total_deals: list.length,
      prospects: list.filter((q) => q.status === "draft").length,
      qualification: 0,
      devis: list.filter((q) => q.status === "sent").length,
      negociation: 0,
      signature: list.filter((q) => q.status === "accepted" || q.status === "invoiced").length,
      perdu: list.filter((q) => q.status === "rejected" || q.status === "expired").length,
      services: {
        transport_international: list.filter((q) => String(q.title).toLowerCase().includes("international")).length,
        transport_national: list.length,
        stockage: 0,
        parking: 0,
      },
      revenue: Math.round(revenue),
      revenue_growth: 0,
    });
  }
  return rows;
}

export const crmAppStoreService = {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    await delay(120);
    const { operations, quotes } = await loadCore();
    return buildDashboardMetrics(operations, quotes);
  },

  async getSalespersonPerformance(): Promise<SalespersonPerformance[]> {
    await delay(120);
    const { quotes } = await loadCore();
    return buildSalespeople(quotes);
  },

  async getGeographicData(): Promise<GeographicData[]> {
    await delay(120);
    const { operations, quotes } = await loadCore();
    return buildGeographic(operations, quotes);
  },

  async getProductPerformance(): Promise<ProductPerformance[]> {
    await delay(120);
    const { operations, quotes } = await loadCore();
    return buildProducts(operations, quotes);
  },

  async getCustomerMetrics(): Promise<CustomerMetrics[]> {
    await delay(120);
    const { operations, quotes } = await loadCore();
    return buildCustomers(operations, quotes);
  },

  async getRevenueEvolution() {
    await delay(120);
    const { quotes } = await loadCore();
    return buildRevenueEvolution(quotes);
  },

  async getRevenueEvaluation() {
    await delay(120);
    const { quotes } = await loadCore();
    return buildRevenueEvaluation(quotes);
  },

  async getOpportunityDetails(): Promise<OpportunityDetails[]> {
    await delay(120);
    const { quotes } = await loadCore();
    return buildOpportunities(quotes);
  },

  async getSalespersonDetails(): Promise<SalespersonDetails[]> {
    await delay(120);
    const { quotes } = await loadCore();
    return buildSalespersonDetails(quotes);
  },

  subscribeToUpdates(_callback: (data: unknown) => void) {
    return () => {};
  },
};
