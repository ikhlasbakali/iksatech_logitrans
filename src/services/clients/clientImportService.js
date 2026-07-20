/**
 * Modèle fichier clients + parsing CSV / JSON pour import en masse.
 * Colonnes stables (ligne d’en-tête obligatoire pour CSV).
 */

export const CLIENT_FILE_COLUMNS = [
  "company_name",
  "external_code",
  "legal_id",
  "sector",
  "contact_name",
  "contact_email",
  "contact_phone",
  "address_line1",
  "city",
  "postal_code",
  "country",
  "payment_terms",
  "notes",
];

/** Alias FR / EN (clé normalisée → company_name, etc.) */
const KEY_ALIASES = {
  company_name: [
    "company_name",
    "raison_sociale",
    "societe",
    "client",
    "nom_client",
    "entreprise",
  ],
  external_code: ["external_code", "code_client", "ref_client", "customer_code"],
  legal_id: ["legal_id", "siret", "tva", "vat_number", "identifiant_legal"],
  sector: ["sector", "secteur", "industry"],
  contact_name: ["contact_name", "nom_contact", "contact"],
  contact_email: ["contact_email", "email", "courriel"],
  contact_phone: ["contact_phone", "telephone", "tel", "phone", "mobile"],
  address_line1: ["address_line1", "adresse", "address", "rue"],
  city: ["city", "ville"],
  postal_code: ["postal_code", "code_postal", "cp", "zip"],
  country: ["country", "pays"],
  payment_terms: ["payment_terms", "conditions_paiement", "modalites_paiement"],
  notes: ["notes", "commentaires", "remarques"],
};

function normalizeHeader(h) {
  return String(h || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function mapAliasToCanonical(keyNorm) {
  for (const [canonical, aliases] of Object.entries(KEY_ALIASES)) {
    for (const a of aliases) {
      if (normalizeHeader(a) === keyNorm) return canonical;
    }
  }
  return null;
}

function parseCsvLine(line, delimiter) {
  const out = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    if (c === '"') {
      inQuote = !inQuote;
    } else if (!inQuote && c === delimiter) {
      out.push(cur.trim());
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur.trim());
  return out.map((cell) => cell.replace(/^"|"$/g, "").replace(/""/g, '"'));
}

function detectDelimiter(headerLine) {
  const semi = (headerLine.match(/;/g) || []).length;
  const comma = (headerLine.match(/,/g) || []).length;
  return semi >= comma ? ";" : ",";
}

function rowFromHeaders(headers, cells) {
  const row = {};
  headers.forEach((h, i) => {
    const keyNorm = normalizeHeader(h);
    const canon = CLIENT_FILE_COLUMNS.includes(keyNorm)
      ? keyNorm
      : mapAliasToCanonical(keyNorm);
    if (canon && cells[i] != null && String(cells[i]).trim() !== "") {
      row[canon] = String(cells[i]).trim();
    }
  });
  return row;
}

export function normalizeClientRow(raw) {
  if (!raw || typeof raw !== "object") return {};
  const out = {};
  for (const col of CLIENT_FILE_COLUMNS) {
    const aliases = KEY_ALIASES[col];
    for (const a of aliases) {
      const keys = Object.keys(raw);
      const found = keys.find((k) => normalizeHeader(k) === normalizeHeader(a));
      if (found && raw[found] != null && String(raw[found]).trim() !== "") {
        out[col] = String(raw[found]).trim();
        break;
      }
    }
  }
  return out;
}

export function validateClientRow(row, index) {
  const name = String(row.company_name || "").trim();
  if (!name) {
    return { ok: false, error: `Ligne ${index + 1} : raison sociale (company_name) obligatoire.` };
  }
  const email = row.contact_email ? String(row.contact_email).trim() : "";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: `Ligne ${index + 1} : e-mail contact invalide.` };
  }
  return { ok: true, data: { ...row, company_name: name } };
}

