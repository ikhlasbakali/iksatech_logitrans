import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { appApi } from "@/api/appApi";
import { createPageUrl } from "@/utils";
import FleetSubNav from "@/components/fleet/FleetSubNav";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from "@/components/ui/StatusBadge";
import { Globe2, MapPin } from "lucide-react";

const interTypes = new Set(["import", "export", "international", "international_import", "international_export"]);

function isInternationalOp(op) {
  const t = String(op.type_operation ?? "").toLowerCase();
  if (interTypes.has(t)) return true;
  if (op.incoterm && String(op.incoterm).trim()) return true;
  return /import|export|international/i.test(t);
}

export default function FleetInternationalTrackingPage() {
  const { data: operations = [], isLoading: opLoading } = useQuery({
    queryKey: ["operations", "international"],
    queryFn: () => appApi.entities.Operation.list("-created_date", 200),
  });

  const { data: checkpoints = [], isLoading: cpLoading } = useQuery({
    queryKey: ["customsCheckpoints"],
    queryFn: () => appApi.entities.CustomsCheckpoint.list("sequence_order", 80),
  });

  const interOps = useMemo(() => operations.filter(isInternationalOp), [operations]);

  const cpsByOp = useMemo(() => {
    const m = new Map();
    checkpoints.forEach((c) => {
      const id = c.operation_id;
      if (!id) return;
      if (!m.has(id)) m.set(id, []);
      m.get(id).push(c);
    });
    return m;
  }, [checkpoints]);

  const loading = opLoading || cpLoading;

  return (
    <div className="space-y-6">
      <FleetSubNav />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Suivi international</h1>
        <p className="mt-1 text-slate-600">
          Dossiers import / export ou avec Incoterms®, et points de passage douane enregistrés.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <Globe2 className="h-5 w-5 text-sky-600" />
          <h2 className="font-semibold text-slate-900">Dossiers ({interOps.length})</h2>
        </div>
        {loading ? (
          <div className="p-12 text-center text-slate-500">Chargement…</div>
        ) : interOps.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Aucun dossier international détecté dans les données actuelles.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80">
                  <TableHead>Référence</TableHead>
                  <TableHead>Type / Incoterm</TableHead>
                  <TableHead>Trajet</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Points douane</TableHead>
                  <TableHead className="text-right">Dossier</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interOps.map((o) => {
                  const cps = cpsByOp.get(o.id) ?? [];
                  return (
                    <TableRow key={o.id}>
                      <TableCell className="font-mono font-medium">{o.reference}</TableCell>
                      <TableCell className="text-sm">
                        {o.type_operation ?? "—"}
                        {o.incoterm ? (
                          <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-xs">{o.incoterm}</span>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {o.pickup_city} → {o.delivery_city}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={o.status} size="sm" />
                      </TableCell>
                      <TableCell className="max-w-[240px] text-xs text-slate-600">
                        {cps.length === 0 ? (
                          "—"
                        ) : (
                          <ul className="space-y-1">
                            {cps.map((c) => (
                              <li key={c.id} className="flex items-start gap-1">
                                <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" />
                                <span>
                                  {c.label}{" "}
                                  <span className="text-slate-400">
                                    ({c.status}
                                    {c.scheduled_window_start
                                      ? ` · ${format(new Date(c.scheduled_window_start), "dd/MM HH:mm", { locale: fr })}`
                                      : ""}
                                    )
                                  </span>
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            window.location.href =
                              createPageUrl("OperationDetail") + "?id=" + encodeURIComponent(o.id);
                          }}
                        >
                          Ouvrir
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
