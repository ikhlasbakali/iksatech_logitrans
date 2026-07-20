import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Search,
  RefreshCw,
  Radio,
  Database,
  Download,
  Truck,
  Package,
  Users,
  Target,
  Fuel,
  BarChart3,
  ShieldCheck,
  Gauge,
  ChevronDown,
  Activity,
  Smile,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { appApi } from "@/api/appApi";
import { createPageUrl } from "@/utils";
import { downloadCsv } from "@/utils/export";
import { APP_FLEET_CONTEXT_LINE, APP_NAME } from "@/config/branding";
import { computeFleetDashboardKpis } from "@/services/analytics/computeFleetDashboardKpis";
import {
  fetchLogisticsMissions,
  postLogisticsSync,
  mapOperationsToDashboardMissions,
} from "@/services/logisticsDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import FleetSubNav from "@/components/fleet/FleetSubNav";
import DriverVisaStatusPanel from "@/components/drivers/DriverVisaStatusPanel";

function formatFrInt(n) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n ?? 0);
}

function formatFr1(n) {
  return new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n ?? 0);
}

function SolidKpiCard({ title, value, sublines, icon: Icon, className, iconWrapClass }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 text-white shadow-lg min-h-[168px] flex flex-col",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-white/90">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div className={cn("rounded-xl p-2.5 shrink-0", iconWrapClass)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="mt-auto pt-4 space-y-1 text-xs text-white/85">{sublines}</div>
    </motion.div>
  );
}

function OutlineKpiCard({ title, value, valueClass, subline, icon: Icon, iconClass }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm min-h-[140px] flex flex-col"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className={cn("mt-2 text-2xl font-bold tracking-tight", valueClass)}>{value}</p>
        </div>
        <Icon className={cn("h-7 w-7 shrink-0 opacity-90", iconClass)} />
      </div>
      {subline && <div className="mt-auto space-y-1 pt-3 text-xs text-slate-500">{subline}</div>}
    </motion.div>
  );
}

