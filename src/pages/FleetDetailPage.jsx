import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { appApi } from "@/api/appApi";
import { createPageUrl } from "@/utils";
import FleetSubNav from "@/components/fleet/FleetSubNav";
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
import { getVehicleAssetCategory, assetCategoryLabels } from "@/utils/fleetCategories";
import { Search, Truck } from "lucide-react";

export default function FleetDetailPage() {
  const [q, setQ] = useState("");
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["vehicles", "fleetDetail"],
    queryFn: () => appApi.entities.Vehicle.list(),
  });

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return vehicles.filter((v) => {
      if (!s) return true;
      const hay = [v.plate_number, v.brand, v.model, v.current_driver, v.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(s);
    });
  }, [vehicles, q]);

  return (
    <div className="space-y-6">
      <FleetSubNav />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Flotte détaillée</h1>
        <p className="mt-1 text-slate-600">
          Tracteurs et remorques : immatriculation, statut, conducteur, échéances.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Rechercher plaque, marque, chauffeur…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Chargement…</div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Truck className="mx-auto mb-3 h-10 w-10 opacity-30" />
            Aucun véhicule ne correspond à la recherche.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80">
                  <TableHead>Plaque</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Marque / modèle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Chauffeur</TableHead>
                  <TableHead>Km</TableHead>
                  <TableHead>Prochaine maintenance</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((v) => (
                  <TableRow key={v.id} className="hover:bg-slate-50/80">
                    <TableCell className="font-mono font-semibold">{v.plate_number}</TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {assetCategoryLabels[getVehicleAssetCategory(v)] ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {v.brand} {v.model}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={v.status} size="sm" />
                    </TableCell>
                    <TableCell className="text-sm">{v.current_driver ?? "—"}</TableCell>
                    <TableCell className="font-mono text-sm">{v.mileage != null ? `${v.mileage} km` : "—"}</TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {v.next_maintenance
                        ? format(new Date(v.next_maintenance), "dd/MM/yyyy", { locale: fr })
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.location.href =
                            createPageUrl("VehicleDetail") + "?id=" + encodeURIComponent(v.id);
                        }}
                      >
                        Fiche
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
