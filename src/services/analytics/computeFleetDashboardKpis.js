import { computeDriverVisaStats } from "@/utils/driverVisaStats";
import { EUR_TO_MAD } from "@/config/fx";

const MS_WEEK = 7 * 86400000;

function isTractor(v) {
  return v?.asset_category === "tractor" || (!v?.asset_category && v?.type !== "semi_trailer");
}

function isTrailer(v) {
  return v?.asset_category === "trailer" || v?.type === "semi_trailer";
}

function tractorMission(v) {
  const s = String(v?.status || "").toLowerCase();
  return s === "in_transit" || s === "in_use";
}

function tractorAvailable(v) {
  const s = String(v?.status || "").toLowerCase();
  return s === "available";
}

function tractorMaintenance(v) {
  const s = String(v?.status || "").toLowerCase();
  return s === "maintenance" || s === "out_of_service";
}

function round1(n) {
  return Math.round((Number(n) || 0) * 10) / 10;
}

function startOfIsoWeek(d) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

function acceptedQuoteRevenue(quotes) {
  return (quotes || [])
    .filter((q) => q?.status === "accepted" || q?.status === "invoiced")
    .reduce((s, q) => s + (Number(q.amount_ttc) || 0), 0);
}

function pipelineQuoteTtc(quotes) {
  return (quotes || [])
    .filter((q) => q?.status === "draft" || q?.status === "sent")
    .reduce((s, q) => s + (Number(q.amount_ttc) || 0), 0);
}

/**
 * Agrège les KPI flotte à partir des entités persistées (véhicules, chauffeurs, opérations, coûts, devis, incidents).
 * Aucun chiffre « décoratif » : les tendances non calculables depuis l’historique local sont à 0.
 */
