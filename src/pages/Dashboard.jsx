import React, { useMemo } from 'react';
import { appApi } from '@/api/appApi';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Package, 
  Truck, 
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Boxes,
  Route,
  Star,
  ClipboardList,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/auth/AuthContext";
import { resolveDriverId, filterOperationsForDriver } from "@/utils/driverMissions";

import KpiCard from "@/components/ui/KpiCard";
import OperationsTable from "@/components/dashboard/OperationsTable";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import MiniMap from "@/components/dashboard/MiniMap";
import QuickActions from "@/components/dashboard/QuickActions";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { fleetStatsByCategory } from "@/utils/fleetCategories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  APP_HERO_HEADLINE,
  APP_TAGLINE,
  APP_VALUE_CHIPS,
  APP_VALUE_PROPOSITION,
} from "@/config/branding";

const FLEET_MISSION_TABLE_ROLES = ['admin', 'manager', 'exploitation_manager', 'agent', 'support'];

function canOpenFleetMissionTable(userRole) {
  return FLEET_MISSION_TABLE_ROLES.includes(String(userRole || '').trim().toLowerCase());
}

export default function Dashboard() {
  const { user } = useAuth();
  const isDriver = String(user?.user_role || '').toLowerCase() === 'driver';

  const { data: operations = [], isLoading: opsLoading } = useQuery({
    queryKey: ['operations'],
    queryFn: () => appApi.entities.Operation.list('-created_date', 400),
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => appApi.entities.Vehicle.list(),
    enabled: !isDriver,
  });

  const { data: drivers = [], isLoading: driversLoading } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => appApi.entities.Driver.list(),
    enabled: isDriver,
  });

  const driverId = useMemo(
    () => (isDriver ? resolveDriverId(user, drivers) : null),
    [isDriver, user, drivers]
  );

  const scopedOperations = useMemo(() => {
    if (!isDriver) return operations;
    return filterOperationsForDriver(operations, driverId, user?.full_name);
  }, [isDriver, operations, driverId, user?.full_name]);

  const myDriverRecord = useMemo(
    () => (driverId ? drivers.find((d) => d.id === driverId) : null),
    [drivers, driverId]
  );

  const fleetSplit = fleetStatsByCategory(vehicles);

  const isLoading = isDriver ? opsLoading || driversLoading : opsLoading;

  const startOfMonth = useMemo(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  }, []);

  const startOfPrevMonth = useMemo(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth() - 1, 1);
  }, []);

  const execTrends = useMemo(() => {
    const todayStr = new Date().toDateString();
    const createdInRange = (op, from, to) => {
      const d = op.created_date ? new Date(op.created_date) : null;
      if (!d || Number.isNaN(d.getTime())) return false;
      return d >= from && (!to || d < to);
    };
    const opsThisMonth = operations.filter((op) => createdInRange(op, startOfMonth, null)).length;
    const opsPrevMonth = operations.filter((op) =>
      createdInRange(op, startOfPrevMonth, startOfMonth)
    ).length;
    const pct = (cur, prev) => (prev > 0 ? Math.round((100 * (cur - prev)) / prev) : null);
    const momOpsPct = pct(opsThisMonth, opsPrevMonth);

    const isDelivered = (op) => op.status === "delivered" || op.status === "completed";
    const deliveredIn = (from, to) =>
      operations.filter((op) => {
        if (!isDelivered(op) || !op.actual_delivery) return false;
        const ad = new Date(op.actual_delivery);
        if (Number.isNaN(ad.getTime())) return false;
        return ad >= from && (!to || ad < to);
      }).length;
    const delThis = deliveredIn(startOfMonth, null);
    const delPrev = deliveredIn(startOfPrevMonth, startOfMonth);
    const momDelPct = pct(delThis, delPrev);

    const scheduledToday = operations.filter((op) => {
      if (!op.scheduled_delivery) return false;
      if (new Date(op.scheduled_delivery).toDateString() !== todayStr) return false;
      return ["assigned", "loading", "in_transit", "unloading"].includes(op.status);
    }).length;

    return {
      opsThisMonth,
      momOpsPct,
      momDelPct,
      scheduledToday,
    };
  }, [operations, startOfMonth, startOfPrevMonth]);

  const driverStats = useMemo(() => {
    const active = scopedOperations.filter((op) =>
      ['assigned', 'loading', 'in_transit', 'unloading'].includes(op.status)
    ).length;
    const deliveredThisMonth = scopedOperations.filter((op) => {
      if (op.status !== 'delivered' && op.status !== 'completed') return false;
      const ad = op.actual_delivery ? new Date(op.actual_delivery) : null;
      return ad && !Number.isNaN(ad.getTime()) && ad >= startOfMonth;
    }).length;
    const delayed = scopedOperations.filter((op) => (op.delay_minutes || 0) > 30).length;
    const incidents = scopedOperations.filter((op) => op.status === 'incident').length;
    return { active, deliveredThisMonth, delayed, incidents, total: scopedOperations.length };
  }, [scopedOperations, startOfMonth]);

  // Calculate KPIs (vue générale)
  const inTransitCount = operations.filter(op => 
    ['in_transit', 'loading', 'unloading'].includes(op.status)
  ).length;
  
  const todayDeliveries = operations.filter(op => 
    op.status === 'delivered' && 
    op.actual_delivery && 
    new Date(op.actual_delivery).toDateString() === new Date().toDateString()
  ).length;
  
  const incidentCount = operations.filter(op => op.status === 'incident').length;
  const delayedCount = operations.filter(op => op.delay_minutes > 30).length;
  
  const recentOperations = scopedOperations.slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl lg:text-3xl font-bold text-slate-900"
          >
            Bonjour{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''} 👋
          </motion.h1>
          <p className="text-slate-500 mt-1">
            {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
          </p>
        </div>
        <QuickActions userRole={user?.user_role} />
      </div>

      {!isDriver && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-sky-200/70 bg-gradient-to-r from-sky-50/80 via-white to-emerald-50/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-900">
                {APP_HERO_HEADLINE}
              </CardTitle>
              <p className="text-sm text-slate-600 font-normal leading-relaxed">{APP_TAGLINE}</p>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <p className="text-xs text-slate-600 leading-relaxed">{APP_VALUE_PROPOSITION}</p>
              <div className="flex flex-wrap gap-2">
                {APP_VALUE_CHIPS.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-slate-200 bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-slate-700"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {isDriver ? (
          <>
            <KpiCard
              title="Missions en cours"
              value={driverStats.active}
              subtitle={`${driverStats.total} dossier(s) affecté(s)`}
              icon={Route}
              color="blue"
              trend="stable"
            />
            <KpiCard
              title="Livraisons ce mois"
              value={driverStats.deliveredThisMonth}
              subtitle="Trajets terminés (mois en cours)"
              icon={CheckCircle2}
              color="green"
              trend="up"
            />
            <KpiCard
              title="Mes retards"
              value={driverStats.delayed}
              subtitle={driverStats.delayed > 0 ? '> 30 min sur ETA' : 'Dans les temps'}
              icon={Clock}
              color="amber"
              trend={driverStats.delayed > 0 ? 'down' : 'stable'}
            />
            <KpiCard
              title="Mes incidents"
              value={driverStats.incidents}
              subtitle={driverStats.incidents > 0 ? 'Dossiers en incident' : 'Aucun incident'}
              icon={AlertTriangle}
              color="red"
            />
          </>
        ) : (
          <>
            <KpiCard
              title="Opérations en cours"
              value={inTransitCount}
              subtitle={`${execTrends.opsThisMonth} dossier(s) créé(s) ce mois (toutes dates)`}
              icon={Package}
              color="blue"
              trend={
                execTrends.momOpsPct == null ? "stable" : execTrends.momOpsPct >= 0 ? "up" : "down"
              }
              trendValue={
                execTrends.momOpsPct == null
                  ? undefined
                  : `${execTrends.momOpsPct >= 0 ? "+" : ""}${execTrends.momOpsPct}% vs mois préc.`
              }
            />
            <KpiCard
              title="Livraisons aujourd'hui"
              value={todayDeliveries}
              subtitle={`${execTrends.scheduledToday} en cours / prévues aujourd'hui (échéance)`}
              icon={CheckCircle2}
              color="green"
              trend={
                execTrends.momDelPct == null ? "stable" : execTrends.momDelPct >= 0 ? "up" : "down"
              }
              trendValue={
                execTrends.momDelPct == null
                  ? undefined
                  : `${execTrends.momDelPct >= 0 ? "+" : ""}${execTrends.momDelPct}% livr. mois / mois-1`
              }
            />
            <KpiCard
              title="En retard"
              value={delayedCount}
              subtitle={delayedCount > 0 ? "Action requise" : "Tout est à l'heure"}
              icon={Clock}
              color="amber"
              trend={delayedCount > 2 ? "down" : "stable"}
            />
            <KpiCard
              title="Incidents actifs"
              value={incidentCount}
              subtitle={incidentCount > 0 ? "À traiter" : "Aucun incident"}
              icon={AlertTriangle}
              color="red"
            />
          </>
        )}
      </div>

      {!isDriver && canOpenFleetMissionTable(user?.user_role) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="border-indigo-200/80 bg-gradient-to-r from-indigo-50/90 via-white to-white shadow-sm overflow-hidden">
            <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-5">
              <div className="flex gap-4 min-w-0">
                <div className="shrink-0 rounded-xl bg-indigo-600 p-3 shadow-inner">
                  <ClipboardList className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Tableau de bord logistique (KPI flotte)
                  </h2>
                  <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                    Grille dédiée (Int. resp., tracteur, position, sens, priorité, retard…) — pas la même vue que la
                    liste « Opérations ». Ouvrez-la ici ou via le menu « Tableau missions ».
                  </p>
                </div>
              </div>
              <Button
                className="shrink-0 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => {
                  window.location.href = createPageUrl('FleetDashboard');
                }}
              >
                Ouvrir le tableau logistique
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {isDriver && (
        <Card className="border-blue-100/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Star className="h-5 w-5 text-amber-500" />
              Indicateurs sur vos trajets
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!driverId ? (
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                Votre compte n&apos;est pas encore relié à une fiche chauffeur. Un administrateur peut vous associer
                dans Administration — ou connectez-vous avec le compte chauffeur seed{' '}
                <span className="font-mono">viktor.rostov@fleet.demo</span>.
              </p>
            ) : myDriverRecord ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="rounded-lg bg-slate-50 py-3">
                  <p className="text-xl font-bold text-slate-900">{myDriverRecord.total_deliveries ?? 0}</p>
                  <p className="text-xs text-slate-500">Livraisons (carrière)</p>
                </div>
                <div className="rounded-lg bg-emerald-50 py-3">
                  <p className="text-xl font-bold text-emerald-800">{myDriverRecord.on_time_rate ?? 0}%</p>
                  <p className="text-xs text-slate-600">À l&apos;heure</p>
                </div>
                <div className="rounded-lg bg-amber-50 py-3">
                  <p className="text-xl font-bold text-amber-800 flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 shrink-0" />
                    {myDriverRecord.rating ?? '—'}
                  </p>
                  <p className="text-xs text-slate-600">Note</p>
                </div>
                <div className="rounded-lg bg-blue-50 py-3">
                  <p className="text-xl font-bold text-blue-900 capitalize">{myDriverRecord.status || '—'}</p>
                  <p className="text-xs text-slate-600">Statut terrain</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-600">Chargement du profil…</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Flotte : statistiques tracteurs / remorques séparées */}
      {!isDriver && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-blue-100/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Truck className="h-5 w-5 text-blue-600" />
              Tracteurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-lg bg-slate-50 py-3">
                <p className="text-xl font-bold text-slate-900">{fleetSplit.tractors.total}</p>
                <p className="text-xs text-slate-500">Total</p>
              </div>
              <div className="rounded-lg bg-emerald-50 py-3">
                <p className="text-xl font-bold text-emerald-800">{fleetSplit.tractors.available}</p>
                <p className="text-xs text-slate-600">Dispo.</p>
              </div>
              <div className="rounded-lg bg-amber-50 py-3">
                <p className="text-xl font-bold text-amber-800">{fleetSplit.tractors.active}</p>
                <p className="text-xs text-slate-600">En service</p>
              </div>
              <div className="rounded-lg bg-orange-50 py-3">
                <p className="text-xl font-bold text-orange-800">{fleetSplit.tractors.maintenance}</p>
                <p className="text-xs text-slate-600">Maintenance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-violet-100/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Boxes className="h-5 w-5 text-violet-600" />
              Remorques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-lg bg-slate-50 py-3">
                <p className="text-xl font-bold text-slate-900">{fleetSplit.trailers.total}</p>
                <p className="text-xs text-slate-500">Total</p>
              </div>
              <div className="rounded-lg bg-emerald-50 py-3">
                <p className="text-xl font-bold text-emerald-800">{fleetSplit.trailers.available}</p>
                <p className="text-xs text-slate-600">Dispo.</p>
              </div>
              <div className="rounded-lg bg-amber-50 py-3">
                <p className="text-xl font-bold text-amber-800">{fleetSplit.trailers.active}</p>
                <p className="text-xs text-slate-600">En service</p>
              </div>
              <div className="rounded-lg bg-orange-50 py-3">
                <p className="text-xl font-bold text-orange-800">{fleetSplit.trailers.maintenance}</p>
                <p className="text-xs text-slate-600">Maintenance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Operations table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900">
                {isDriver ? 'Mes opérations récentes' : 'Opérations récentes'}
              </h3>
            </div>
            {!isDriver && (
              <div className="flex items-center gap-1">
                {canOpenFleetMissionTable(user?.user_role) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-indigo-200 text-indigo-800 hover:bg-indigo-50"
                    onClick={() => {
                      window.location.href = createPageUrl('FleetDashboard');
                    }}
                  >
                    <ClipboardList className="w-4 h-4 mr-1" />
                    Tableau logistique
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = createPageUrl('Operations')}
                >
                  Tout voir
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
            {isDriver && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = createPageUrl('DriverApp')}
              >
                App Chauffeur
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">
              <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
              Chargement...
            </div>
          ) : (
            <OperationsTable operations={recentOperations} compact showActions={false} />
          )}
        </div>

        {/* Alerts panel */}
        {!isDriver && <AlertsPanel limit={4} />}
        {isDriver && (
          <Card className="border-slate-200/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-900">Raccourcis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.href = createPageUrl('DriverApp')}
              >
                Ouvrir l&apos;app chauffeur
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.href = createPageUrl('Messages')}
              >
                Messages exploitation
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom grid */}
      {!isDriver && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MiniMap className="lg:col-span-2" />
          <ActivityFeed limit={5} />
        </div>
      )}
    </div>
  );
}