/**
 * @param {string} text
 * @returns {{ rows: Record<string,string>[], errors: string[] }}
 */
export function parseClientCsv(text) {
  const errors = [];
  const lines = String(text || "")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length < 2) {
    errors.push("Le fichier CSV doit contenir une ligne d’en-tête et au moins une ligne de données.");
    return { rows: [], errors };
  }
  const delimiter = detectDelimiter(lines[0]);
  const headers = parseCsvLine(lines[0], delimiter);
  const rows = [];
  for (let i = 1; i < lines.length; i += 1) {
    const cells = parseCsvLine(lines[i], delimiter);
    const row = rowFromHeaders(headers, cells);
    const v = validateClientRow(row, i);
    if (!v.ok) {
      errors.push(v.error);
      continue;
    }
    rows.push(v.data);
  }
  return { rows, errors };
}

/**
 * @param {string} text
 */
export function parseClientJson(text) {
  const errors = [];
  let data;
  try {
    data = JSON.parse(String(text || "").replace(/^\uFEFF/, ""));
  } catch {
    errors.push("JSON invalide.");
    return { rows: [], errors };
  }
  const arr = Array.isArray(data) ? data : data.clients;
  if (!Array.isArray(arr)) {
    errors.push("Le JSON doit être un tableau d’objets clients, ou { \"clients\": [ ... ] }.");
    return { rows: [], errors };
  }
  const rows = [];
  arr.forEach((item, i) => {
    const row = normalizeClientRow(item);
    const v = validateClientRow(row, i);
    if (!v.ok) {
      errors.push(v.error);
      return;
    }
    rows.push(v.data);
  });
  return { rows, errors };
}

/**
 * @param {File} file
 * @returns {Promise<{ rows: Record<string,string>[], errors: string[], format: string }>}
 */
export async function parseClientImportFile(file) {
  const text = await file.text();
  const name = (file.name || "").toLowerCase();
  if (name.endsWith(".json")) {
    const { rows, errors } = parseClientJson(text);
    return { rows, errors, format: "json" };
  }
  const { rows, errors } = parseClientCsv(text);
  return { rows, errors, format: "csv" };
}

export function buildClientTemplateCsv() {
  const header = CLIENT_FILE_COLUMNS.join(";");
  const example = [
    "Vostok Freight OÜ",
    "CLI-001",
    "FR12345678901",
    "Industrie",
    "Nadia El Mansouri",
    "contact@atlas.example",
    "+212522000000",
    "Zone industrielle Nord",
    "Casablanca",
    "20000",
    "Maroc",
    "30 jours fin de mois",
    "Client stratégique — incoterms selon contrat-cadre.",
  ].join(";");
  return `${header}\n${example}\n`;
}

export function buildClientTemplateJson() {
  const sample = {
    company_name: "Vostok Freight OÜ",
    external_code: "CLI-002",
    legal_id: "EE99887766554",
    sector: "Tech",
    contact_name: "Import desk",
    contact_email: "imports@vostok-freight.demo",
    contact_phone: "+33123456789",
    address_line1: "10 rue du Commerce",
    city: "Paris",
    postal_code: "75002",
    country: "France",
    payment_terms: "45 jours date de facture",
    notes: "Exemple — remplir une entrée par objet dans le tableau.",
  };
  return `${JSON.stringify([sample], null, 2)}\n`;
}

/**
 * @param {Record<string, unknown>[]} rows
 * @param {Record<string, unknown>[]} existingClients
 */
export function partitionNewClients(rows, existingClients) {
  const existing = new Set(
    (existingClients || []).map((c) => String(c.company_name || "").trim().toLowerCase())
  );
  const toCreate = [];
  const skipped = [];
  for (const row of rows) {
    const key = String(row.company_name || "").trim().toLowerCase();
    if (existing.has(key)) {
      skipped.push(row.company_name);
      continue;
    }
    existing.add(key);
    toCreate.push(row);
  }
  return { toCreate, skipped };
}
