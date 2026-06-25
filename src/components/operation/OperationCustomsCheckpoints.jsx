import React, { useState } from "react";
import { appApi } from "@/api/appApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Building2,
  MapPin,
  Plus,
  CheckCircle2,
  Clock,
  Globe,
  Navigation,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/auth/AuthContext";
import { recordCheckpointArrival } from "@/lib/checkpointArrival";
import { formatLocalLong, formatUtcLong, normalizeCountryCode } from "@/utils/international";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const defaultMapCenter = [46.2276, 2.2137];

function PickMarker({ position, onPick }) {
  useMapEvents({
    click(e) {
      onPick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} /> : null;
}

const emptyForm = () => ({
  checkpoint_kind: "customs_office",
  label: "",
  address: "",
  country_code: "",
  customs_reference: "",
  lat: "",
  lng: "",
  scheduled_window_start: "",
  scheduled_window_end: "",
  radius_meters: "500",
});

export default function OperationCustomsCheckpoints({ operation }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const operationId = operation?.id;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [mapPos, setMapPos] = useState(null);

  const { data: checkpoints = [], isLoading } = useQuery({
    queryKey: ["customsCheckpoints", operationId],
    queryFn: () => appApi.entities.CustomsCheckpoint.filter({ operation_id: operationId }, "sequence_order"),
    enabled: !!operationId,
  });

  const createMutation = useMutation({
    mutationFn: (payload) => appApi.entities.CustomsCheckpoint.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customsCheckpoints", operationId] });
      toast.success("Point de passage enregistré");
      setDialogOpen(false);
      setForm(emptyForm());
      setMapPos(null);
    },
    onError: () => toast.error("Enregistrement impossible"),
  });

  const handleAddCheckpoint = () => {
    if (!form.label?.trim()) {
      toast.error("Indiquez un libellé (bureau ou nom du point).");
      return;
    }
    const seq = checkpoints.length;
    const lat = form.lat === "" ? null : parseFloat(form.lat);
    const lng = form.lng === "" ? null : parseFloat(form.lng);
    createMutation.mutate({
      operation_id: operationId,
      checkpoint_kind: form.checkpoint_kind,
      label: form.label.trim(),
      address: form.address?.trim() || "",
      country_code: normalizeCountryCode(form.country_code),
      customs_reference: form.customs_reference?.trim() || "",
      lat: Number.isFinite(lat) ? lat : mapPos?.[0] ?? null,
      lng: Number.isFinite(lng) ? lng : mapPos?.[1] ?? null,
      sequence_order: seq,
      scheduled_window_start: form.scheduled_window_start
        ? new Date(form.scheduled_window_start).toISOString()
        : null,
      scheduled_window_end: form.scheduled_window_end
        ? new Date(form.scheduled_window_end).toISOString()
        : null,
      status: "pending",
      radius_meters: Math.max(50, parseInt(form.radius_meters, 10) || 500),
      arrived_at: null,
      arrived_by_name: null,
      arrived_lat: null,
      arrived_lng: null,
    });
  };

  const confirmMutation = useMutation({
    mutationFn: async ({ checkpoint, useGps }) => {
      let arrLat;
      let arrLng;
      if (useGps && typeof navigator !== "undefined" && navigator.geolocation) {
        try {
          await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                arrLat = pos.coords.latitude;
                arrLng = pos.coords.longitude;
                resolve();
              },
              reject,
              { enableHighAccuracy: true, timeout: 12000 }
            );
          });
        } catch {
          toast.message("Position GPS indisponible — confirmation enregistrée sans coordonnées d’arrivée.");
        }
      }
      await recordCheckpointArrival({
        checkpoint,
        operation,
        actorName: user?.full_name || user?.email || "Exploitation",
        arrivedLat: arrLat,
        arrivedLng: arrLng,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customsCheckpoints", operationId] });
      queryClient.invalidateQueries({ queryKey: ["operationEvents", operationId] });
      queryClient.invalidateQueries({ queryKey: ["transitNotifications"] });
      toast.success("Arrivée enregistrée — exploitation notifiée (horodatage UTC + local).");
    },
    onError: () => toast.error("Confirmation impossible"),
  });

  if (!operationId) return null;

  return (
    <Card className="border-amber-200/80 bg-gradient-to-br from-amber-50/40 to-white">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-amber-700" />
            Douane & points de contrôle
          </CardTitle>
          <p className="mt-1 text-sm text-slate-600">
            Bureaux de douane ou coordonnées précises (WGS‑84). À l’arrivée, l’exploitation reçoit une notification
            avec date/heure UTC, heure locale et détails du point.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="shrink-0 bg-amber-700 hover:bg-amber-800">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un point
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nouveau point de passage</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Type</Label>
                <Select
                  value={form.checkpoint_kind}
                  onValueChange={(v) => setForm((f) => ({ ...f, checkpoint_kind: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customs_office">Bureau de douane / contrôle</SelectItem>
                    <SelectItem value="gps_waypoint">Position exacte (GPS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Libellé</Label>
                <Input
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  placeholder="Ex. Bureau douane Anvers, Quai 4…"
                />
              </div>
              <div>
                <Label>Adresse / lieu</Label>
                <Input
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Pays (ISO 3166‑1 alpha‑2)</Label>
                  <Input
                    value={form.country_code}
                    onChange={(e) => setForm((f) => ({ ...f, country_code: e.target.value }))}
                    placeholder="FR, MA, BE…"
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label>Réf. douanière / MRN (optionnel)</Label>
                  <Input
                    value={form.customs_reference}
                    onChange={(e) => setForm((f) => ({ ...f, customs_reference: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Latitude (WGS‑84)</Label>
                  <Input
                    value={form.lat}
                    onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
                    placeholder="ex. 50.8503"
                  />
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input
                    value={form.lng}
                    onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
                    placeholder="ex. 4.3517"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Ou cliquer sur la carte</Label>
                <div className="mt-1 h-48 overflow-hidden rounded-lg border">
                  <MapContainer
                    center={mapPos || defaultMapCenter}
                    zoom={mapPos ? 10 : 5}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom
                  >
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    <PickMarker
                      position={mapPos}
                      onPick={(p) => {
                        setMapPos(p);
                        setForm((f) => ({ ...f, lat: String(p[0].toFixed(6)), lng: String(p[1].toFixed(6)) }));
                      }}
                    />
                  </MapContainer>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Passage prévu (début)</Label>
                  <Input
                    type="datetime-local"
                    value={form.scheduled_window_start}
                    onChange={(e) => setForm((f) => ({ ...f, scheduled_window_start: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Passage prévu (fin)</Label>
                  <Input
                    type="datetime-local"
                    value={form.scheduled_window_end}
                    onChange={(e) => setForm((f) => ({ ...f, scheduled_window_end: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label>Rayon cible (m) — géofence conseillée</Label>
                <Input
                  type="number"
                  min={50}
                  value={form.radius_meters}
                  onChange={(e) => setForm((f) => ({ ...f, radius_meters: e.target.value }))}
                />
              </div>
              <Button
                className="w-full bg-amber-700 hover:bg-amber-800"
                onClick={handleAddCheckpoint}
                disabled={createMutation.isPending}
              >
                Enregistrer le point
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <p className="text-sm text-slate-500">Chargement…</p>}
        {!isLoading && checkpoints.length === 0 && (
          <p className="text-sm text-slate-600">Aucun point défini. Ajoutez un bureau de douane ou une position GPS.</p>
        )}
        <ul className="space-y-3">
          {checkpoints.map((cp) => (
            <li
              key={cp.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 gap-3">
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      cp.checkpoint_kind === "customs_office"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-sky-100 text-sky-800"
                    }`}
                  >
                    {cp.checkpoint_kind === "customs_office" ? (
                      <Building2 className="h-4 w-4" />
                    ) : (
                      <Navigation className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{cp.label}</p>
                    {cp.address && (
                      <p className="text-sm text-slate-600">
                        <MapPin className="mr-1 inline h-3.5 w-3.5" />
                        {cp.address}
                      </p>
                    )}
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                      {cp.country_code && (
                        <span className="inline-flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {cp.country_code}
                        </span>
                      )}
                      {cp.customs_reference && <span>MRN / réf. : {cp.customs_reference}</span>}
                      {cp.lat != null && cp.lng != null && (
                        <span>
                          WGS‑84 : {Number(cp.lat).toFixed(5)}, {Number(cp.lng).toFixed(5)}
                        </span>
                      )}
                      <span>Rayon {cp.radius_meters || 500} m</span>
                    </div>
                    {cp.scheduled_window_start && (
                      <p className="mt-2 text-xs text-slate-600">
                        <Clock className="mr-1 inline h-3.5 w-3.5" />
                        Fenêtre prévue :{" "}
                        {format(new Date(cp.scheduled_window_start), "dd/MM/yyyy HH:mm", { locale: fr })}
                        {cp.scheduled_window_end
                          ? ` → ${format(new Date(cp.scheduled_window_end), "dd/MM/yyyy HH:mm", { locale: fr })}`
                          : ""}
                      </p>
                    )}
                    {cp.status === "arrived" && cp.arrived_at && (
                      <div className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
                        <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />
                        Arrivée confirmée par {cp.arrived_by_name || "—"}
                        <div className="mt-1 font-mono text-[11px] leading-relaxed">
                          UTC : {formatUtcLong(cp.arrived_at)}
                        </div>
                        <div className="font-mono text-[11px] leading-relaxed">
                          Local : {formatLocalLong(cp.arrived_at)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {cp.status !== "arrived" && (
                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={confirmMutation.isPending}
                      onClick={() => confirmMutation.mutate({ checkpoint: cp, useGps: false })}
                    >
                      Confirmer l’arrivée
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      disabled={confirmMutation.isPending}
                      onClick={() => confirmMutation.mutate({ checkpoint: cp, useGps: true })}
                    >
                      + GPS
                    </Button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
