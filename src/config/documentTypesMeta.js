/**
 * Libellés et styles pour tous les types de documents (obligatoires + complémentaires).
 */

export const DOCUMENT_TYPES_META = {
  nota: { label: "Nota", color: "bg-sky-100 text-sky-800" },
  commercial_invoice: { label: "Facture commerciale", color: "bg-violet-100 text-violet-800" },
  cmr: { label: "CMR", color: "bg-blue-100 text-blue-800" },
  loading_sheet: { label: "Fiche chargement / déchargement", color: "bg-cyan-100 text-cyan-800" },
  mrn: { label: "MRN", color: "bg-amber-100 text-amber-900" },
  t1: { label: "T1", color: "bg-orange-100 text-orange-900" },
  salida: { label: "Salida", color: "bg-lime-100 text-lime-900" },
  eur1: { label: "EUR1", color: "bg-emerald-100 text-emerald-900" },
  mlv: { label: "MLV", color: "bg-green-100 text-green-800" },
  bl: { label: "BL (historique)", color: "bg-green-100 text-green-700" },
  invoice: { label: "Facture (historique)", color: "bg-purple-100 text-purple-700" },
  pod: { label: "POD", color: "bg-amber-100 text-amber-700" },
  packing_list: { label: "Packing list", color: "bg-indigo-100 text-indigo-700" },
  customs: { label: "Douane (autre)", color: "bg-red-100 text-red-700" },
  photo: { label: "Photo", color: "bg-pink-100 text-pink-700" },
  other: { label: "Autre", color: "bg-slate-100 text-slate-700" },
};

export function getDocumentTypeMeta(type) {
  return DOCUMENT_TYPES_META[type] || DOCUMENT_TYPES_META.other;
}