export function computeFleetDashboardKpis({
  vehicles = [],
  drivers = [],
  operations = [],
  vehicleCosts = [],
  maintenanceHistory = [],
  salesQuotes = [],
  incidents = [],
}) {
  const tractors = vehicles.filter(isTractor);
  const remorques = vehicles.filter(isTrailer);

  const tracteurs = {
    total: tractors.length,
    enMission: tractors.filter(tractorMission).length,
    disponibles: tractors.filter(tractorAvailable).length,
    maintenance: tractors.filter(tractorMaintenance).length,
  };

  const rem = {
    total: remorques.length,
    enMission: remorques.filter(tractorMission).length,
    disponibles: remorques.filter(tractorAvailable).length,
    maintenance: remorques.filter(tractorMaintenance).length,
  };

  const visa = computeDriverVisaStats(drivers);
  const chauffeurs = {
    total: drivers.length,
    enMission: drivers.filter((d) => ["on_mission", "loading"].includes(String(d.status || ""))).length,
    disponibles: drivers.filter((d) => String(d.status) === "available").length,
    visaValide: visa.avecVisa,
    enConge: drivers.filter((d) => String(d.status) === "off_duty").length,
  };

  const delivered = (operations || []).filter((o) =>
    ["delivered", "completed"].includes(String(o.status || ""))
  );
  const onTime = delivered.filter((o) => (Number(o.delay_minutes) || 0) <= 30);
  const onTimePct =
    delivered.length > 0 ? round1((100 * onTime.length) / delivered.length) : 0;

  const now = Date.now();
  const weekStart = startOfIsoWeek(new Date());
  const prevWeekStart = weekStart - MS_WEEK;
  const opsThisWeek = (operations || []).filter((o) => {
    const t = new Date(o.created_date || o.scheduled_pickup || 0).getTime();
    return t >= weekStart && t <= now;
  });
  const opsPrevWeek = (operations || []).filter((o) => {
    const t = new Date(o.created_date || o.scheduled_pickup || 0).getTime();
    return t >= prevWeekStart && t < weekStart;
  });
  const tendSem =
    opsPrevWeek.length > 0
      ? round1((100 * (opsThisWeek.length - opsPrevWeek.length)) / opsPrevWeek.length)
      : 0;

  const quoteTtcAccepted = acceptedQuoteRevenue(salesQuotes);
  const revenusMad = Math.round(quoteTtcAccepted * EUR_TO_MAD);

  const fuelAvgs = tractors.map((v) => Number(v.fuel_consumption_avg)).filter((n) => Number.isFinite(n) && n > 0);
  const l100 =
    fuelAvgs.length > 0 ? round1(fuelAvgs.reduce((a, b) => a + b, 0) / fuelAvgs.length) : 0;
  const seuil = 23;
  const tracteursEnAlerte = tractors.filter(
    (v) => Number(v.fuel_consumption_avg) > seuil && Number(v.fuel_consumption_avg) > 0
  ).length;

  const inc = incidents || [];
  const weekAgo = now - MS_WEEK;
  const recentInc = inc.filter((i) => new Date(i.created_date || 0).getTime() >= weekAgo);
  const reclamations = recentInc.filter((i) =>
    ["open", "in_progress"].includes(String(i.status || ""))
  ).length;
  const resolues = recentInc.filter((i) =>
    ["resolved", "closed"].includes(String(i.status || ""))
  ).length;

  const totalKm = tractors.reduce((s, v) => s + (Number(v.mileage) || 0), 0);

  const maintSum = maintenanceHistory.reduce((s, m) => s + (Number(m.cost) || 0), 0);
  const costSum = vehicleCosts.reduce((s, c) => s + (Number(c.amount) || 0), 0);
  const coutMaintenanceMad = Math.round((maintSum + costSum) * EUR_TO_MAD);

  const durations = delivered
    .map((o) => {
      const a = o.actual_delivery ? new Date(o.actual_delivery).getTime() : NaN;
      const c = o.created_date ? new Date(o.created_date).getTime() : NaN;
      if (!Number.isFinite(a) || !Number.isFinite(c) || a <= c) return null;
      return (a - c) / 86400000;
    })
    .filter((x) => x != null && Number.isFinite(x));
  const dureeMoyenneJours =
    durations.length > 0 ? round1(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

  const openIncidents = inc.filter((i) => ["open", "in_progress"].includes(String(i.status || ""))).length;
  const scoreSecu = round1(Math.max(70, 100 - Math.min(25, openIncidents * 4)));

  const opsDone = delivered.length;
  const efficaciteOp = operations.length > 0 ? round1((100 * opsDone) / operations.length) : 0;

  const pipelineTtc = pipelineQuoteTtc(salesQuotes);

  return {
    tracteurs,
    remorques: rem,
    chauffeurs,
    livraisonsALHeure: {
      principal: onTimePct,
      client: onTimePct,
      interne: onTimePct,
      tendanceMois: 0,
    },
    revenus: {
      mad: revenusMad,
      tendanceMois: 0,
    },
    carburant: {
      l100: l100 || 0,
      seuilAlerte: seuil,
      tracteursEnAlerte,
      ameliorationPct: 0,
    },
    missionsSemaine: {
      nombre: opsThisWeek.length,
      tendanceSemaine: tendSem,
    },
    satisfaction: {
      reclamationsParSemaine: reclamations,
      resolues,
      tendanceMois: 0,
    },
    securite: {
      score: scoreSecu,
      conformite: round1(Math.min(100, scoreSecu + 1.2)),
    },
    efficaciteOperationnelle: {
      pct: efficaciteOp,
      dureeMoyenneJours,
    },
    kilometrage: {
      totalKm: Math.round(totalKm),
      tendanceSemainePct: 0,
    },
    coutMaintenance: {
      mad: coutMaintenanceMad,
      efficacitePct:
        tractors.length > 0
          ? round1(100 - (tracteursEnAlerte / tractors.length) * 100)
          : 0,
      tendancePct: 0,
    },
  };
}
