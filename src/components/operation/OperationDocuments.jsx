import React, { useMemo, useState } from 'react';
import { appApi } from '@/api/appApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  FileText,
  Upload,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  Image,
  File,
  ClipboardList,
  AlertTriangle,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import StatusBadge from "@/components/ui/StatusBadge";
import { useAuth } from "@/auth/AuthContext";
import { canValidateDocuments, validatorRolesLabelFr } from "@/utils/documentWorkflow";
import { openDocumentFile } from "@/utils/documentFileActions";
import { dispatchWorkflowEvent } from "@/services/workflow/workflowTriggers";
import { recordDocumentAudit } from "@/services/documents/documentHistoryService";
import { mockExtractMetadata } from "@/services/documents/documentIntelligenceService";
import { DOCUMENT_TYPES_META } from "@/config/documentTypesMeta";
import {
  REQUIRED_OPERATION_DOCUMENTS,
  REQUIRED_OPERATION_DOC_FLOW_SUMMARY,
  getMissingRequiredDocuments,
  getFulfilledRequiredDocIds,
} from "@/config/requiredOperationDocuments";

const documentTypes = DOCUMENT_TYPES_META;

/** @param {{ operationId: string, dossierReference: string }} props */
export default function OperationDocuments({ operationId, dossierReference }) {
  const { user } = useAuth();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFileInputKey, setUploadFileInputKey] = useState(0);
  const firstRequiredType = REQUIRED_OPERATION_DOCUMENTS[0]?.id || "nota";
  const [newDoc, setNewDoc] = useState({ type: firstRequiredType, file: null });
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectDocId, setRejectDocId] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const queryClient = useQueryClient();

  const validator = canValidateDocuments(user);

  const { data: documents = [] } = useQuery({
    queryKey: ['operationDocuments', operationId],
    queryFn: () => appApi.entities.Document.filter({ operation_id: operationId }, '-created_date'),
  });

  const missingRequired = useMemo(() => getMissingRequiredDocuments(documents), [documents]);
  const fulfilledRequired = useMemo(() => getFulfilledRequiredDocIds(documents), [documents]);
  const nextSuggestedType = missingRequired[0]?.id || firstRequiredType;

  const documentDecisionMutation = useMutation({
    mutationFn: async ({ id, decision, notes }) => {
      const now = new Date().toISOString();
      const actor = user?.full_name || user?.email || 'Utilisateur';
      if (decision === 'validated') {
        return appApi.entities.Document.update(id, {
          status: 'validated',
          validated_by: actor,
          validated_at: now,
        });
      }
      return appApi.entities.Document.update(id, {
        status: 'rejected',
        rejected_by: actor,
        rejected_at: now,
        notes: notes?.trim() || 'Rejeté',
      });
    },
    onSuccess: async (updated, vars) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['operationDocuments', operationId] });
      queryClient.invalidateQueries({ queryKey: ['operationEvents', operationId] });
      const actor = user?.full_name || user?.email || 'Utilisateur';
      await recordDocumentAudit({
        documentId: vars.id,
        dossier_reference: updated?.dossier_reference ?? dossierReference,
        action: vars.decision === 'validated' ? 'validated' : 'rejected',
        actor,
        notes: vars.decision === 'rejected' ? vars.notes : undefined,
      });
      if (vars.decision === 'validated') {
        dispatchWorkflowEvent('document.validated', {
          document_name: updated?.name ?? '',
          dossier_reference: updated?.dossier_reference ?? dossierReference ?? '',
        });
      }
      toast.success(vars.decision === 'validated' ? 'Document validé' : 'Document rejeté');
      setRejectOpen(false);
      setRejectDocId(null);
      setRejectNote('');
    },
    onError: () => toast.error('Action impossible'),
  });

  const handleUpload = async () => {
    if (!newDoc.file) return;
    setUploading(true);
    
    try {
      const { file_url } = await appApi.uploadFile({ file: newDoc.file });
      const created = await appApi.entities.Document.create({
        operation_id: operationId,
        dossier_reference: dossierReference || operationId,
        type: newDoc.type,
        name: newDoc.file.name,
        file_url: file_url,
        status: 'pending',
        uploaded_by: user?.full_name || user?.email || 'Exploitation',
      });
      await recordDocumentAudit({
        documentId: created.id,
        dossier_reference: dossierReference || operationId,
        action: 'uploaded',
        actor: user?.full_name || user?.email || 'Exploitation',
      });
      const meta = mockExtractMetadata(newDoc.file.name);
      toast.success('Document enregistré sur le dossier');
      toast.message('Analyse automatique (simulation)', { description: meta.hints[0] });
      queryClient.invalidateQueries({ queryKey: ['operationDocuments', operationId] });
      queryClient.invalidateQueries({ queryKey: ['operationEvents', operationId] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setUploadOpen(false);
      setNewDoc({ type: nextSuggestedType, file: null });
      setUploadFileInputKey((k) => k + 1);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error?.message || 'Échec du dépôt — vérifiez le fichier ou réessayez.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm text-slate-500">{documents.length} document(s) sur le dossier</p>
          {dossierReference && (
            <p className="text-xs font-mono font-semibold text-blue-800 mt-0.5">
              N° dossier : {dossierReference}
            </p>
          )}
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Validation réservée aux profils : {validatorRolesLabelFr()}.
            {validator ? (
              <span className="text-emerald-800"> Vous pouvez valider ou rejeter les pièces « en attente ».</span>
            ) : user ? (
              <span className="text-amber-800"> Avec votre rôle, consultation seule.</span>
            ) : null}
          </p>
        </div>
        <Dialog
          open={uploadOpen}
          onOpenChange={(open) => {
            setUploadOpen(open);
            if (open) {
              setNewDoc((prev) => ({ ...prev, type: nextSuggestedType, file: null }));
            } else {
              setNewDoc((prev) => ({ ...prev, file: null }));
              setUploadFileInputKey((k) => k + 1);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Type de document</label>
                <Select value={newDoc.type} onValueChange={(v) => setNewDoc((prev) => ({ ...prev, type: v }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(documentTypes).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Fichier</label>
                <Input
                  key={uploadFileInputKey}
                  type="file"
                  className="mt-1"
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.txt,application/pdf,image/*"
                  onChange={(e) =>
                    setNewDoc((prev) => ({ ...prev, file: e.target.files?.[0] || null }))
                  }
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleUpload}
                disabled={!newDoc.file || uploading}
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Upload en cours...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Télécharger
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
        <div className="flex items-start gap-2">
          <ClipboardList className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900">Pièces obligatoires par dossier</p>
            <p className="text-xs text-slate-600 mt-1">{REQUIRED_OPERATION_DOC_FLOW_SUMMARY}</p>
          </div>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {REQUIRED_OPERATION_DOCUMENTS.map((req) => {
            const ok = fulfilledRequired.has(req.id);
            return (
              <li
                key={req.id}
                className={`text-xs rounded-lg border p-2 ${
                  ok ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"
                }`}
              >
                <span className="font-medium text-slate-900">{req.label}</span>
                {ok ? (
                  <CheckCircle2 className="inline w-3.5 h-3.5 text-emerald-600 ml-1 align-text-bottom" />
                ) : (
                  <AlertTriangle className="inline w-3.5 h-3.5 text-amber-600 ml-1 align-text-bottom" />
                )}
                <p className="text-slate-600 mt-0.5 leading-snug">{req.description}</p>
              </li>
            );
          })}
        </ul>
        {missingRequired.length > 0 && (
          <p className="text-xs text-amber-900 flex gap-2 items-start">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>À compléter :</strong>{" "}
              {missingRequired.map((m) => m.label.split("(")[0].trim()).join(" · ")}. Le statut « livré » reste
              indisponible tant que les neuf types ne sont pas présents sur le dossier (fichier joint par type).
            </span>
          </p>
        )}
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter le document</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <Label>Motif (visible sur le dossier)</Label>
            <Textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Ex. document illisible, signature manquante…"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRejectOpen(false)}>
                Annuler
              </Button>
              <Button
                variant="destructive"
                disabled={documentDecisionMutation.isPending || !rejectDocId}
                onClick={() =>
                  rejectDocId &&
                  documentDecisionMutation.mutate({
                    id: rejectDocId,
                    decision: 'rejected',
                    notes: rejectNote,
                  })
                }
              >
                Confirmer le rejet
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Documents list */}
      {documents.length === 0 ? (
        <div className="text-center py-8 text-slate-500 rounded-lg border border-dashed border-slate-200 bg-slate-50/80">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium text-slate-700">Aucun fichier joint pour l’instant</p>
          <p className="text-sm mt-2 max-w-md mx-auto">
            Utilisez « Ajouter » pour déposer chaque pièce obligatoire. Les types manquants sont listés ci-dessus.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc, index) => {
            const typeConfig = documentTypes[doc.type] || documentTypes.other;
            const isImage = doc.type === 'photo' || doc.name?.match(/\.(jpg|jpeg|png|gif)$/i);
            
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-wrap items-center gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
              >
                <div className={`p-2 rounded-lg ${typeConfig.color}`}>
                  {isImage ? <Image className="w-4 h-4" /> : <File className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900 truncate">{doc.name}</p>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${typeConfig.color}`}>
                      {typeConfig.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {doc.uploaded_by || '—'} • {format(new Date(doc.created_date), "dd/MM/yyyy HH:mm", { locale: fr })}
                  </p>
                  {doc.status === 'validated' && doc.validated_by && (
                    <p className="text-xs text-emerald-700 mt-1">
                      <CheckCircle2 className="inline w-3.5 h-3.5 mr-1" />
                      Validé par <strong>{doc.validated_by}</strong>
                      {doc.validated_at &&
                        ` le ${format(new Date(doc.validated_at), "dd/MM/yyyy à HH:mm", { locale: fr })}`}
                    </p>
                  )}
                  {doc.status === 'rejected' && doc.rejected_by && (
                    <p className="text-xs text-red-700 mt-1">
                      <XCircle className="inline w-3.5 h-3.5 mr-1" />
                      Rejeté par <strong>{doc.rejected_by}</strong>
                      {doc.rejected_at &&
                        ` le ${format(new Date(doc.rejected_at), "dd/MM/yyyy à HH:mm", { locale: fr })}`}
                    </p>
                  )}
                  {doc.notes && doc.status === 'rejected' && (
                    <p className="text-xs text-red-600 mt-0.5">Motif : {doc.notes}</p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 shrink-0">
                  <StatusBadge status={doc.status} size="sm" />
                  {validator && doc.status === 'pending' && documents.length > 0 && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        className="h-8 bg-emerald-600 hover:bg-emerald-700"
                        disabled={documentDecisionMutation.isPending}
                        onClick={() =>
                          documentDecisionMutation.mutate({ id: doc.id, decision: 'validated' })
                        }
                      >
                        Valider
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 border-red-300 text-red-700 hover:bg-red-50"
                        disabled={documentDecisionMutation.isPending}
                        onClick={() => {
                          setRejectDocId(doc.id);
                          setRejectNote('');
                          setRejectOpen(true);
                        }}
                      >
                        Rejeter
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Voir / ouvrir le fichier"
                    onClick={() => openDocumentFile(doc, "preview")}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Télécharger"
                    onClick={() => openDocumentFile(doc, "download")}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}