/**
 * Agrégations analytiques à partir des entités locales — prêtes à consommer une API /analytics.
 */
import { dataRepository } from "@/services/repository/dataRepository";

export async function computeDeliveryAnalytics() {
  const operations = await dataRepository.operations.list();
  const n = operations.length || 1;
  const delivered = operations.filter((o) => o.status === "delivered").length;
  const heavyDelay = operations.filter((o) => (o.delay_minutes ?? 0) > 30).length;
  const sumDelay = operations.reduce((s, o) => s + (o.delay_minutes ?? 0), 0);

  const drivers = await dataRepository.drivers.list();

  return {
    operations_total: operations.length,
    delivery_rate_pct: Math.round((delivered / n) * 100),
    delay_rate_pct: Math.round((heavyDelay / n) * 100),
    avg_delay_minutes: Math.round(sumDelay / n),
    driver_scores: drivers.map((d) => ({
      id: d.id,
      name: `${d.first_name} ${d.last_name}`,
      on_time_rate: d.on_time_rate,
      deliveries: d.total_deliveries,
      rating: d.rating,
    })),
  };
}

export function operationsToReportRows(operations) {
  return operations.map((o) => ({
    reference: o.reference,
    client: o.client_name,
    status: o.status,
    delay_minutes: o.delay_minutes ?? 0,
    pickup_city: o.pickup_city,
    delivery_city: o.delivery_city,
    incoterm: o.incoterm ?? "",
  }));
}
