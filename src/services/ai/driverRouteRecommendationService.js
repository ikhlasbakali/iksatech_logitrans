/**
 * Classement de chauffeurs pour un trajet — heuristique locale (simulation « IA »).
 * À brancher sur un modèle + API (géoloc, historique, trafic) en production.
 */

function normalizeText(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function tokensFromCity(city) {
  const n = normalizeText(city);
  if (!n) return [];
  return n.split(/[\s,;-]+/).filter((t) => t.length > 2);
}

function locationMatchesPickup(location, pickupCity) {
  const loc = normalizeText(location);
  if (!loc) return false;
  const cityNorm = normalizeText(pickupCity);
  if (cityNorm && loc.includes(cityNorm)) return true;
  for (const t of tokensFromCity(pickupCity)) {
    if (t.length >= 4 && loc.includes(t)) return true;
  }
  return false;
}

/**
 * @param {{
 *   pickup_city?: string,
 *   delivery_city?: string,
 *   drivers: Array<Record<string, unknown>>,
 *   adr_goods?: boolean,
 *   temperature_controlled?: boolean,
 * }} input
 * @returns {{ items: Array<{ driver: object, score: number, reasons: string[] }>, hint: string }}
 */
export function buildDriverRouteRecommendations(input) {
  const pickup = String(input.pickup_city || "").trim();
  const delivery = String(input.delivery_city || "").trim();
  const drivers = Array.isArray(input.drivers) ? input.drivers : [];
  const adr = Boolean(input.adr_goods);
  const frigo = Boolean(input.temperature_controlled);

  if (drivers.length === 0) {
    return {
      items: [],
      hint: "Aucun chauffeur disponible pour ce créneau — élargissez la fenêtre ou complétez le dossier sans affectation.",
    };
  }

  const now = Date.now();
  const items = drivers.map((driver) => {
    const reasons = [];
    let score = 42;

    const rating = Number(driver.rating) || 0;
    score += Math.min(18, rating * 3.2);
    const onTime = Number(driver.on_time_rate) || 0;
    if (onTime >= 95) {
      score += 14;
      reasons.push(`Ponctualité élevée (${onTime} % à l’heure)`);
    } else if (onTime >= 88) {
      score += 8;
      reasons.push(`Bonne ponctualité (${onTime} %)`);
    }

    const certs = Array.isArray(driver.certifications) ? driver.certifications : [];
    if (adr && certs.some((c) => String(c).toUpperCase() === "ADR")) {
      score += 22;
      reasons.push("Certification ADR adaptée au fret réglementé");
    } else if (adr && !certs.some((c) => String(c).toUpperCase() === "ADR")) {
      score -= 12;
      reasons.push("ADR requis sur le dossier — profil non certifié");
    }
    if (frigo && certs.some((c) => String(c).toLowerCase().includes("frigo"))) {
      score += 14;
      reasons.push("Expérience matériel frigorifique");
    }

    const deliveries = Number(driver.total_deliveries) || 0;
    if (deliveries >= 200) {
      score += 8;
      reasons.push(`${deliveries} livraisons enregistrées (expérience)`);
    } else if (deliveries >= 80) {
      score += 4;
    }

    if (pickup && locationMatchesPickup(driver.current_location, pickup)) {
      score += 26;
      reasons.push(`Position / zone proche de l’enlèvement (${pickup})`);
    } else if (pickup) {
      reasons.push("À rapprocher du point d’enlèvement selon planning");
    }

    const visa = driver.work_visa_expiry;
    if (visa) {
      const t = new Date(visa).getTime();
      if (!Number.isNaN(t) && t < now) {
        score -= 25;
        reasons.push("Visa / habilitation : date dépassée — vérifier en interne");
      } else if (!Number.isNaN(t) && t < now + 21 * 86400000) {
        score -= 6;
        reasons.push("Visa / habilitation à renouveler sous 3 semaines");
      }
    }

    score = Math.max(0, Math.min(100, Math.round(score)));
    return { driver, score, reasons: reasons.length ? reasons : ["Profil compatible trajet standard"] };
  });

  items.sort((a, b) => b.score - a.score);

  let hint =
    pickup && delivery
      ? `Analyse locale du trajet ${pickup} → ${delivery} (données flotte + règles métier).`
      : pickup
        ? `Enlèvement ${pickup} — complétez la ville de livraison pour affiner le classement.`
        : "Indiquez au moins la ville d’enlèvement (étape adresses) pour prioriser la proximité.";

  return { items: items.slice(0, 6), hint };
}
