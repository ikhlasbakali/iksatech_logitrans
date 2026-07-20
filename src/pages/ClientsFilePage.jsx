import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BookUser,
  ChevronRight,
  Download,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { appApi } from "@/api/appApi";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  buildClientTemplateCsv,
  buildClientTemplateJson,
  parseClientImportFile,
  partitionNewClients,
  CLIENT_FILE_COLUMNS,
} from "@/services/clients/clientImportService";

function downloadText(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function ClientsFilePage() {
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState({ rows: [], errors: [], format: "" });
  const [partition, setPartition] = useState(null);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clientsMaster"],
    queryFn: () => appApi.entities.Client.list("-created_date", 500),
  });

  const importMutation = useMutation({
    mutationFn: async (rows) => {
      const created = [];
      for (const row of rows) {
        const rec = await appApi.entities.Client.create({
          company_name: row.company_name,
          external_code: row.external_code || undefined,
          legal_id: row.legal_id || undefined,
          sector: row.sector || undefined,
          contact_name: row.contact_name || undefined,
          contact_email: row.contact_email || undefined,
          contact_phone: row.contact_phone || undefined,
          address_line1: row.address_line1 || undefined,
          city: row.city || undefined,
          postal_code: row.postal_code || undefined,
          country: row.country || undefined,
          payment_terms: row.payment_terms || undefined,
          notes: row.notes || undefined,
        });
        created.push(rec);
      }
      return created;
    },
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["clientsMaster"] });
      toast.success(`${created.length} client(s) enregistré(s) dans le fichier maître.`);
      setPreview({ rows: [], errors: [], format: "" });
      setPartition(null);
    },
    onError: () => toast.error("Import impossible — vérifiez les données."),
  });

  const handlePickFile = async (e) => {
    const f = e.target.files?.[0];
    setPartition(null);
    if (!f) {
      setPreview({ rows: [], errors: [], format: "" });
      return;
    }
    try {
      const parsed = await parseClientImportFile(f);
      setPreview(parsed);
      if (parsed.errors.length && !parsed.rows.length) {
        toast.error("Aucune ligne valide — voir les erreurs ci-dessous.");
      } else if (parsed.errors.length) {
        toast.message("Certaines lignes sont ignorées", { description: parsed.errors.slice(0, 3).join(" ") });
      }
      const part = partitionNewClients(parsed.rows, clients);
      setPartition(part);
    } catch (err) {
      toast.error(err?.message || "Lecture du fichier impossible.");
      setPreview({ rows: [], errors: [String(err)], format: "" });
    }
  };

  const summary = useMemo(() => {
    if (!partition) return null;
    return {
      newCount: partition.toCreate.length,
      skipCount: partition.skipped.length,
    };
  }, [partition]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link to={createPageUrl("CrmDashboard")} className="hover:text-blue-700">
              CRM & facturation
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <span className="text-slate-700 font-medium">Fichier clients</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
              <BookUser className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Fichier clients (import)
              </h1>
              <p className="text-slate-600 mt-0.5 max-w-2xl text-sm md:text-base">
                Téléchargez le <strong>modèle</strong> (CSV ou JSON), remplissez une ligne ou un objet par client,
                puis importez le fichier pour créer les fiches en une fois. Tout est stocké localement dans
                l&apos;application.
              </p>
            </div>
          </motion.div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to={createPageUrl("CrmDashboard")}>Tableau CRM</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
            Modèles vides (structure complète)
          </CardTitle>
          <CardDescription>
            Colonnes attendues : {CLIENT_FILE_COLUMNS.join(", ")} — seule{" "}
            <span className="font-medium">company_name</span> (raison sociale) est obligatoire.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              downloadText("modele-clients.csv", buildClientTemplateCsv(), "text/csv;charset=utf-8");
              toast.success("Modèle CSV téléchargé.");
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Modèle CSV (séparateur ;)
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              downloadText("modele-clients.json", buildClientTemplateJson(), "application/json;charset=utf-8");
              toast.success("Modèle JSON téléchargé.");
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Modèle JSON (tableau)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="h-5 w-5 text-emerald-600" />
            Importer un fichier
          </CardTitle>
          <CardDescription>Fichiers .csv ou .json — prévisualisation avant enregistrement.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" accept=".csv,.json,text/csv,application/json" onChange={handlePickFile} />
          {preview.errors.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <p className="font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Messages ({preview.errors.length})
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-0.5">
                {preview.errors.slice(0, 12).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
          {partition && summary && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <strong>{summary.newCount}</strong> nouveau(x) à créer
              </span>
              {summary.skipCount > 0 && (
                <span className="text-amber-800">
                  {summary.skipCount} doublon(s) ignoré(s) (raison sociale déjà présente).
                </span>
              )}
              <Button
                type="button"
                className="ml-auto bg-indigo-600 hover:bg-indigo-700"
                disabled={!partition.toCreate.length || importMutation.isPending}
                onClick={() => importMutation.mutate(partition.toCreate)}
              >
                {importMutation.isPending ? "Enregistrement…" : `Créer ${partition.toCreate.length} client(s)`}
              </Button>
            </div>
          )}
          {preview.rows.length > 0 && (
            <div className="rounded-md border border-slate-200 overflow-x-auto max-h-72 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Raison sociale</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>E-mail</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.rows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{r.company_name}</TableCell>
                      <TableCell className="text-xs">{r.external_code || "—"}</TableCell>
                      <TableCell className="text-sm">{r.city || "—"}</TableCell>
                      <TableCell className="text-sm">{r.contact_name || "—"}</TableCell>
                      <TableCell className="text-xs">{r.contact_email || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Clients enregistrés ({clients.length})</CardTitle>
          <CardDescription>Fichier maître — utilisé comme référentiel pour vos dossiers et devis.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-slate-500">Chargement…</p>
          ) : clients.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun client — importez un fichier ou utilisez les modèles ci-dessus.</p>
          ) : (
            <div className="rounded-md border border-slate-200 overflow-x-auto max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Raison sociale</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Pays</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>E-mail</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.company_name}</TableCell>
                      <TableCell className="text-xs font-mono">{c.external_code || "—"}</TableCell>
                      <TableCell className="text-sm">{c.city || "—"}</TableCell>
                      <TableCell className="text-sm">{c.country || "—"}</TableCell>
                      <TableCell className="text-sm">{c.contact_name || "—"}</TableCell>
                      <TableCell className="text-xs">{c.contact_email || "—"}</TableCell>
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
