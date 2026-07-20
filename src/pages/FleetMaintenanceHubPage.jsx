import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, differenceInDays } from "date-fns";
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
import { Wrench, AlertTriangle } from "lucide-react";

export default function FleetMaintenanceHubPage() {
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["vehicles", "fleetMaintenance"],
    queryFn: () => appApi.entities.Vehicle.list(),
  });

  const { data: history = [] } = useQuery({
    queryKey: ["maintenanceHistory", "fleet"],
    queryFn: () => appApi.entities.MaintenanceHistory.list("-date", 40),
  });

  const urgent = useMemo(() => {
    const now = new Date();
    return vehicles
      .map((v) => {
        const next = v.next_maintenance ? new Date(v.next_maintenance) : null;
        const days = next && !Number.isNaN(next.getTime()) ? differenceInDays(next, now) : null;
        return { v, days, overdue: days != null && days < 0 };
      })
      .filter((x) => x.v.status === "maintenance" || x.overdue || (x.days != null && x.days <= 14))
      .sort((a, b) => (a.days ?? 999) - (b.days ?? 999));
  }, [vehicles]);

  return (
    <div className="space-y-6">
      <FleetSubNav />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Maintenance flotte</h1>
        <p className="mt-1 text-slate-600">
          Véhicules en atelier, échéances proches et derniers enregistrements d&apos;entretien.
        </p>
      </div>

      <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-600" />
          <p className="text-sm text-orange-900">
            <strong>{urgent.length}</strong> véhicule(s) à surveiller (maintenance en cours ou échéance sous 14 jours).
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="flex items-center gap-2 font-semibold text-slate-900">
            <Wrench className="h-5 w-5 text-slate-600" />
            Échéances & statut
          </h2>
        </div>
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Chargement…</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80">
                  <TableHead>Plaque</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Prochaine maintenance</TableHead>
                  <TableHead>CT / assurance</TableHead>
                  <TableHead className="text-right">Fiche</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((v) => {
                  const next = v.next_maintenance ? new Date(v.next_maintenance) : null;
                  const d = next && !Number.isNaN(next.getTime()) ? differenceInDays(next, new Date()) : null;
                  return (
                    <TableRow key={v.id}>
                      <TableCell className="font-mono font-medium">{v.plate_number}</TableCell>
                      <TableCell>
                        <StatusBadge status={v.status} size="sm" />
                      </TableCell>
                      <TableCell className="text-sm">
                        {next && !Number.isNaN(next.getTime()) ? (
                          <span className={d != null && d < 0 ? "font-semibold text-red-600" : ""}>
                            {format(next, "dd/MM/yyyy", { locale: fr })}
                            {d != null ? ` (${d < 0 ? `${-d} j. retard` : `J-${d}`})` : ""}
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        CT{" "}
                        {v.technical_inspection_date
                          ? format(new Date(v.technical_inspection_date), "dd/MM/yy", { locale: fr })
                          : "—"}{" "}
                        · Ass.{" "}
                        {v.insurance_expiry
                          ? format(new Date(v.insurance_expiry), "dd/MM/yy", { locale: fr })
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            window.location.href =
                              createPageUrl("VehicleDetail") + "?id=" + encodeURIComponent(v.id);
                          }}
                        >
                          Détails
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

      {history.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-semibold text-slate-900">Derniers passages atelier (extrait)</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            {history.slice(0, 8).map((h) => (
              <li key={h.id} className="flex justify-between gap-2 border-b border-slate-50 pb-2 last:border-0">
                <span>{h.description ?? h.type ?? "Entretien"}</span>
                <span className="shrink-0 text-slate-500">
                  {h.date ? format(new Date(h.date), "dd/MM/yyyy", { locale: fr }) : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
