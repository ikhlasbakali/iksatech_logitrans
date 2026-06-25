import React, { useMemo, useState } from 'react';
import { appApi } from '@/api/appApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from "react-router-dom";
import { 
  FileText, 
  Search, 
  Upload,
  Download,
  Eye,
  Folder,
  Image,
  File,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatusBadge from "@/components/ui/StatusBadge";
import { useAuth } from "@/auth/AuthContext";
import { canValidateDocuments, validatorRolesLabelFr } from "@/utils/documentWorkflow";
import { openDocumentFile } from "@/utils/documentFileActions";
import { createPageUrl } from "@/utils";
import { cn } from "@/lib/utils";
import { dispatchWorkflowEvent } from "@/services/workflow/workflowTriggers";
import { recordDocumentAudit } from "@/services/documents/documentHistoryService";
import { mockExtractMetadata } from "@/services/documents/documentIntelligenceService";
import { DOCUMENT_TYPES_META } from "@/config/documentTypesMeta";
import { REQUIRED_OPERATION_DOC_FLOW_SUMMARY } from "@/config/requiredOperationDocuments";

/** Numéro de dossier = référence opération (ex. OP-2024-0892) */
function getDossierNumber(doc) {
  const ref = doc.dossier_reference || doc.operation_ref;
  return ref && String(ref).trim() ? String(ref).trim() : "";
}

const documentTypes = Object.fromEntries(
  Object.entries(DOCUMENT_TYPES_META).map(([key, meta]) => [
    key,
    { ...meta, icon: key === "photo" ? Image : FileText },
  ])
);

export default function Documents() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dossierFilter, setDossierFilter] = useState('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadOpId, setUploadOpId] = useState('');
  const [uploadType, setUploadType] = useState('nota');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadFileInputKey, setUploadFileInputKey] = useState(0);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectDocId, setRejectDocId] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [dossierQuickInput, setDossierQuickInput] = useState('');

  const validator = canValidateDocuments(user);

  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: () => appApi.entities.Document.list('-created_date'),
  });

  const { data: operations = [] } = useQuery({
    queryKey: ['operations'],
    queryFn: () => appApi.entities.Operation.list('-created_date', 200),
  });

  const dossierOptions = useMemo(() => {
    const set = new Set();
    documents.forEach((d) => {
      const n = getDossierNumber(d);
      if (n) set.add(n);
    });
    operations.forEach((op) => {
      if (op.reference) set.add(op.reference);
    });
    return Array.from(set).sort();
  }, [documents, operations]);

  /** Cartes dossier : opérations + références issues des documents */
  const dossierCards = useMemo(() => {
    const opByRef = new Map();
    operations.forEach((o) => {
      const r = o.reference && String(o.reference).trim();
      if (r) opByRef.set(r, o);
    });
    const counts = {};
    documents.forEach((d) => {
      const r = getDossierNumber(d);
      if (r) counts[r] = (counts[r] || 0) + 1;
    });
    const refs = new Set([...opByRef.keys(), ...Object.keys(counts)]);
    return Array.from(refs)
      .sort()
      .map((ref) => {
        const op = opByRef.get(ref);
        return {
          reference: ref,
          client_name: op?.client_name ?? null,
          operationId: op?.id ?? null,
          docCount: counts[ref] ?? 0,
        };
      });
  }, [operations, documents]);

  const handleOpenDossierByRef = () => {
    const raw = dossierQuickInput.trim();
    if (!raw) {
      toast.error("Saisissez un numéro de dossier.");
      return;
    }
    const match = dossierCards.find((c) => c.reference.toLowerCase() === raw.toLowerCase());
    if (!match) {
      toast.error("Référence introuvable. Vérifiez le numéro ou choisissez une carte ci-dessous.");
      return;
    }
    setDossierFilter(match.reference);
    setDossierQuickInput(match.reference);
  };

  const clearDossierSelection = () => {
    setDossierFilter("all");
    setDossierQuickInput("");
  };

  const filteredDocuments = documents.filter(doc => {
    const dossier = getDossierNumber(doc);
    const matchesSearch = !searchTerm || 
      doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesDossier =
      dossierFilter === 'all' ||
      (dossierFilter === '__orphan' ? !dossier : dossier === dossierFilter);
    
    return matchesSearch && matchesType && matchesStatus && matchesDossier;
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ operation_id, dossier_reference, type, file }) => {
      const { file_url } = await appApi.uploadFile({ file });
      return appApi.entities.Document.create({
        operation_id,
        dossier_reference,
        type,
        name: file.name,
        file_url,
        status: 'pending',
        uploaded_by: user?.full_name || user?.email || 'Exploitation',
      });
    },
    onSuccess: async (created, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      if (created?.operation_id) {
        queryClient.invalidateQueries({ queryKey: ['operationEvents', created.operation_id] });
        queryClient.invalidateQueries({ queryKey: ['operationDocuments', created.operation_id] });
      }
      const actor = user?.full_name || user?.email || 'Exploitation';
      await recordDocumentAudit({
        documentId: created.id,
        dossier_reference: created.dossier_reference,
        action: 'uploaded',
        actor,
      });
      const meta = mockExtractMetadata(variables?.file?.name || created.name);
      toast.message('Analyse automatique (simulation OCR)', {
        description: `${meta.detected_type.toUpperCase()} — ${meta.hints[0]}`,
      });
      toast.success('Document enregistré et rattaché au dossier');
      setUploadOpen(false);
      setUploadOpId('');
      setUploadType('nota');
      setUploadFile(null);
      setUploadFileInputKey((k) => k + 1);
    },
    onError: (e) => toast.error(e?.message || 'Import impossible — vérifiez le fichier et réessayez.'),
  });

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
      queryClient.invalidateQueries({ queryKey: ['operationDocuments'] });
      if (updated?.operation_id) {
        queryClient.invalidateQueries({ queryKey: ['operationEvents', updated.operation_id] });
      }
      const actor = user?.full_name || user?.email || 'Utilisateur';
      await recordDocumentAudit({
        documentId: vars.id,
        dossier_reference: updated?.dossier_reference,
        action: vars.decision === 'validated' ? 'validated' : 'rejected',
        actor,
        notes: vars.decision === 'rejected' ? vars.notes : undefined,
      });
      if (vars.decision === 'validated') {
        dispatchWorkflowEvent('document.validated', {
          document_name: updated?.name ?? '',
          dossier_reference: updated?.dossier_reference ?? '',
        });
      }
      toast.success(vars.decision === 'validated' ? 'Document validé' : 'Document rejeté');
      setRejectOpen(false);
      setRejectDocId(null);
      setRejectNote('');
    },
    onError: () => toast.error('Action impossible'),
  });

  const handleGlobalUpload = () => {
    if (!uploadOpId) {
      toast.error('Sélectionnez un dossier (opération) obligatoirement.');
      return;
    }
    const op = operations.find((o) => o.id === uploadOpId);
    if (!op) {
      toast.error('Opération introuvable.');
      return;
    }
    const dossierRef = String(op.reference || '').trim() || op.id;
    if (!uploadFile) {
      toast.error('Choisissez un fichier.');
      return;
    }
    uploadMutation.mutate({
      operation_id: uploadOpId,
      dossier_reference: dossierRef,
      type: uploadType,
      file: uploadFile,
    });
  };

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending').length,
    validated: documents.filter(d => d.status === 'validated').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
  };

  // Group by dossier number
  const groupedByOperation = filteredDocuments.reduce((acc, doc) => {
    const ref = getDossierNumber(doc) || '__NON_RATTACHE__';
    if (!acc[ref]) acc[ref] = [];
    acc[ref].push(doc);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl lg:text-3xl font-bold text-slate-900"
          >
            Documents
          </motion.h1>
          <p className="text-slate-500 mt-1">
            Ouvrez un <strong className="text-slate-700">dossier</strong> pour voir tous les fichiers associés, ou
            parcourez la liste complète. Chaque pièce est liée au numéro de dossier (référence opération). Aucune
            synchronisation externe : tout est stocké dans l&apos;application.
          </p>
        </div>
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 shrink-0">
              <Upload className="w-4 h-4 mr-2" />
              Importer (choisir le dossier)
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nouveau document — rattachement dossier</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Numéro de dossier (opération) *</Label>
                <Select value={uploadOpId || undefined} onValueChange={setUploadOpId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner le dossier…" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {operations.map((op) => (
                      <SelectItem key={op.id} value={op.id}>
                        {`${op.reference} — ${op.client_name || ''}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {operations.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">Aucune opération : créez d’abord un dossier.</p>
                )}
              </div>
              <div>
                <Label>Type de document</Label>
                <Select value={uploadType} onValueChange={setUploadType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(documentTypes).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Fichier *</Label>
                <Input
                  key={uploadFileInputKey}
                  type="file"
                  className="mt-1"
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.txt,application/pdf,image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={uploadMutation.isPending}
                onClick={handleGlobalUpload}
              >
                {uploadMutation.isPending ? 'Enregistrement…' : 'Enregistrer sous ce dossier'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50/90 px-4 py-3 text-sm text-slate-800">
        <p className="font-semibold text-slate-900">Neuf documents obligatoires par trajet</p>
        <p className="mt-1 text-xs text-slate-700 leading-relaxed">{REQUIRED_OPERATION_DOC_FLOW_SUMMARY}</p>
        <p className="mt-2 text-xs text-slate-600">
          Complétez le dossier depuis le détail opération ; le statut « livré » est bloqué tant que les neuf types ne
          sont pas joints.
        </p>
      </div>

      <Card className="border-blue-200 bg-blue-50/40">
        <CardContent className="py-4 text-sm text-slate-700">
          <p className="font-medium text-slate-900">Contrôle après dépôt</p>
          <p className="mt-1">
            Tout fichier importé est d’abord <strong>en attente</strong>. La validation est effectuée par un membre
            habilité de l’exploitation : <span className="text-slate-800">{validatorRolesLabelFr()}</span>.
            {!validator && user && (
              <span className="block mt-2 text-amber-800">
                Avec votre rôle actuel, vous pouvez consulter les documents ; la validation / le rejet est réservé aux
                profils exploitation listés ci-dessus.
              </span>
            )}
            {validator && (
              <span className="block mt-2 text-emerald-800">
                Vous pouvez <strong>valider</strong> ou <strong>rejeter</strong> les pièces « en attente » (boutons sur
                chaque ligne).
              </span>
            )}
          </p>
        </CardContent>
      </Card>

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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-xl">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              <p className="text-sm text-slate-500">En attente</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.validated}</p>
              <p className="text-sm text-slate-500">Validés</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              <p className="text-sm text-slate-500">Rejetés</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 font-semibold">
            <Folder className="w-5 h-5 text-blue-600 shrink-0" />
            Dossiers — choisir pour voir les fichiers
          </CardTitle>
          <p className="text-sm text-slate-500 font-normal">
            Cliquez sur un dossier ou saisissez sa référence, puis consultez les pièces (aperçu / téléchargement).
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 flex-wrap items-stretch sm:items-center">
            <Input
              placeholder="Ex. OP-2024-0892"
              value={dossierQuickInput}
              onChange={(e) => setDossierQuickInput(e.target.value)}
              className="font-mono sm:max-w-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleOpenDossierByRef();
              }}
            />
            <Button type="button" variant="secondary" onClick={handleOpenDossierByRef}>
              Afficher les fichiers du dossier
            </Button>
            {(dossierFilter !== "all" || dossierQuickInput) && (
              <Button type="button" variant="outline" onClick={clearDossierSelection}>
                Tous les dossiers
              </Button>
            )}
          </div>
          {dossierFilter !== "all" && dossierFilter !== "__orphan" && (
            <p className="text-sm text-blue-900 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
              Filtre actif : <span className="font-mono font-semibold">{dossierFilter}</span> — seuls les documents de
              ce dossier sont listés ci-dessous.
            </p>
          )}
          <div className="max-h-80 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {dossierCards.map((row) => {
                const selected = dossierFilter === row.reference;
                return (
                  <div
                    key={row.reference}
                    className={cn(
                      "rounded-xl border text-left transition-colors flex flex-col",
                      selected
                        ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50/60"
                        : "border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setDossierFilter(row.reference);
                        setDossierQuickInput(row.reference);
                      }}
                      className="p-4 flex-1 text-left rounded-t-xl"
                    >
                      <p className="font-mono font-bold text-slate-900">{row.reference}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {row.client_name ? `Client : ${row.client_name}` : "Client non renseigné"}
                      </p>
                      <p className="text-sm text-slate-600 mt-2">
                        <span className="font-semibold text-slate-800">{row.docCount}</span> fichier
                        {row.docCount !== 1 ? "s" : ""}
                      </p>
                    </button>
                    {row.operationId && (
                      <div className="px-4 pb-3 pt-0 border-t border-slate-100/80">
                        <Link
                          to={`${createPageUrl("OperationDetail")}?id=${encodeURIComponent(row.operationId)}`}
                          className="text-xs text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Voir l&apos;opération
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Rechercher par nom ou référence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {Object.entries(documentTypes).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="validated">Validé</SelectItem>
            <SelectItem value="rejected">Rejeté</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={dossierFilter}
          onValueChange={(v) => {
            setDossierFilter(v);
            if (v === "all" || v === "__orphan") setDossierQuickInput("");
            else setDossierQuickInput(v);
          }}
        >
          <SelectTrigger className="w-[min(100vw-2rem,14rem)]">
            <SelectValue placeholder="N° dossier" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            <SelectItem value="all">Tous les dossiers</SelectItem>
            <SelectItem value="__orphan">Sans numéro de dossier</SelectItem>
            {dossierOptions.map((ref) => (
              <SelectItem key={ref} value={ref}>
                <span className="font-mono">{ref}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Documents grouped by dossier number */}
      <div className="space-y-6">
        {Object.keys(groupedByOperation).length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center text-slate-500">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium text-slate-700">Aucun document pour ces critères</p>
              <p className="text-sm mt-1">
                Modifiez les filtres ou choisissez un autre dossier. Les fichiers importés apparaissent ici une fois
                rattachés.
              </p>
            </CardContent>
          </Card>
        )}
        {Object.entries(groupedByOperation).map(([operationRef, docs]) => (
          <Card key={operationRef} className={operationRef === '__NON_RATTACHE__' ? 'border-amber-300' : ''}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base flex-wrap">
                <Folder className="w-5 h-5 text-blue-600" />
                {operationRef === '__NON_RATTACHE__' ? (
                  <span className="text-amber-800 font-sans text-sm font-semibold">
                    Sans numéro de dossier — à rattacher
                  </span>
                ) : (
                  <>
                    <span className="text-slate-500 text-sm font-normal">Dossier</span>
                    <span className="font-mono font-bold text-slate-900">{operationRef}</span>
                  </>
                )}
                <span className="text-sm font-normal text-slate-500">
                  ({docs.length} document{docs.length > 1 ? 's' : ''})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {docs.map((doc, index) => {
                  const typeConfig = documentTypes[doc.type] || documentTypes.other;
                  const Icon = typeConfig.icon;
                  
                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex flex-wrap items-center gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                    >
                      <div className={`p-2 rounded-lg ${typeConfig.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-slate-900 truncate">{doc.name}</p>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${typeConfig.color}`}>
                            {typeConfig.label}
                          </span>
                          {getDossierNumber(doc) && (
                            <span className="px-2 py-0.5 text-xs rounded-md bg-slate-200/80 font-mono text-slate-800">
                              {getDossierNumber(doc)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                          <span>Dépôt : {doc.uploaded_by || '—'}</span>
                          <span>•</span>
                          <span>{format(new Date(doc.created_date), "dd/MM/yyyy HH:mm", { locale: fr })}</span>
                        </div>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}