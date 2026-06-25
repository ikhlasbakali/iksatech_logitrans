import React from "react";
import { Link } from "react-router-dom";
import { BookUser, FileSpreadsheet } from "lucide-react";
import { TableauDeBordCRM } from "@/modules/crm-dashboard/tableau-de-bord-export";
import { createPageUrl } from "@/utils";

/**
 * Tableau de bord CRM intégré (navigation interne : indicateurs, fil d’Ariane) — alimenté par les entités locales
 * (opérations, devis) ; sans ERP externe obligatoire.
 */
export default function CrmDashboardPage() {
  return (
    <div className="crm-dashboard-wrapper -m-4 lg:-m-6 min-h-[calc(100vh-4rem)] space-y-3">
      <div className="mx-4 mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch">
        <div className="flex-1 min-w-[240px] rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-50 to-white px-4 py-3 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              <FileSpreadsheet className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">Module ERP — devis</p>
              <p className="text-xs text-slate-600 leading-snug">
                Créez et pilotez les devis (statuts, montants HT/TTC, validité). Tableaux et indicateurs sont calculés
                uniquement à partir des données locales (opérations, devis) — aucune synchronisation Odoo ni module FTA.
              </p>
            </div>
          </div>
          <Link
            to={createPageUrl("SalesQuotes")}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Ouvrir les devis
          </Link>
        </div>
        <div className="flex-1 min-w-[240px] rounded-xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50 to-white px-4 py-3 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <BookUser className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">Fichier clients</p>
              <p className="text-xs text-slate-600 leading-snug">
                Modèle CSV ou JSON avec toutes les colonnes ; import en masse pour alimenter le référentiel client de
                l&apos;application.
              </p>
            </div>
          </div>
          <Link
            to={createPageUrl("ClientsFile")}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Ouvrir le fichier
          </Link>
        </div>
      </div>
      <TableauDeBordCRM />
    </div>
  );
}
