import { dataRepository } from "@/services/repository/dataRepository";

/**
 * Historique de statut document (audit) — affichable sous chaque pièce.
 */
export async function recordDocumentAudit({ documentId, dossier_reference, action, actor, notes }) {
  return dataRepository.documentAuditLog.create({
    document_id: documentId,
    dossier_reference: dossier_reference || "",
    action,
    actor: actor || "Système",
    notes: notes || null,
  });
}

export async function listAuditForDocument(documentId) {
  const rows = await dataRepository.documentAuditLog.filter({ document_id: documentId }, "-created_date");
  return rows;
}
