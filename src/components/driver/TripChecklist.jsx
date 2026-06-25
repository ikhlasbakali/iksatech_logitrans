import React, { useState } from "react";
import { ClipboardCheck, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DEFAULT_ITEMS = [
  { id: "v1", label: "Visite véhicule / semi : pneus, feux, plaque" },
  { id: "v2", label: "Documents transport (CMR, consignes) présents" },
  { id: "v3", label: "Température / calage chargement conforme" },
  { id: "v4", label: "Éthylotest / repos : OK (simulation)" },
];

/**
 * Checklist pré-départ — grandes zones tactiles, états visuels nets.
 */
export default function TripChecklist({ missionReference }) {
  const [done, setDone] = useState(() => ({}));

  const toggle = (id) => {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const total = DEFAULT_ITEMS.length;
  const ok = DEFAULT_ITEMS.filter((i) => done[i.id]).length;
  const complete = ok === total;

  return (
    <Card className="border-slate-200/80 shadow-sm overflow-hidden">
      <CardHeader className="pb-3 py-3.5 bg-slate-50/80 border-b border-slate-100">
        <CardTitle className="text-sm sm:text-base flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <ClipboardCheck className="w-4 h-4" />
          </span>
          Checklist avant départ
          {missionReference ? (
            <span className="font-mono text-xs text-slate-500 font-normal ml-auto">{missionReference}</span>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-4 pb-4">
        <div
          className={cn(
            "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium mb-1",
            complete ? "bg-emerald-100 text-emerald-900" : "bg-amber-50 text-amber-900"
          )}
        >
          <span>{complete ? "Prêt au départ" : "À compléter avant de rouler"}</span>
          <span className="tabular-nums">
            {ok}/{total}
          </span>
        </div>
        {DEFAULT_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => toggle(item.id)}
            className={cn(
              "w-full text-left rounded-xl border-2 px-4 py-3.5 text-sm font-medium transition-all active:scale-[0.99]",
              "min-h-[52px] flex items-center gap-3 touch-manipulation",
              done[item.id]
                ? "bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm"
                : "bg-white border-slate-200 text-slate-800 hover:border-blue-300 hover:bg-blue-50/50"
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                done[item.id] ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"
              )}
            >
              {done[item.id] ? <Check className="w-4 h-4" strokeWidth={3} /> : null}
            </span>
            <span className="leading-snug">{item.label}</span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
