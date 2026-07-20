/**
 * Pièces obligatoires par dossier d’opération (transport international / douane).
 * Flux indicatif : Nota → Facture commerciale → CMR → Chargement → Douane (MRN / T1) → Salida → EUR1 → Livraison (MLV)
 */

export const REQUIRED_OPERATION_DOC_FLOW_SUMMARY =
  "Nota → Facture commerciale → CMR → Fiche chargement/déchargement → Douane (MRN / T1) → Salida → EUR1 → MLV (livraison).";

/** @typedef {{ id: string, label: string, description: string }} RequiredDocDef */

/** @type {RequiredDocDef[]} */
export const REQUIRED_OPERATION_DOCUMENTS = [
  {
    id: "nota",
    label: "Nota (demande de réservation)",
    description:
      "Demande de réservation de transport (camion, conteneur, etc.). Point de départ du processus logistique.",
  },
  {
    id: "commercial_invoice",
    label: "Facture commerciale",
    description:
      "Document essentiel : détail de la marchandise et prix pour la douane et le paiement.",
  },
  {
    id: "cmr",
    label: "CMR (lettre de voiture internationale)",
    description: "Contrat de transport routier international. Preuve officielle du transport de marchandises.",
  },
  {
    id: "loading_sheet",
    label: "Fiche de chargement / déchargement",
    description:
      "Suivi des opérations de chargement et déchargement ; quantités et état des marchandises.",
  },
  {
    id: "mrn",
    label: "MRN (Movement Reference Number)",
    description: "Numéro douanier identifiant une déclaration d’import/export ou de transit.",
  },
  {
    id: "t1",
    label: "T1",
    description:
      "Document de transit douanier pour transporter des marchandises sans payer immédiatement les droits.",
  },
  {
    id: "salida",
    label: "Salida",
    description: "Preuve de sortie de la marchandise d’un territoire (souvent UE).",
  },
  {
    id: "eur1",
    label: "EUR1",
    description: "Certificat d’origine pour réduire ou supprimer les droits de douane selon les accords commerciaux.",
  },
  {
    id: "mlv",
    label: "MLV",
    description: "Bon de livraison confirmant la réception de la marchandise par le client.",
  },
];

const REQUIRED_IDS = REQUIRED_OPERATION_DOCUMENTS.map((d) => d.id);

/**
 * Un document existant peut couvrir une case obligatoire (types historiques / synonymes).
 * @param {string} docType
 * @param {string} requiredId
 */
export function documentFulfillsRequiredSlot(docType, requiredId) {
  const t = String(docType || "").trim();
  if (!t) return false;
  if (t === requiredId) return true;
  if (requiredId === "commercial_invoice" && t === "invoice") return true;
  if (requiredId === "mlv" && t === "bl") return true;
  return false;
}

/**
 * @param {Array<{ type?: string }>} documents
 * @returns {Set<string>}
 */
export function getFulfilledRequiredDocIds(documents) {
  const fulfilled = new Set();
  const list = documents || [];
  for (const req of REQUIRED_OPERATION_DOCUMENTS) {
    if (list.some((d) => documentFulfillsRequiredSlot(d?.type, req.id))) {
      fulfilled.add(req.id);
    }
  }
  return fulfilled;
}

/**
 * @param {Array<{ type?: string }>} documents
 * @returns {RequiredDocDef[]}
 */
export function getMissingRequiredDocuments(documents) {
  const fulfilled = getFulfilledRequiredDocIds(documents);
  return REQUIRED_OPERATION_DOCUMENTS.filter((d) => !fulfilled.has(d.id));
}

/**
 * @param {Array<{ type?: string }>} documents
 */
export function isOperationMandatoryDocumentSetComplete(documents) {
  return getMissingRequiredDocuments(documents).length === 0;
}

export const REQUIRED_DOCUMENT_TYPE_IDS = [...REQUIRED_IDS];
