import React from "react";
import { Euro, TrendingUp, Plane, Ship, Target, AlertTriangle, Clock } from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/formatters";
import type { DashboardMetrics } from "../types/crm";

interface EnhancedMetricsProps {
  metrics: DashboardMetrics;
  onMetricsClick?: (currency: "EUR" | "DH") => void;
  onTripsClick?: () => void;
  onMonthlyRevenueClick?: () => void;
  onDailyRevenueClick?: () => void;
  onPipelineClick?: () => void;
}

export const EnhancedMetrics: React.FC<EnhancedMetricsProps> = ({
  metrics,
  onMetricsClick,
  onTripsClick,
  onMonthlyRevenueClick,
  onDailyRevenueClick,
  onPipelineClick,
}) => {
  const formatDH = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const monthRevenue = metrics.current_month_revenue;
  const dayRevenue = Math.max(1, Math.round(monthRevenue / 30));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
      <div
        className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/80 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer text-white"
        onClick={() => onMetricsClick?.("EUR")}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-200">Chiffre d&apos;affaires HT (EUR)</p>
            <p className="text-sm text-slate-400">Revenus consolidés</p>
            <p className="text-3xl font-bold text-white mt-2">{formatCurrency(metrics.total_revenue_ht)}</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-teal-300 mr-1" />
              <span className="text-sm font-bold text-teal-200">
                +{formatPercentage(metrics.revenue_growth)} vs mois dernier
              </span>
            </div>
          </div>
          <Euro className="w-10 h-10 text-teal-300" />
        </div>
      </div>

      <div
        className="bg-gradient-to-br from-teal-50 to-cyan-100 p-6 rounded-2xl border border-teal-200/60 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={() => onMetricsClick?.("DH")}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-teal-900">Chiffre d&apos;affaires HT (DH)</p>
            <p className="text-sm text-teal-800">Équivalent dirhams</p>
            <p className="text-3xl font-bold text-teal-950 mt-2">{formatDH(metrics.total_revenue_dh)}</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-cyan-700 mr-1" />
              <span className="text-sm font-bold text-cyan-800">
                +{formatPercentage(metrics.revenue_growth_previous_year)} vs année dernière
              </span>
            </div>
          </div>
          <Target className="w-10 h-10 text-teal-700" />
        </div>
      </div>

      <div
        className="bg-gradient-to-br from-cyan-50 to-sky-100 p-6 rounded-2xl border border-cyan-200/60 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={onMonthlyRevenueClick}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-cyan-900">Revenu du mois</p>
            <p className="text-sm text-cyan-800">Suivi mensuel</p>
            <p className="text-3xl font-bold text-cyan-950 mt-2">{formatCurrency(monthRevenue)}</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse mr-2" />
              <span className="text-sm font-bold text-teal-700">LIVE</span>
              <span className="text-sm text-cyan-800 ml-2">
                {new Date().toLocaleDateString("fr-FR", { month: "long" })}
              </span>
            </div>
          </div>
          <TrendingUp className="w-10 h-10 text-cyan-700" />
        </div>
      </div>

      <div
        className="bg-gradient-to-br from-amber-50 to-orange-100 p-6 rounded-2xl border border-amber-200/60 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={onDailyRevenueClick}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-900">Revenu du jour</p>
            <p className="text-sm text-amber-800">Estimation (CA mois / 30)</p>
            <p className="text-3xl font-bold text-amber-950 mt-2">{formatCurrency(dayRevenue)}</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-2" />
              <span className="text-sm font-bold text-orange-800">LIVE</span>
              <span className="text-sm text-amber-800 ml-2">
                {new Date().toLocaleDateString("fr-FR", { weekday: "long" })}
              </span>
            </div>
          </div>
          <Clock className="w-10 h-10 text-amber-700" />
        </div>
      </div>

      <div
        className="bg-gradient-to-br from-indigo-50 to-violet-100 p-6 rounded-2xl border border-indigo-200/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={onTripsClick}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-900">Voyages (import / export)</p>
            <p className="text-sm text-indigo-800">Volume dossiers</p>
            <p className="text-3xl font-bold text-indigo-950 mt-2">{metrics.total_trips}</p>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center">
                <Ship className="w-4 h-4 text-teal-700 mr-1" />
                <span className="text-sm font-bold text-teal-800">{metrics.import_trips} import</span>
              </div>
              <div className="flex items-center">
                <Plane className="w-4 h-4 text-sky-700 mr-1" />
                <span className="text-sm font-bold text-sky-800">{metrics.export_trips} export</span>
              </div>
            </div>
          </div>
          <Plane className="w-10 h-10 text-indigo-700" />
        </div>
      </div>

      <div
        className="bg-gradient-to-br from-rose-50 to-orange-50 p-6 rounded-2xl border border-rose-200/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={onPipelineClick}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-rose-900">Pipeline CRM</p>
            <p className="text-sm text-rose-800">Opportunités en cours</p>
            <p className="text-3xl font-bold text-rose-950 mt-2">{formatCurrency(metrics.pipeline_value)}</p>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center">
                <span className="text-sm font-bold text-teal-700">
                  {formatCurrency(metrics.pipeline_value - metrics.pipeline_lost)} actif
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-bold text-rose-700">
                  {formatCurrency(metrics.pipeline_lost)} perdu
                </span>
              </div>
            </div>
          </div>
          <AlertTriangle className="w-10 h-10 text-rose-600" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-100 p-6 rounded-2xl border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-900">Taux évaluation objectif</p>
            <p className="text-sm text-emerald-800">Performance vs objectifs</p>
            <p className="text-3xl font-bold text-emerald-950 mt-2">
              {formatPercentage(metrics.objective_evaluation_rate)}
            </p>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-teal-500 to-cyan-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, metrics.objective_evaluation_rate)}%` }}
              />
            </div>
          </div>
          <Target className="w-10 h-10 text-emerald-700" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-sky-50 to-indigo-50 p-6 rounded-2xl border border-sky-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-sky-900">Ce mois vs mois dernier</p>
            <p className="text-sm text-sky-800">Évolution mensuelle</p>
            <p className="text-3xl font-bold text-sky-950 mt-2">{formatCurrency(metrics.current_month_revenue)}</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-teal-600 mr-1" />
              <span className="text-sm font-bold text-teal-800">
                +
                {formatPercentage(
                  ((metrics.current_month_revenue - metrics.previous_month_revenue) /
                    metrics.previous_month_revenue) *
                    100
                )}{" "}
                vs mois dernier
              </span>
            </div>
          </div>
          <TrendingUp className="w-10 h-10 text-sky-700" />
        </div>
      </div>
    </div>
  );
};
