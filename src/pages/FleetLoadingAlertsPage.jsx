import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, isAfter } from "date-fns";
import { fr } from "date-fns/locale";
import { appApi } from "@/api/appApi";
import { createPageUrl } from "@/utils";
import FleetSubNav from "@/components/fleet/FleetSubNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/ui/StatusBadge";
import { Loader, AlertTriangle, Clock } from "lucide-react";

export default function FleetLoadingAlertsPage() {
  const { data: operations = [], isLoading } = useQuery({
    queryKey: ["operations", "loadingAlerts"],
    queryFn: () => appApi.entities.Operation.list("-created_date", 200),
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ["vehicles", "loadingAlerts"],
    queryFn: () => appApi.entities.Vehicle.list(),
  });

  const loadingOps = useMemo(
    () => operations.filter((o) => o.status === "loading" || o.status === "assigned"),
    [operations]
  );

  const lateLoading = useMemo(() => {
    const now = new Date();
    return loadingOps.filter((o) => {
      if (!o.scheduled_pickup) return false;
      const t = new Date(o.scheduled_pickup);
      return !Number.isNaN(t.getTime()) && isAfter(now, t);
    });
  }, [loadingOps]);

  const vehiclesLoadingSite = useMemo(
    () => vehicles.filter((v) => v.status === "loading" || v.status === "unloading"),
    [vehicles]
  );

  return (
    <div className="space-y-6">
      <FleetSubNav />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Alertes chargement</h1>
        <p className="mt-1 text-slate-600">
          Dossiers en chargement / affectation et créneaux dépassés ; véhicules sur site de chargement.
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-slate-500">Chargement…</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-amber-200 bg-amber-50/40">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-amber-900">
                <AlertTriangle className="h-5 w-5" />
                Créneaux enlèvement dépassés ({lateLoading.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lateLoading.length === 0 ? (
                <p className="text-sm text-amber-800">Aucune alerte sur les créneaux planifiés.</p>
              ) : (
                lateLoading.map((o) => (
                  <div
                    key={o.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-white px-3 py-2"
                  >
                    <div>
                      <p className="font-mono font-semibold text-slate-900">{o.reference}</p>
                      <p className="text-xs text-slate-600">
                        Prévu {o.scheduled_pickup ? format(new Date(o.scheduled_pickup), "dd/MM HH:mm", { locale: fr }) : "—"}
                      </p>
                    </div>
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
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Loader className="h-5 w-5 text-blue-600" />
                Opérations en chargement / affectation ({loadingOps.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {loadingOps.length === 0 ? (
                <p className="text-sm text-slate-600">Aucun dossier dans ces statuts.</p>
              ) : (
                loadingOps.map((o) => (
                  <div
                    key={o.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2"
                  >
                    <div>
                      <p className="font-mono text-sm font-semibold">{o.reference}</p>
                      <p className="text-xs text-slate-500">
                        {o.pickup_city} → {o.delivery_city}
                      </p>
                    </div>
                    <StatusBadge status={o.status} size="sm" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200 lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-5 w-5 text-slate-600" />
                Véhicules signalés chargement / déchargement ({vehiclesLoadingSite.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vehiclesLoadingSite.length === 0 ? (
                <p className="text-sm text-slate-600">Aucun véhicule avec statut chargement / déchargement dans le parc.</p>
              ) : (
                <ul className="grid gap-2 sm:grid-cols-2">
                  {vehiclesLoadingSite.map((v) => (
                    <li key={v.id} className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-sm">
                      <span className="font-mono font-medium">{v.plate_number}</span> ·{" "}
                      <StatusBadge status={v.status} size="sm" />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