export default function FleetDashboardPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [missionsOpen, setMissionsOpen] = useState(true);

  const { data: drivers = [], isLoading: driversLoading } = useQuery({
    queryKey: ["drivers", "fleetDashboard"],
    queryFn: () => appApi.entities.Driver.list(),
  });

  const { data: operations = [], isLoading: operationsLoading } = useQuery({
    queryKey: ["operations", "fleetDashboard"],
    queryFn: () => appApi.entities.Operation.list("-created_date", 300),
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ["vehicles", "fleetDashboard"],
    queryFn: () => appApi.entities.Vehicle.list(),
  });

  const { data: vehicleCosts = [] } = useQuery({
    queryKey: ["vehicleCosts", "fleetDashboard"],
    queryFn: () => appApi.entities.VehicleCost.list("-date", 500),
  });

  const { data: maintenanceHistory = [] } = useQuery({
    queryKey: ["maintenanceHistory", "fleetDashboard"],
    queryFn: () => appApi.entities.MaintenanceHistory.list("-date", 200),
  });

  const { data: salesQuotes = [] } = useQuery({
    queryKey: ["salesQuotes", "fleetDashboard"],
    queryFn: () => appApi.entities.SalesQuote.list("-created_date", 200),
  });

  const { data: incidents = [] } = useQuery({
    queryKey: ["incidents", "fleetDashboard"],
    queryFn: () => appApi.entities.Incident.list("-created_date", 200),
  });

  const K = useMemo(
    () =>
      computeFleetDashboardKpis({
        vehicles,
        drivers,
        operations,
        vehicleCosts,
        maintenanceHistory,
        salesQuotes,
        incidents,
      }),
    [vehicles, drivers, operations, vehicleCosts, maintenanceHistory, salesQuotes, incidents]
  );

  const logisticsQuery = useQuery({
    queryKey: ["logisticsMissions"],
    queryFn: fetchLogisticsMissions,
    retry: false,
  });

  const fromApi = logisticsQuery.isSuccess;
  const missions = useMemo(() => {
    if (fromApi) return logisticsQuery.data ?? [];
    if (logisticsQuery.isError) return mapOperationsToDashboardMissions(operations);
    return [];
  }, [fromApi, logisticsQuery.data, logisticsQuery.isError, operations]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return missions;
    return missions.filter((row) => {
      const hay = [
        row.REFERENCE,
        row.CLIENT,
        row.CHAUFFEUR,
        row.TRACTEUR,
        row.IMPORT,
        row.POSITION,
        row.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [missions, searchTerm]);

  const syncMutation = useMutation({
    mutationFn: () => postLogisticsSync(),
    onSuccess: () => {
      toast.success("Synchronisation demandée");
      queryClient.invalidateQueries({ queryKey: ["logisticsMissions"] });
    },
    onError: () => toast.error("Impossible de lancer la synchro (API indisponible ?)"),
  });

  const handleExportCsv = () => {
    downloadCsv(
      "tableau-bord-flotte.csv",
      filtered.map((row) => ({
        id: row.id,
        REFERENCE: row.REFERENCE ?? "",
        CLIENT: row.CLIENT ?? "",
        TRACTEUR: row.TRACTEUR ?? "",
        POSITION: row.POSITION ?? "",
        IMPORT: row.IMPORT ?? "",
        status: row.status ?? "",
        CHAUFFEUR: row.CHAUFFEUR ?? "",
        TRAJET: row.TRAJET ?? "",
        RETARD_MIN: row.RETARD_MIN ?? "",
        PRIORITE: row.PRIORITE ?? "",
      })),
      [
        "id",
        "REFERENCE",
        "CLIENT",
        "TRACTEUR",
        "POSITION",
        "IMPORT",
        "status",
        "CHAUFFEUR",
        "TRAJET",
        "RETARD_MIN",
        "PRIORITE",
      ]
    );
  };

  const loadingMain =
    logisticsQuery.isPending || (logisticsQuery.isError && operationsLoading);

  return (
    <div className="space-y-6">
      <FleetSubNav />
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
            >
              Tableau de bord logistique
            </motion.h1>
            <p className="mt-1 text-slate-600">
              {APP_FLEET_CONTEXT_LINE} — {APP_NAME}
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <time
              dateTime={new Date().toISOString()}
              className="font-mono text-slate-800"
            >
              {new Date().toLocaleString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </time>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-500/30">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
              <span>Système actif</span>
            </span>
            {fromApi ? (
              <span className="text-xs text-emerald-700">API missions connectée</span>
            ) : logisticsQuery.isError ? (
              <span className="text-xs text-amber-700">Mode données locales</span>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              className="rounded-xl bg-[#1a56db] hover:bg-[#1547b8] text-white shadow-md"
              onClick={() => {
                window.location.href = createPageUrl("FleetDetail");
              }}
            >
              Parc véhicules
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                window.location.href = createPageUrl("LiveMap");
              }}
            >
              Carte temps réel
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SolidKpiCard
          title="Total tracteurs"
          value={formatFrInt(K.tracteurs.total)}
          className="bg-[#4285F4]"
          iconWrapClass="bg-white/20"
          icon={Truck}
          sublines={
            <>
              <p>En mission : {formatFrInt(K.tracteurs.enMission)}</p>
              <p>Disponibles : {formatFrInt(K.tracteurs.disponibles)}</p>
              <p>Maintenance : {formatFrInt(K.tracteurs.maintenance)}</p>
            </>
          }
        />
        <SolidKpiCard
          title="Total remorques"
          value={formatFrInt(K.remorques.total)}
          className="bg-[#34A853]"
          iconWrapClass="bg-white/20"
          icon={Package}
          sublines={
            <>
              <p>En mission : {formatFrInt(K.remorques.enMission)}</p>
              <p>Disponibles : {formatFrInt(K.remorques.disponibles)}</p>
              <p>Maintenance : {formatFrInt(K.remorques.maintenance)}</p>
            </>
          }
        />
        <SolidKpiCard
          title="Total chauffeurs"
          value={formatFrInt(K.chauffeurs.total)}
          className="bg-[#8E24AA]"
          iconWrapClass="bg-white/20"
          icon={Users}
          sublines={
            <>
              <p>En mission : {formatFrInt(K.chauffeurs.enMission)}</p>
              <p>Disponibles : {formatFrInt(K.chauffeurs.disponibles)}</p>
              <p>Visa valide : {formatFrInt(K.chauffeurs.visaValide)}</p>
              <p>En congé : {formatFrInt(K.chauffeurs.enConge)}</p>
            </>
          }
        />
        <SolidKpiCard
          title="Livraisons à l'heure"
          value={`${formatFr1(K.livraisonsALHeure.principal)} %`}
          className="bg-[#FB8C00]"
          iconWrapClass="bg-white/20"
          icon={Target}
          sublines={
            <>
              <p>Client : {formatFr1(K.livraisonsALHeure.client)} %</p>
              <p>Interne : {formatFr1(K.livraisonsALHeure.interne)} %</p>
              <p>+{formatFr1(K.livraisonsALHeure.tendanceMois)} % vs mois dernier</p>
            </>
          }
        />
        <SolidKpiCard
          title="Revenus mensuels"
          value={`${formatFrInt(K.revenus.mad)}\u00a0MAD`}
          className="bg-[#3949AB]"
          iconWrapClass="bg-white/20"
          icon={Activity}
          sublines={<p>+{formatFr1(K.revenus.tendanceMois)} % vs mois dernier</p>}
        />
        <SolidKpiCard
          title="Efficacité carburant"
          value={`${formatFr1(K.carburant.l100)} L/100km`}
          className="bg-[#00897B]"
          iconWrapClass="bg-white/20"
          icon={Fuel}
          sublines={
            <>
              <p>Seuil alerte : {formatFrInt(K.carburant.seuilAlerte)} L/100km</p>
              <p>Tracteurs en alerte : {formatFrInt(K.carburant.tracteursEnAlerte)}</p>
              <p>{formatFr1(K.carburant.ameliorationPct)} % amélioration</p>
            </>
          }
        />
        <SolidKpiCard
          title="Missions cette semaine"
          value={formatFrInt(K.missionsSemaine.nombre)}
          className="bg-[#D81B60]"
          iconWrapClass="bg-white/20"
          icon={BarChart3}
          sublines={
            <>
              <p className="text-white/95">Missions</p>
              <p>+{formatFrInt(K.missionsSemaine.tendanceSemaine)} % vs semaine dernière</p>
            </>
          }
        />
        <SolidKpiCard
          title="Satisfaction client"
          value={formatFrInt(K.satisfaction.reclamationsParSemaine)}
          className="bg-[#00ACC1]"
          iconWrapClass="bg-white/20"
          icon={Smile}
          sublines={
            <>
              <p>Réclamations/semaine</p>
              <p>Résolues : {formatFrInt(K.satisfaction.resolues)}</p>
              <p>+{formatFr1(K.satisfaction.tendanceMois)} % vs mois dernier</p>
            </>
          }
        />
        <OutlineKpiCard
          title="Score de sécurité"
          value={`${formatFr1(K.securite.score)} %`}
          valueClass="text-emerald-600"
          subline={<span>Conformité : {formatFr1(K.securite.conformite)} %</span>}
          icon={ShieldCheck}
          iconClass="text-emerald-500"
        />
        <OutlineKpiCard
          title="Efficacité opérationnelle"
          value={`${formatFr1(K.efficaciteOperationnelle.pct)} %`}
          valueClass="text-[#4285F4]"
          subline={
            <span>Durée moyenne : {formatFr1(K.efficaciteOperationnelle.dureeMoyenneJours)} jours</span>
          }
          icon={Gauge}
          iconClass="text-[#4285F4]"
        />
        <OutlineKpiCard
          title="Kilométrage total"
          value={formatFrInt(K.kilometrage.totalKm)}
          valueClass="text-violet-600"
          subline={<span>Cette semaine · +{formatFr1(K.kilometrage.tendanceSemainePct)} %</span>}
          icon={MapPin}
          iconClass="text-violet-500"
        />
        <OutlineKpiCard
          title="Coût maintenance"
          value={`${formatFrInt(K.coutMaintenance.mad)}\u00a0MAD`}
          valueClass="text-orange-600"
          subline={
            <>
              <span className="block">Efficacité : {formatFr1(K.coutMaintenance.efficacitePct)} %</span>
              <span className="block">Tendance : {formatFr1(K.coutMaintenance.tendancePct)} %</span>
            </>
          }
          icon={AlertTriangle}
          iconClass="text-orange-500"
        />
      </div>

      {!driversLoading && drivers.length > 0 && (
        <DriverVisaStatusPanel drivers={drivers} showExpiringList />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["logisticsMissions"] });
              queryClient.invalidateQueries({ queryKey: ["drivers", "fleetDashboard"] });
              queryClient.invalidateQueries({ queryKey: ["operations", "fleetDashboard"] });
            }}
            disabled={loadingMain}
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", loadingMain && "animate-spin")} />
            Actualiser
          </Button>
          <Button variant="outline" size="sm" className="rounded-lg" onClick={handleExportCsv} disabled={!filtered.length}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button size="sm" variant="secondary" className="rounded-lg" onClick={() => syncMutation.mutate()} disabled={syncMutation.isPending}>
            <Radio className="mr-2 h-4 w-4" />
            Synchro API
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          {fromApi ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-2 py-1 font-medium text-emerald-800">
              <Radio className="h-3 w-3" /> API
            </span>
          ) : logisticsQuery.isError ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-white px-2 py-1 font-medium text-amber-900">
              <Database className="h-3 w-3" /> Local
            </span>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setMissionsOpen((o) => !o)}
          className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-slate-50/80"
        >
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-slate-600" />
            <span className="font-semibold text-slate-900">Détail missions (tableau exploitation)</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{filtered.length}</span>
          </div>
          <ChevronDown className={cn("h-5 w-5 text-slate-500 transition-transform", missionsOpen && "rotate-180")} />
        </button>
        {missionsOpen && (
          <div className="border-t border-slate-100 px-4 pb-4 pt-2">
            <div className="relative mb-4 max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Filtrer : référence, client, chauffeur, tracteur…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {loadingMain ? (
              <div className="py-12 text-center text-slate-500">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#4285F4] border-t-transparent" />
                Chargement des missions…
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <ClipboardList className="mx-auto mb-4 h-12 w-12 opacity-30" />
                <p>Aucune mission à afficher</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="font-semibold text-slate-700">Réf.</TableHead>
                      <TableHead className="font-semibold text-slate-700">Client</TableHead>
                      <TableHead className="font-semibold text-slate-700">Int. resp.</TableHead>
                      <TableHead className="font-semibold text-slate-700">Tracteur</TableHead>
                      <TableHead className="font-semibold text-slate-700">Sens</TableHead>
                      <TableHead className="min-w-[180px] font-semibold text-slate-700">Position</TableHead>
                      <TableHead className="font-semibold text-slate-700">Trajet</TableHead>
                      <TableHead className="font-semibold text-slate-700">Chauffeur</TableHead>
                      <TableHead className="font-semibold text-slate-700">Priorité</TableHead>
                      <TableHead className="font-semibold text-slate-700">Statut</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">Retard</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((row) => (
                      <TableRow
                        key={row.id}
                        className={cn(
                          "cursor-pointer hover:bg-slate-50/80",
                          (row.RETARD_MIN ?? 0) > 30 && "bg-red-50/40"
                        )}
                        onClick={() => {
                          window.location.href =
                            createPageUrl("OperationDetail") + "?id=" + encodeURIComponent(row.id);
                        }}
                      >
                        <TableCell className="font-mono font-medium text-slate-900">
                          {row.REFERENCE ?? row.id}
                        </TableCell>
                        <TableCell className="text-slate-700">{row.CLIENT ?? "—"}</TableCell>
                        <TableCell className="text-slate-600">{row.TRACTEUR || "—"}</TableCell>
                        <TableCell className="text-sm text-slate-600">{row.IMPORT || "—"}</TableCell>
                        <TableCell
                          className="max-w-[220px] truncate align-top text-xs text-slate-600"
                          title={row.POSITION ?? ""}
                        >
                          {row.POSITION ?? "—"}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm text-slate-600" title={row.TRAJET}>
                          {row.TRAJET ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{row.CHAUFFEUR ?? "—"}</TableCell>
                        <TableCell>
                          {row.PRIORITE ? (
                            <StatusBadge status={row.PRIORITE} size="sm" />
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {row.status ? (
                            <StatusBadge status={row.status} size="sm" />
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {(row.RETARD_MIN ?? 0) > 0 ? `${row.RETARD_MIN} min` : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
