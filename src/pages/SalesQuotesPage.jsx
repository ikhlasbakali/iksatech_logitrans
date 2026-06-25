import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FileSpreadsheet,
  Plus,
  ChevronRight,
  Copy,
  Download,
  Printer,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { appApi } from "@/api/appApi";
import { useAuth } from "@/auth/AuthContext";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  downloadQuoteHtml,
  downloadQuoteCsv,
  printQuoteDocument,
} from "@/services/quotes/quoteExport";

const STATUS_LABELS = {
  draft: "Brouillon",
  sent: "Envoyé",
  accepted: "Accepté",
  rejected: "Refusé",
  expired: "Expiré",
  invoiced: "Facturé",
};

function formatMoney(n, currency = "EUR") {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(n ?? 0);
}

function nextReference() {
  const y = new Date().getFullYear();
  const suffix =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 6).toUpperCase()
      : `${Date.now().toString(36)}`.slice(-8).toUpperCase();
  return `DEV-${y}-${suffix}`;
}

function parseDateInputToIso(value) {
  if (!value) return null;
  const d = new Date(`${value}T23:59:59`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function ttcFrom(ht, vat) {
  const h = Number(ht) || 0;
  const v = Number(vat) || 0;
  return Math.round(h * (1 + v / 100) * 100) / 100;
}

/** Conserve la date de validité si elle est future ; sinon +30 jours (copie exploitable). */
function duplicateValidUntilIso(originalIso) {
  if (!originalIso) {
    return new Date(Date.now() + 30 * 86400000).toISOString();
  }
  const d = new Date(originalIso);
  if (Number.isNaN(d.getTime())) {
    return new Date(Date.now() + 30 * 86400000).toISOString();
  }
  if (d.getTime() > Date.now()) {
    return d.toISOString();
  }
  return new Date(Date.now() + 30 * 86400000).toISOString();
}

export default function SalesQuotesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(true);
  const [form, setForm] = useState({
    client_company: "",
    commercial_owner: "",
    contact_name: "",
    contact_email: "",
    title: "",
    amount_ht: "",
    vat_rate: "20",
    valid_until: "",
    notes: "",
  });

  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ["salesQuotes"],
    queryFn: () => appApi.entities.SalesQuote.list("-created_date", 200),
  });

  useEffect(() => {
    const def = (user?.full_name || user?.email || "").trim();
    if (!def) return;
    setForm((f) => (f.commercial_owner ? f : { ...f, commercial_owner: def }));
  }, [user?.full_name, user?.email]);

  const totals = useMemo(() => {
    const accepted = quotes.filter((q) => q.status === "accepted" || q.status === "invoiced");
    const pipeline = quotes.filter((q) => ["draft", "sent"].includes(q.status));
    const sum = (arr) => arr.reduce((s, q) => s + (Number(q.amount_ttc) || 0), 0);
    return {
      pipelineTtc: sum(pipeline),
      wonTtc: sum(accepted),
    };
  }, [quotes]);

  const createMutation = useMutation({
    mutationFn: async () => {
      const ht = Number(form.amount_ht);
      const vat = Number(form.vat_rate);
      if (!form.client_company.trim() || !form.title.trim()) {
        throw new Error("Client et intitulé du devis sont obligatoires.");
      }
      if (!Number.isFinite(ht) || ht <= 0) {
        throw new Error("Montant HT invalide.");
      }
      const validUntil = parseDateInputToIso(form.valid_until);
      if (!validUntil) {
        throw new Error("Date de validité obligatoire.");
      }
      const amount_ttc = ttcFrom(ht, vat);
      const owner = (form.commercial_owner || user?.full_name || user?.email || "").trim();
      if (!owner) {
        throw new Error("Indiquez le commercial ou responsable du devis.");
      }
      return appApi.entities.SalesQuote.create({
        reference: nextReference(),
        client_company: form.client_company.trim(),
        commercial_owner: owner || "Non assigné",
        contact_name: form.contact_name.trim() || undefined,
        contact_email: form.contact_email.trim() || undefined,
        title: form.title.trim(),
        amount_ht: ht,
        vat_rate: vat,
        amount_ttc,
        currency: "EUR",
        valid_until: validUntil,
        status: "draft",
        notes: form.notes.trim() || "",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salesQuotes"] });
      toast.success("Devis créé.");
      setForm({
        client_company: "",
        commercial_owner: user?.full_name || user?.email || "",
        contact_name: "",
        contact_email: "",
        title: "",
        amount_ht: "",
        vat_rate: "20",
        valid_until: "",
        notes: "",
      });
    },
    onError: (e) => toast.error(e?.message || "Impossible de créer le devis."),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => appApi.entities.SalesQuote.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salesQuotes"] });
      toast.success("Statut mis à jour.");
    },
    onError: () => toast.error("Mise à jour impossible."),
  });

  const duplicateMutation = useMutation({
    mutationFn: async (q) => {
      const ht = Number(q.amount_ht) || 0;
      const vat = Number(q.vat_rate) || 0;
      const owner = (q.commercial_owner || user?.full_name || user?.email || "").trim();
      if (!owner) {
        throw new Error("Commercial manquant sur le devis source.");
      }
      const baseTitle = String(q.title || "").trim() || "Devis";
      return appApi.entities.SalesQuote.create({
        reference: nextReference(),
        client_company: String(q.client_company || "").trim(),
        commercial_owner: owner,
        contact_name: q.contact_name ? String(q.contact_name).trim() : undefined,
        contact_email: q.contact_email ? String(q.contact_email).trim() : undefined,
        title: `${baseTitle} (copie)`.slice(0, 500),
        amount_ht: ht,
        vat_rate: vat,
        amount_ttc: ttcFrom(ht, vat),
        currency: q.currency || "EUR",
        valid_until: duplicateValidUntilIso(q.valid_until),
        status: "draft",
        notes: q.notes ? String(q.notes) : "",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salesQuotes"] });
      toast.success("Devis dupliqué en brouillon (nouvelle référence).");
    },
    onError: (e) => toast.error(e?.message || "Duplication impossible."),
  });

  const exporterName = (user?.full_name || user?.email || "").trim() || "Utilisateur";

  const previewTtc = ttcFrom(form.amount_ht, form.vat_rate);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to={createPageUrl("CrmDashboard")} className="hover:text-blue-700">
              CRM & facturation
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <span className="text-slate-700 font-medium">Devis (ERP)</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Devis & propositions commerciales
              </h1>
              <p className="text-slate-600 mt-0.5 max-w-2xl text-sm md:text-base">
                Création, suivi, duplication et export (HTML / CSV / impression) — cycle commercial autonome dans
                l&apos;application.
              </p>
            </div>
          </motion.div>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Button variant="outline" asChild>
            <Link to={createPageUrl("CrmDashboard")}>Tableau CRM</Link>
          </Button>
          <Button variant="secondary" onClick={() => setShowForm((v) => !v)}>
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? "Masquer le formulaire" : "Nouveau devis"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pipeline (brouillon + envoyés)</CardTitle>
            <CardDescription>Montant TTC des devis en cours</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">{formatMoney(totals.pipelineTtc)}</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-200/80 bg-emerald-50/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-emerald-900">Gagné (accepté / facturé)</CardTitle>
            <CardDescription className="text-emerald-800/90">Chiffre devis transformé</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-900">{formatMoney(totals.wonTtc)}</p>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-slate-200 shadow-sm max-w-3xl">
            <CardHeader>
              <CardTitle>Nouveau devis</CardTitle>
              <CardDescription>
                Référence générée automatiquement. La TVA et le TTC sont calculés à l&apos;enregistrement.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="client_company">Client (raison sociale) *</Label>
                  <Input
                    id="client_company"
                    value={form.client_company}
                    onChange={(e) => setForm((f) => ({ ...f, client_company: e.target.value }))}
                    placeholder="Ex. Baltic Trade OÜ"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="commercial_owner">Commercial / responsable *</Label>
                  <Input
                    id="commercial_owner"
                    value={form.commercial_owner}
                    onChange={(e) => setForm((f) => ({ ...f, commercial_owner: e.target.value }))}
                    placeholder="Nom affiché dans le CRM"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_name">Contact</Label>
                  <Input
                    id="contact_name"
                    value={form.contact_name}
                    onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
                    placeholder="Nom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">E-mail</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={form.contact_email}
                    onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
                    placeholder="contact@client.fr"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Intitulé du devis *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Ex. Transport FTL — tournée hebdomadaire"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount_ht">Montant HT (€) *</Label>
                  <Input
                    id="amount_ht"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount_ht}
                    onChange={(e) => setForm((f) => ({ ...f, amount_ht: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vat_rate">TVA (%)</Label>
                  <Input
                    id="vat_rate"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.vat_rate}
                    onChange={(e) => setForm((f) => ({ ...f, vat_rate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="valid_until">Valable jusqu&apos;au *</Label>
                  <Input
                    id="valid_until"
                    type="date"
                    value={form.valid_until}
                    onChange={(e) => setForm((f) => ({ ...f, valid_until: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="notes">Notes internes</Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Conditions, incoterms, options…"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <p className="text-sm text-slate-600">
                  TTC estimé :{" "}
                  <span className="font-semibold text-slate-900">{formatMoney(previewTtc)}</span>
                </p>
                <Button
                  onClick={() => createMutation.mutate()}
                  disabled={createMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createMutation.isPending ? "Enregistrement…" : "Créer le devis"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Liste des devis</CardTitle>
          <CardDescription>
            Dupliquez un devis pour proposer une variante ou une reconduction. Exportez le détail (HTML à envoyer ou
            imprimer en PDF depuis le navigateur, ou CSV pour tableur).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-slate-500">Chargement…</p>
          ) : quotes.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun devis — créez-en un ci-dessus.</p>
          ) : (
            <div className="rounded-md border border-slate-200 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Réf.</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Commercial</TableHead>
                    <TableHead>Intitulé</TableHead>
                    <TableHead className="text-right">HT</TableHead>
                    <TableHead className="text-right">TTC</TableHead>
                    <TableHead>Validité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right w-[200px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-mono text-xs font-medium">{q.reference}</TableCell>
                      <TableCell className="font-medium">{q.client_company}</TableCell>
                      <TableCell className="text-sm text-slate-600 max-w-[140px] truncate" title={q.commercial_owner}>
                        {q.commercial_owner || "—"}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-slate-600" title={q.title}>
                        {q.title}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatMoney(q.amount_ht)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium">
                        {formatMoney(q.amount_ttc)}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 whitespace-nowrap">
                        {q.valid_until
                          ? new Date(q.valid_until).toLocaleDateString("fr-FR")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={q.status}
                          onValueChange={(status) => statusMutation.mutate({ id: q.id, status })}
                          disabled={statusMutation.isPending}
                        >
                          <SelectTrigger className="w-[160px] h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(STATUS_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            title="Dupliquer en brouillon"
                            disabled={duplicateMutation.isPending}
                            onClick={() => duplicateMutation.mutate(q)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button type="button" variant="secondary" size="sm" className="h-8 px-2 gap-1">
                                <Download className="h-3.5 w-3.5" />
                                <MoreHorizontal className="h-3.5 w-3.5 opacity-70" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem
                                onClick={() => {
                                  downloadQuoteHtml(q, { exporterName });
                                  toast.success("Fichier HTML téléchargé — prêt à joindre ou à ouvrir.");
                                }}
                              >
                                Télécharger HTML (e-mail / pièce jointe)
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => {
                                  const ok = printQuoteDocument(q, { exporterName });
                                  if (!ok) {
                                    toast.error(
                                      "Impossible d’ouvrir la fenêtre d’impression. Autorisez les pop-ups ou téléchargez le fichier HTML."
                                    );
                                  }
                                }}
                              >
                                <Printer className="h-3.5 w-3.5 shrink-0" />
                                Aperçu &amp; impression (PDF navigateur)
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  downloadQuoteCsv(q);
                                  toast.success("Export CSV téléchargé.");
                                }}
                              >
                                Télécharger CSV (tableur)
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
