import { format } from "date-fns";
import { fr } from "date-fns/locale";

const MS_DAY = 86400000;

/**
 * Classe chaque chauffeur pour filtres / badges (champ `work_visa_expiry`).
 * @returns {"sans" | "invalide" | "expire" | "bientot" | "valide"}
 */
export function classifyDriverVisa(driver, options = {}) {
  const soonDays = typeof options.soonDays === "number" ? options.soonDays : 30;
  const raw = driver?.work_visa_expiry;
  if (!raw) return "sans";
  const exp = new Date(raw);
  if (Number.isNaN(exp.getTime())) return "invalide";
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const soonEnd = new Date(start.getTime() + soonDays * MS_DAY);
  if (exp.getTime() < start.getTime()) return "expire";
  if (exp.getTime() <= soonEnd.getTime()) return "bientot";
  return "valide";
}

/**
 * Libellés et styles pour cartes / listes.
 * @returns {{ category: string, shortLabel: string, detailLabel: string, badgeClassName: string }}
 */
export function getDriverVisaPresentation(driver, options = {}) {
  const soonDays = typeof options.soonDays === "number" ? options.soonDays : 30;
  const cat = classifyDriverVisa(driver, { soonDays });
  const raw = driver?.work_visa_expiry;
  const exp = raw ? new Date(raw) : null;
  const dstr =
    exp && !Number.isNaN(exp.getTime()) ? format(exp, "dd/MM/yyyy", { locale: fr }) : "";

  switch (cat) {
    case "sans":
      return {
        category: "sans",
        shortLabel: "Sans visa",
        detailLabel: "Aucune date d’expiration enregistrée (non concerné, UE, ou à compléter).",
        badgeClassName: "border-slate-200 bg-slate-100 text-slate-800",
      };
    case "invalide":
      return {
        category: "invalide",
        shortLabel: "Titre — date invalide",
        detailLabel: "Corrigez la date d’expiration dans la fiche.",
        badgeClassName: "border-slate-300 bg-slate-50 text-slate-700",
      };
    case "expire":
      return {
        category: "expire",
        shortLabel: "Visa expiré",
        detailLabel: dstr ? `Expiration enregistrée : ${dstr}` : "Titre expiré.",
        badgeClassName: "border-rose-200 bg-rose-50 text-rose-900",
      };
    case "bientot":
      return {
        category: "bientot",
        shortLabel: "Visa — expire bientôt",
        detailLabel: dstr ? `Fin au ${dstr} (≤ ${soonDays} j.)` : `Expire dans les ${soonDays} prochains jours`,
        badgeClassName: "border-amber-200 bg-amber-50 text-amber-950",
      };
    default:
      return {
        category: "valide",
        shortLabel: "Visa valide",
        detailLabel: dstr ? `Valide jusqu’au ${dstr}` : "Titre de travail en cours de validité",
        badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-900",
      };
  }
}

/**
 * Statut visa travail chauffeur (champ `work_visa_expiry`, ISO date).
 * — Avec visa : date d’expiration ≥ aujourd’hui (y compris alerte < 30 j.)
 * — Sans visa : pas de date renseignée
 * — Expirés : date < aujourd’hui
 * — Expirant bientôt : sous-ensemble des « avec visa », fin dans ≤ 30 jours
 */
export function computeDriverVisaStats(drivers, options = {}) {
  const soonDays = typeof options.soonDays === "number" ? options.soonDays : 30;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const soonEnd = new Date(start.getTime() + soonDays * MS_DAY);

  let avecVisa = 0;
  let sansVisa = 0;
  let visasExpires = 0;
  let expirantBientot = 0;
  /** @type {{ id: string, name: string, expiry: string }[]} */
  const expirantBientotList = [];

  for (const d of drivers || []) {
    const raw = d.work_visa_expiry;
    if (!raw) {
      sansVisa += 1;
      continue;
    }
    const exp = new Date(raw);
    if (Number.isNaN(exp.getTime())) {
      sansVisa += 1;
      continue;
    }
    if (exp.getTime() < start.getTime()) {
      visasExpires += 1;
      continue;
    }
    avecVisa += 1;
    if (exp.getTime() <= soonEnd.getTime()) {
      expirantBientot += 1;
      const name = [d.first_name, d.last_name].filter(Boolean).join(" ").trim() || d.id;
      expirantBientotList.push({ id: d.id, name, expiry: raw });
    }
  }

  expirantBientotList.sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());

  return { avecVisa, sansVisa, visasExpires, expirantBientot, expirantBientotList };
}
