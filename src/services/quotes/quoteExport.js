/**
 * Export devis (HTML imprimable / téléchargeable, CSV) — données locales, prêt envoi client.
 */

import { APP_NAME } from "@/config/branding";

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatFrDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });
}

function formatMoney(n, currency = "EUR") {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(Number(n) || 0);
}

const STATUS_FR = {
  draft: "Brouillon",
  sent: "Envoyé",
  accepted: "Accepté",
  rejected: "Refusé",
  expired: "Expiré",
  invoiced: "Facturé",
};

/**
 * @param {Record<string, unknown>} quote
 * @param {{ exporterName?: string }} [opts]
 */
export function buildQuoteHtmlDocument(quote, opts = {}) {
  const exporterName = opts.exporterName || "—";
  const ht = Number(quote.amount_ht) || 0;
  const ttc = Number(quote.amount_ttc) || 0;
  const vatRate = Number(quote.vat_rate) || 0;
  const vatAmount = Math.round((ttc - ht) * 100) / 100;
  const statusLabel = STATUS_FR[quote.status] || String(quote.status || "—");

  const rows = [
    ["Référence devis", quote.reference],
    ["Date d’export", formatFrDate(new Date().toISOString())],
    ["Exporté par", exporterName],
    ["Client (raison sociale)", quote.client_company],
    ["Contact", [quote.contact_name, quote.contact_email].filter(Boolean).join(" — ") || "—"],
    ["Commercial / responsable", quote.commercial_owner || "—"],
    ["Intitulé", quote.title],
    ["Statut", statusLabel],
    ["Valable jusqu’au", formatFrDate(quote.valid_until)],
    ["Devise", quote.currency || "EUR"],
    ["Montant HT", formatMoney(ht, quote.currency || "EUR")],
    ["Taux TVA", `${vatRate} %`],
    ["Montant TVA", formatMoney(vatAmount, quote.currency || "EUR")],
    ["Montant TTC", formatMoney(ttc, quote.currency || "EUR")],
    ["Créé le", formatFrDate(quote.created_date)],
    ["Notes / conditions", quote.notes ? String(quote.notes) : "—"],
  ];

  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr><th style="text-align:left;padding:10px 12px;border:1px solid #e2e8f0;background:#f8fafc;width:32%;">${escapeHtml(k)}</th><td style="padding:10px 12px;border:1px solid #e2e8f0;">${escapeHtml(v)}</td></tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Devis ${escapeHtml(quote.reference)} — ${escapeHtml(APP_NAME)}</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color: #0f172a; margin: 0; padding: 32px; line-height: 1.5; }
    h1 { font-size: 1.5rem; margin: 0 0 8px; }
    .sub { color: #64748b; font-size: 0.9rem; margin-bottom: 28px; }
    table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <h1>Proposition commerciale</h1>
  <p class="sub">${escapeHtml(APP_NAME)} — document généré depuis l’application (données locales).</p>
  <table>${tableRows}</table>
  <p style="margin-top:28px;font-size:0.85rem;color:#64748b;">Ce document est fourni à titre informatif. Les montants et conditions contractuels font foi sur la version validée dans votre outil de gestion.</p>
</body>
</html>`;
}

/**
 * @param {Record<string, unknown>} quote
 * @param {{ exporterName?: string }} [opts]
 */
export function downloadQuoteHtml(quote, opts = {}) {
  const html = buildQuoteHtmlDocument(quote, opts);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safeRef = String(quote.reference || "devis").replace(/[^\w.-]+/g, "_");
  a.href = url;
  a.download = `Devis_${safeRef}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * @param {Record<string, unknown>} quote
 * @param {{ exporterName?: string }} [opts]
 */
export function printQuoteDocument(quote, opts = {}) {
  const html = buildQuoteHtmlDocument(quote, opts);
  const w = window.open("", "_blank", "noopener,noreferrer,width=960,height=1120");
  if (!w) return false;
  w.document.open();
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => {
    try {
      w.print();
    } catch {
      /* ignore */
    }
  }, 250);
  return true;
}

/**
 * @param {Record<string, unknown>} quote
 */
export function downloadQuoteCsv(quote) {
  const headers = [
    "reference",
    "client_company",
    "commercial_owner",
    "contact_name",
    "contact_email",
    "title",
    "status",
    "valid_until",
    "currency",
    "amount_ht",
    "vat_rate",
    "amount_ttc",
    "notes",
    "created_date",
  ];
  const esc = (v) => {
    const s = String(v ?? "");
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const line = headers.map((h) => esc(quote[h])).join(";");
  const csv = `${headers.join(";")}\n${line}\n`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safeRef = String(quote.reference || "devis").replace(/[^\w.-]+/g, "_");
  a.href = url;
  a.download = `Devis_${safeRef}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
