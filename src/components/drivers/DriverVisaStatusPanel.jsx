import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, UserX, AlertOctagon, AlarmClock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { computeDriverVisaStats } from "@/utils/driverVisaStats";

function StatTile({ icon: Icon, label, value, tone }) {
  const tones = {
    emerald: "border-emerald-200/80 bg-emerald-50/90 text-emerald-900",
    slate: "border-slate-200/80 bg-slate-50 text-slate-800",
    rose: "border-rose-200/80 bg-rose-50 text-rose-900",
    amber: "border-amber-200/80 bg-amber-50 text-amber-950",
  };
  return (
    <div className={cn("rounded-xl border p-4 shadow-sm", tones[tone] || tones.slate)}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide opacity-90">
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </div>
      <p className="mt-2 text-3xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

export default function DriverVisaStatusPanel({
  drivers,
  className,
  showExpiringList = true,
  title = "Statut des visas",
}) {
  const stats = useMemo(() => computeDriverVisaStats(drivers), [drivers]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm", className)}
    >
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">
            <strong className="font-medium text-slate-700">Sans visa</strong> : aucune date d&apos;expiration
            enregistrée sur la fiche. <strong className="font-medium text-slate-700">Avec visa</strong> : date
            renseignée et non expirée (y compris alerte « expirant bientôt », fin dans ≤ 30 jours).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={BadgeCheck} label="Avec visa" value={stats.avecVisa} tone="emerald" />
        <StatTile icon={UserX} label="Sans visa" value={stats.sansVisa} tone="slate" />
        <StatTile icon={AlertOctagon} label="Visas expirés" value={stats.visasExpires} tone="rose" />
        <StatTile icon={AlarmClock} label="Expirant bientôt" value={stats.expirantBientot} tone="amber" />
      </div>

      {showExpiringList && stats.expirantBientotList.length > 0 && (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="mb-2 text-sm font-medium text-slate-700">Chauffeurs — visa expirant bientôt</p>
          <ul className="max-h-48 space-y-2 overflow-y-auto text-sm">
            {stats.expirantBientotList.map((row) => (
              <li
                key={row.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-amber-50/60 px-3 py-2 ring-1 ring-amber-200/60"
              >
                <span className="font-medium text-slate-900">{row.name}</span>
                <span className="shrink-0 font-mono text-xs text-amber-900">
                  {format(new Date(row.expiry), "dd/MM/yyyy", { locale: fr })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
