import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  ListOrdered,
  Loader,
  Wrench,
  BadgeCheck,
  Globe2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fleetTabs = [
  { to: "/flotte", label: "Accueil flotte", icon: LayoutGrid, end: true },
  { to: "/flotte/detail", label: "Flotte détaillée", icon: ListOrdered, end: false },
  { to: "/flotte/alertes-chargement", label: "Alertes chargement", icon: Loader, end: false },
  { to: "/flotte/maintenance-flotte", label: "Maintenance flotte", icon: Wrench, end: false },
  { to: "/flotte/exploitation-iso", label: "Exploitation (ISO)", icon: BadgeCheck, end: false },
  { to: "/flotte/suivi-inter", label: "Suivi international", icon: Globe2, end: false },
];

export default function FleetSubNav() {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-2 shadow-md">
      <div className="flex flex-wrap items-center gap-1">
        {fleetTabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-colors sm:text-sm",
                isActive
                  ? "bg-white text-slate-900 shadow"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0 opacity-90" />
            <span className="whitespace-nowrap">{label}</span>
          </NavLink>
        ))}
      </div>
      <p className="mt-2 px-2 text-[11px] text-slate-400 sm:text-xs">
        Missions, chauffeurs et rapports : menu latéral.
      </p>
    </div>
  );
}
