/**
 * Conventions pour flux internationaux (traçabilité, douane, échanges B2B).
 * Dates : stockage ISO 8601 UTC ; affichage local + UTC pour audit.
 */

export const INCOTERMS_2020 = [
  { code: "EXW", label: "EXW — À l’usine" },
  { code: "FCA", label: "FCA — Franco transporteur" },
  { code: "CPT", label: "CPT — Port payé jusqu’à" },
  { code: "CIP", label: "CIP — Port payé assurance jusqu’à" },
  { code: "DAP", label: "DAP — Rendu lieu de destination" },
  { code: "DPU", label: "DPU — Rendu déchargé" },
  { code: "DDP", label: "DDP — Rendu droits acquittés" },
  { code: "FAS", label: "FAS — Franco le long du navire" },
  { code: "FOB", label: "FOB — Franco à bord" },
  { code: "CFR", label: "CFR — Coût et fret" },
  { code: "CIF", label: "CIF — Coût assurance et fret" },
];

/** @param {string | Date | null | undefined} iso */
export function formatUtcLong(iso) {
  if (!iso) return "—";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(d);
}

/** @param {string | Date | null | undefined} iso @param {string} [timeZone] IANA, défaut = navigateur */
export function formatLocalLong(iso, timeZone) {
  if (!iso) return "—";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return "—";
  const tz = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: tz,
    timeZoneName: "short",
  }).format(d);
}

export function nowIsoUtc() {
  return new Date().toISOString();
}

/** ISO 3166-1 alpha-2 basique (validation légère côté UI) */
export function normalizeCountryCode(code) {
  const c = (code || "").trim().toUpperCase();
  if (/^[A-Z]{2}$/.test(c)) return c;
  return "";
}
