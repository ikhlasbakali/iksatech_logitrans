import React, { useMemo, useState } from 'react';
import { appApi } from '@/api/appApi';
import { dispatchWorkflowEvent } from '@/services/workflow/workflowTriggers';
import { buildDriverRouteRecommendations } from '@/services/ai/driverRouteRecommendationService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  Calendar,
  Truck,
  User,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import { INCOTERMS_2020, normalizeCountryCode } from "@/utils/international";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const defaultCenter = [46.2276, 2.2137];

/** Dossiers terminés / annulés : le chauffeur n’est plus réservé sur cette mission. */
const OPERATION_STATUS_RELEASED = new Set(['delivered', 'completed', 'cancelled']);

function collectBusyDriverIdsFromOperations(operations) {
  const ids = new Set();
  for (const op of operations || []) {
    if (OPERATION_STATUS_RELEASED.has(String(op.status || ''))) continue;
    if (op.driver_id) ids.add(String(op.driver_id));
    if (op.driver2_id) ids.add(String(op.driver2_id));
  }
  return ids;
}

function cityFromNominatimAddress(addr) {
  if (!addr || typeof addr !== "object") return "";
  return (
    addr.city ||
    addr.town ||
    addr.village ||
    addr.hamlet ||
    addr.municipality ||
    addr.suburb ||
    ""
  );
}

function LocationPicker({ position, onPick }) {
  useMapEvents({
    click(event) {
      onPick([event.latlng.lat, event.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

/** Référence dossier unique, générée uniquement au moment de l’enregistrement (aucune saisie manuelle). */
function generateOperationReference() {
  const y = new Date().getFullYear();
  const suffix =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()
      : String(Date.now()).slice(-8).toUpperCase();
  return `OP-${y}-${suffix}`;
}

export default function NewOperation() {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    client_id: '',
    client_name: '',
    type_operation: 'national',
    incoterm: '',
    priority: 'medium',
    status: 'draft',
    pickup_address: '',
    pickup_city: '',
    pickup_country: 'France',
    pickup_lat: null,
    pickup_lng: null,
    delivery_address: '',
    delivery_city: '',
    delivery_country: 'France',
    delivery_lat: null,
    delivery_lng: null,
    scheduled_pickup: '',
    scheduled_delivery: '',
    cargo_description: '',
    cargo_weight: '',
    cargo_pallets: '',
    special_instructions: '',
    temperature_controlled: false,
    adr_goods: false,
    driver_id: '',
    driver_name: '',
    driver2_id: '',
    driver2_name: '',
    vehicle_id: '',
    vehicle_plate: '',
  });
  const [pickupLookupError, setPickupLookupError] = useState('');
  const [deliveryLookupError, setDeliveryLookupError] = useState('');
  const [pickupLookupLoading, setPickupLookupLoading] = useState(false);
  const [deliveryLookupLoading, setDeliveryLookupLoading] = useState(false);
  const [customsDrafts, setCustomsDrafts] = useState([]);

  const { data: drivers = [] } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => appApi.entities.Driver.list(),
  });

  const { data: operations = [] } = useQuery({
    queryKey: ['operations'],
    queryFn: () => appApi.entities.Operation.list('-created_date', 500),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => appApi.entities.Client.list(),
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => appApi.entities.Vehicle.list(),
  });

  const clientsSorted = useMemo(
    () =>
      [...clients].sort((a, b) =>
        String(a.company_name || '').localeCompare(String(b.company_name || ''), 'fr', {
          sensitivity: 'base',
        })
      ),
    [clients]
  );

  const driverIdsBusyOnOperations = useMemo(
    () => collectBusyDriverIdsFromOperations(operations),
    [operations]
  );

  /** Chauffeurs libres pour un nouveau dossier : disponibles, pas « en mission », pas déjà sur un transport actif. */
  const driversAssignable = useMemo(() => {
    return drivers.filter((d) => {
      const id = String(d.id);
      if (String(d.status || '') === 'on_mission') return false;
      if (driverIdsBusyOnOperations.has(id)) return false;
      return String(d.status || '') === 'available';
    });
  }, [drivers, driverIdsBusyOnOperations]);

  const driverRouteRecommendations = useMemo(
    () =>
      buildDriverRouteRecommendations({
        pickup_city: formData.pickup_city,
        delivery_city: formData.delivery_city,
        drivers: driversAssignable,
        adr_goods: formData.adr_goods,
        temperature_controlled: formData.temperature_controlled,
      }),
    [
      formData.pickup_city,
      formData.delivery_city,
      formData.adr_goods,
      formData.temperature_controlled,
      driversAssignable,
    ]
  );

  const createMutation = useMutation({
    mutationFn: async ({ operation, customsCheckpoints }) => {
      const created = await appApi.entities.Operation.create(operation);
      let order = 0;
      for (const c of customsCheckpoints || []) {
        if (!String(c.label || "").trim()) continue;
        const lat = c.lat === "" ? null : parseFloat(c.lat);
        const lng = c.lng === "" ? null : parseFloat(c.lng);
        await appApi.entities.CustomsCheckpoint.create({
          operation_id: created.id,
          checkpoint_kind: c.checkpoint_kind || "customs_office",
          label: c.label.trim(),
          address: c.address?.trim() || "",
          country_code: normalizeCountryCode(c.country_code),
          customs_reference: c.customs_reference?.trim() || "",
          lat: Number.isFinite(lat) ? lat : null,
          lng: Number.isFinite(lng) ? lng : null,
          sequence_order: order,
          scheduled_window_start: c.scheduled_window_start
            ? new Date(c.scheduled_window_start).toISOString()
            : null,
          scheduled_window_end: c.scheduled_window_end
            ? new Date(c.scheduled_window_end).toISOString()
            : null,
          status: "pending",
          radius_meters: Math.max(50, parseInt(c.radius_meters, 10) || 500),
          arrived_at: null,
          arrived_by_name: null,
          arrived_lat: null,
          arrived_lng: null,
        });
        order += 1;
      }
      return created;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      queryClient.invalidateQueries({ queryKey: ['operationEvents', result.id] });
      dispatchWorkflowEvent('operation.created', {
        reference: result.reference,
        client_name: result.client_name,
        pickup_city: result.pickup_city,
        delivery_city: result.delivery_city,
      });
      toast.message("Dossier créé — pièces obligatoires", {
        description:
          "Ajoutez les 9 documents du flux (Nota → facture → CMR → fiche chargement → MRN / T1 → Salida → EUR1 → MLV) dans l’onglet Documents avant de clôturer en « livré ».",
      });
      window.location.href = createPageUrl('OperationDetail') + '?id=' + result.id;
    },
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const lookupAddress = async (query) => {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}&email=routing-demo@orionflow.invalid`;
    const response = await fetch(url, {
      headers: {
        "Accept-Language": "fr",
      },
    });
    if (!response.ok) {
      throw new Error("Recherche impossible");
    }
    const results = await response.json();
    return results?.[0] || null;
  };

  const reverseLookup = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&email=routing-demo@orionflow.invalid`;
    const response = await fetch(url, {
      headers: {
        "Accept-Language": "fr",
      },
    });
    if (!response.ok) {
      throw new Error("Recherche impossible");
    }
    const result = await response.json();
    const addr = result?.address || {};
    return {
      display_name: result?.display_name || "",
      city: cityFromNominatimAddress(addr),
      country: typeof addr.country === "string" ? addr.country : "",
    };
  };

  const handlePickupSearch = async () => {
    const queryParts = [
      formData.pickup_address,
      formData.pickup_city,
      formData.pickup_country,
    ].filter(Boolean);
    const query = queryParts.join(', ');
    if (!query) {
      setPickupLookupError("Saisissez une adresse ou ville.");
      return;
    }
    setPickupLookupError('');
    setPickupLookupLoading(true);
    try {
      const result = await lookupAddress(query);
      if (!result) {
        setPickupLookupError("Aucun résultat trouvé.");
      } else {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        const addr = result.address || {};
        setFormData(prev => ({
          ...prev,
          pickup_lat: lat,
          pickup_lng: lng,
          pickup_address: result.display_name || prev.pickup_address,
          pickup_city: cityFromNominatimAddress(addr) || prev.pickup_city,
          pickup_country: (typeof addr.country === "string" ? addr.country : "") || prev.pickup_country,
        }));
      }
    } catch (error) {
      setPickupLookupError("Recherche impossible.");
    } finally {
      setPickupLookupLoading(false);
    }
  };

  const handleDeliverySearch = async () => {
    const queryParts = [
      formData.delivery_address,
      formData.delivery_city,
      formData.delivery_country,
    ].filter(Boolean);
    const query = queryParts.join(', ');
    if (!query) {
      setDeliveryLookupError("Saisissez une adresse ou ville.");
      return;
    }
    setDeliveryLookupError('');
    setDeliveryLookupLoading(true);
    try {
      const result = await lookupAddress(query);
      if (!result) {
        setDeliveryLookupError("Aucun résultat trouvé.");
      } else {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        const addr = result.address || {};
        setFormData(prev => ({
          ...prev,
          delivery_lat: lat,
          delivery_lng: lng,
          delivery_address: result.display_name || prev.delivery_address,
          delivery_city: cityFromNominatimAddress(addr) || prev.delivery_city,
          delivery_country: (typeof addr.country === "string" ? addr.country : "") || prev.delivery_country,
        }));
      }
    } catch (error) {
      setDeliveryLookupError("Recherche impossible.");
    } finally {
      setDeliveryLookupLoading(false);
    }
  };

  const handlePickupPick = async (coords) => {
    const [lat, lng] = coords;
    setFormData(prev => ({
      ...prev,
      pickup_lat: lat,
      pickup_lng: lng,
    }));
    try {
      const parsed = await reverseLookup(lat, lng);
      setFormData(prev => ({
        ...prev,
        pickup_address: parsed.display_name || prev.pickup_address,
        pickup_city: parsed.city || prev.pickup_city,
        pickup_country: parsed.country || prev.pickup_country,
      }));
    } catch (error) {
      setPickupLookupError("Impossible de récupérer l'adresse.");
    }
  };

  const handleDeliveryPick = async (coords) => {
    const [lat, lng] = coords;
    setFormData(prev => ({
      ...prev,
      delivery_lat: lat,
      delivery_lng: lng,
    }));
    try {
      const parsed = await reverseLookup(lat, lng);
      setFormData(prev => ({
        ...prev,
        delivery_address: parsed.display_name || prev.delivery_address,
        delivery_city: parsed.city || prev.delivery_city,
        delivery_country: parsed.country || prev.delivery_country,
      }));
    } catch (error) {
      setDeliveryLookupError("Impossible de récupérer l'adresse.");
    }
  };

  const handleDriverSelect = (driverId) => {
    if (!driverId) {
      setFormData((prev) => ({ ...prev, driver_id: '', driver_name: '' }));
      return;
    }
    const driver = drivers.find((d) => d.id === driverId);
    if (driver) {
      setFormData((prev) => ({
        ...prev,
        driver_id: driverId,
        driver_name: `${driver.first_name} ${driver.last_name}`,
      }));
    }
  };

  const handleDriver2Select = (driverId) => {
    if (driverId === "none") {
      setFormData(prev => ({
        ...prev,
        driver2_id: '',
        driver2_name: '',
      }));
    } else {
      const driver = drivers.find(d => d.id === driverId);
      if (driver) {
        setFormData(prev => ({
          ...prev,
          driver2_id: driverId,
          driver2_name: `${driver.first_name} ${driver.last_name}`,
        }));
      }
    }
  };

  const handleVehicleSelect = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setFormData(prev => ({
        ...prev,
        vehicle_id: vehicleId,
        vehicle_plate: vehicle.plate_number,
      }));
    }
  };

  const handleClientSelect = (value) => {
    if (value === '__none__') {
      setFormData((prev) => ({ ...prev, client_id: '', client_name: '' }));
      return;
    }
    if (value === '__other__') {
      setFormData((prev) => ({ ...prev, client_id: '__other__', client_name: '' }));
      return;
    }
    const c = clients.find((x) => x.id === value);
    if (c) {
      setFormData((prev) => ({
        ...prev,
        client_id: c.id,
        client_name: String(c.company_name || '').trim(),
      }));
    }
  };

  const handleSubmit = () => {
    const { client_id: uiClientId, ...formRest } = formData;
    const operation = {
      ...formRest,
      ...(uiClientId && uiClientId !== '__other__' ? { client_id: uiClientId } : {}),
      reference: generateOperationReference(),
      cargo_weight: formData.cargo_weight ? parseFloat(formData.cargo_weight) : null,
      cargo_pallets: formData.cargo_pallets ? parseInt(formData.cargo_pallets) : null,
      scheduled_pickup: formData.scheduled_pickup
        ? new Date(formData.scheduled_pickup).toISOString()
        : null,
      scheduled_delivery: formData.scheduled_delivery
        ? new Date(formData.scheduled_delivery).toISOString()
        : null,
      incoterm: formData.incoterm?.trim() || null,
    };
    createMutation.mutate({ operation, customsCheckpoints: customsDrafts });
  };

  const addCustomsDraft = () => {
    setCustomsDrafts((rows) => [
      ...rows,
      {
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
      },
    ]);
  };

  const updateCustomsDraft = (index, field, value) => {
    setCustomsDrafts((rows) =>
      rows.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const removeCustomsDraft = (index) => {
    setCustomsDrafts((rows) => rows.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => window.location.href = createPageUrl('Operations')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-slate-900"
          >
            Nouvelle opération
          </motion.h1>
          <p className="text-slate-500">Créez un nouveau dossier de transport</p>
        </div>
      </div>

      {/* Progress steps */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                step >= s 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
            </div>
            {s < 3 && (
              <div className={`w-20 h-1 mx-2 rounded ${
                step > s ? 'bg-blue-600' : 'bg-slate-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic info */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="sm:col-span-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm font-medium text-slate-800">Référence dossier</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Attribuée <strong>automatiquement</strong> à la création (format{" "}
                    <span className="font-mono">OP-{new Date().getFullYear()}-…</span>) — aucune saisie requise.
                  </p>
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label>Client</Label>
                  {clientsSorted.length > 0 ? (
                    <>
                      <Select
                        value={formData.client_id || '__none__'}
                        onValueChange={handleClientSelect}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un client" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">— Choisir un client —</SelectItem>
                          {clientsSorted.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.external_code
                                ? `${c.company_name} (${c.external_code})`
                                : c.company_name}
                            </SelectItem>
                          ))}
                          <SelectItem value="__other__">Autre (saisie libre)</SelectItem>
                        </SelectContent>
                      </Select>
                      {formData.client_id === '__other__' && (
                        <div>
                          <Label className="text-xs text-slate-600">Nom du client (hors annuaire)</Label>
                          <Input
                            className="mt-1"
                            value={formData.client_name}
                            onChange={(e) => handleChange('client_name', e.target.value)}
                            placeholder="Raison sociale ou nom affiché sur le dossier"
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <Input
                      value={formData.client_name}
                      onChange={(e) => handleChange('client_name', e.target.value)}
                      placeholder="Nom du client (aucun client en annuaire — saisie libre)"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type d'opération</Label>
                  <Select value={formData.type_operation} onValueChange={(v) => handleChange('type_operation', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national">National</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                      <SelectItem value="import">Import</SelectItem>
                      <SelectItem value="export">Export</SelectItem>
                      <SelectItem value="groupage">Groupage</SelectItem>
                      <SelectItem value="lot_complet">Lot complet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priorité</Label>
                  <Select value={formData.priority} onValueChange={(v) => handleChange('priority', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Basse</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Haute</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Incoterms® 2020 (commerce international)</Label>
                <Select
                  value={formData.incoterm || "_none"}
                  onValueChange={(v) => handleChange("incoterm", v === "_none" ? "" : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Non renseigné" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">Non renseigné</SelectItem>
                    {INCOTERMS_2020.map((row) => (
                      <SelectItem key={row.code} value={row.code}>
                        {row.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-1 text-xs text-slate-500">À renseigner si le contrat commercial le prévoit (ICC).</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Adresses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pickup */}
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="font-medium text-green-800 mb-3">Enlèvement</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Adresse ou lieu</Label>
                    <Input 
                      value={formData.pickup_address}
                      onChange={(e) => handleChange('pickup_address', e.target.value)}
                      placeholder="Rue, numéro, zone industrielle…"
                    />
                    <p className="mt-1 text-xs text-slate-600">
                      Recherche ou clic carte : ville et pays sont complétés automatiquement quand c’est possible.
                    </p>
                  </div>
                  <details className="col-span-2 rounded-lg border border-green-200/80 bg-white/60 px-3 py-2">
                    <summary className="cursor-pointer text-sm font-medium text-green-900">
                      Affiner ville et pays
                    </summary>
                    <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <Label>Ville</Label>
                    <Input 
                      value={formData.pickup_city}
                      onChange={(e) => handleChange('pickup_city', e.target.value)}
                      placeholder="Ville"
                    />
                  </div>
                  <div>
                    <Label>Pays</Label>
                    <Input 
                      value={formData.pickup_country}
                      onChange={(e) => handleChange('pickup_country', e.target.value)}
                    />
                  </div>
                    </div>
                  </details>
                  <div className="col-span-2 flex items-center gap-3">
                    <Button type="button" variant="outline" onClick={handlePickupSearch} disabled={pickupLookupLoading}>
                      {pickupLookupLoading ? "Recherche..." : "Rechercher sur la carte"}
                    </Button>
                    {pickupLookupError && (
                      <span className="text-sm text-red-600">{pickupLookupError}</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    <div className="h-56 rounded-lg overflow-hidden border border-green-200">
                      <MapContainer
                        center={formData.pickup_lat && formData.pickup_lng ? [formData.pickup_lat, formData.pickup_lng] : defaultCenter}
                        zoom={formData.pickup_lat ? 11 : 6}
                        className="h-full w-full"
                      >
                        <TileLayer
                          attribution="&copy; OpenStreetMap"
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationPicker
                          position={formData.pickup_lat && formData.pickup_lng ? [formData.pickup_lat, formData.pickup_lng] : null}
                          onPick={handlePickupPick}
                        />
                      </MapContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="font-medium text-blue-800 mb-3">Livraison</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label>Adresse ou lieu</Label>
                    <Input 
                      value={formData.delivery_address}
                      onChange={(e) => handleChange('delivery_address', e.target.value)}
                      placeholder="Rue, numéro, quai…"
                    />
                    <p className="mt-1 text-xs text-slate-600">
                      Recherche ou clic carte : ville et pays complétés automatiquement quand c’est possible.
                    </p>
                  </div>
                  <details className="col-span-2 rounded-lg border border-blue-200/80 bg-white/60 px-3 py-2">
                    <summary className="cursor-pointer text-sm font-medium text-blue-900">
                      Affiner ville et pays
                    </summary>
                    <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <Label>Ville</Label>
                    <Input 
                      value={formData.delivery_city}
                      onChange={(e) => handleChange('delivery_city', e.target.value)}
                      placeholder="Ville"
                    />
                  </div>
                  <div>
                    <Label>Pays</Label>
                    <Input 
                      value={formData.delivery_country}
                      onChange={(e) => handleChange('delivery_country', e.target.value)}
                    />
                  </div>
                    </div>
                  </details>
                  <div className="col-span-2 flex items-center gap-3">
                    <Button type="button" variant="outline" onClick={handleDeliverySearch} disabled={deliveryLookupLoading}>
                      {deliveryLookupLoading ? "Recherche..." : "Rechercher sur la carte"}
                    </Button>
                    {deliveryLookupError && (
                      <span className="text-sm text-red-600">{deliveryLookupError}</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    <div className="h-56 rounded-lg overflow-hidden border border-blue-200">
                      <MapContainer
                        center={formData.delivery_lat && formData.delivery_lng ? [formData.delivery_lat, formData.delivery_lng] : defaultCenter}
                        zoom={formData.delivery_lat ? 11 : 6}
                        className="h-full w-full"
                      >
                        <TileLayer
                          attribution="&copy; OpenStreetMap"
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationPicker
                          position={formData.delivery_lat && formData.delivery_lng ? [formData.delivery_lat, formData.delivery_lng] : null}
                          onPick={handleDeliveryPick}
                        />
                      </MapContainer>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} className="bg-blue-600 hover:bg-blue-700">
              Continuer
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Cargo & Schedule */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Planning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date/heure enlèvement</Label>
                  <Input 
                    type="datetime-local"
                    value={formData.scheduled_pickup}
                    onChange={(e) => handleChange('scheduled_pickup', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Date/heure livraison</Label>
                  <Input 
                    type="datetime-local"
                    value={formData.scheduled_delivery}
                    onChange={(e) => handleChange('scheduled_delivery', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Marchandise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Description</Label>
                <Textarea 
                  value={formData.cargo_description}
                  onChange={(e) => handleChange('cargo_description', e.target.value)}
                  placeholder="Nature de la marchandise..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Poids (kg)</Label>
                  <Input 
                    type="number"
                    value={formData.cargo_weight}
                    onChange={(e) => handleChange('cargo_weight', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Nombre de palettes</Label>
                  <Input 
                    type="number"
                    value={formData.cargo_pallets}
                    onChange={(e) => handleChange('cargo_pallets', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Transport frigorifique</p>
                    <p className="text-sm text-slate-500">Température contrôlée requise</p>
                  </div>
                  <Switch 
                    checked={formData.temperature_controlled}
                    onCheckedChange={(v) => handleChange('temperature_controlled', v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Matières dangereuses (ADR)</p>
                    <p className="text-sm text-slate-500">Transport soumis à réglementation ADR</p>
                  </div>
                  <Switch 
                    checked={formData.adr_goods}
                    onCheckedChange={(v) => handleChange('adr_goods', v)}
                  />
                </div>
              </div>

              <div>
                <Label>Instructions spéciales</Label>
                <Textarea 
                  value={formData.special_instructions}
                  onChange={(e) => handleChange('special_instructions', e.target.value)}
                  placeholder="Instructions particulières pour le chauffeur..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200/80 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-5 w-5 text-amber-800" />
                Bureaux de douane & positions GPS (optionnel)
              </CardTitle>
              <p className="text-sm font-normal text-slate-600">
                Points de passage : libellé obligatoire ; coordonnées GPS seulement pour un point précis sur l’itinéraire.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {customsDrafts.map((row, index) => (
                <div key={index} className="space-y-3 rounded-xl border border-amber-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Select
                      value={row.checkpoint_kind}
                      onValueChange={(v) => updateCustomsDraft(index, "checkpoint_kind", v)}
                    >
                      <SelectTrigger className="max-w-[220px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customs_office">Bureau de douane</SelectItem>
                        <SelectItem value="gps_waypoint">Position GPS exacte</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeCustomsDraft(index)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Libellé du point *"
                    value={row.label}
                    onChange={(e) => updateCustomsDraft(index, "label", e.target.value)}
                  />
                  <Input
                    placeholder="Adresse / lieu"
                    value={row.address}
                    onChange={(e) => updateCustomsDraft(index, "address", e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Pays ISO (FR, MA…)"
                      maxLength={2}
                      value={row.country_code}
                      onChange={(e) => updateCustomsDraft(index, "country_code", e.target.value)}
                    />
                    <Input
                      placeholder="MRN / réf. douane"
                      value={row.customs_reference}
                      onChange={(e) => updateCustomsDraft(index, "customs_reference", e.target.value)}
                    />
                  </div>
                  {row.checkpoint_kind === "gps_waypoint" && (
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Latitude"
                      value={row.lat}
                      onChange={(e) => updateCustomsDraft(index, "lat", e.target.value)}
                    />
                    <Input
                      placeholder="Longitude"
                      value={row.lng}
                      onChange={(e) => updateCustomsDraft(index, "lng", e.target.value)}
                    />
                  </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Passage prévu (début)</Label>
                      <Input
                        type="datetime-local"
                        value={row.scheduled_window_start}
                        onChange={(e) => updateCustomsDraft(index, "scheduled_window_start", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Passage prévu (fin)</Label>
                      <Input
                        type="datetime-local"
                        value={row.scheduled_window_end}
                        onChange={(e) => updateCustomsDraft(index, "scheduled_window_end", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Rayon cible (m)</Label>
                    <Input
                      type="number"
                      min={50}
                      value={row.radius_meters}
                      onChange={(e) => updateCustomsDraft(index, "radius_meters", e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" className="w-full border-amber-300" onClick={addCustomsDraft}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un point douane / GPS
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <Button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700">
              Continuer
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Assignment */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Affectation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {driverRouteRecommendations.items.length > 0 && (
                <div className="rounded-xl border border-violet-200/90 bg-gradient-to-br from-violet-50/95 to-white p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">Recommandations IA — chauffeurs disponibles</p>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{driverRouteRecommendations.hint}</p>
                      <p className="text-[11px] text-violet-700/90 mt-1.5">
                        Classement heuristique (proximité enlèvement, certifications, historique). Branchez votre moteur
                        IA / API pour des suggestions temps réel.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {driverRouteRecommendations.items.slice(0, 5).map((row, idx) => (
                      <li
                        key={row.driver.id}
                        className="flex flex-col sm:flex-row sm:items-stretch sm:justify-between gap-2 rounded-lg border border-slate-200/90 bg-white/90 px-3 py-2.5"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-violet-700">#{idx + 1}</span>
                            <span className="font-medium text-slate-900">
                              {row.driver.first_name} {row.driver.last_name}
                            </span>
                            <span className="text-xs rounded-full bg-violet-100 px-2 py-0.5 text-violet-800">
                              score {row.score}/100
                            </span>
                          </div>
                          <ul className="mt-1.5 text-xs text-slate-600 list-disc pl-4 space-y-0.5">
                            {row.reasons.slice(0, 3).map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="shrink-0 self-start sm:self-center border-violet-200 bg-violet-50/80 hover:bg-violet-100 text-violet-900"
                          onClick={() => handleDriverSelect(row.driver.id)}
                        >
                          Affecter en principal
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <Label>Chauffeur principal</Label>
                <Select
                  value={formData.driver_id || '__none__'}
                  onValueChange={(v) => (v === '__none__' ? handleDriverSelect('') : handleDriverSelect(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un chauffeur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">— Non affecté pour l’instant —</SelectItem>
                    {driversAssignable.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.first_name} {driver.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1.5">
                  Sont masqués les profils <strong>en mission</strong> (statut) et les chauffeurs déjà affectés à un
                  dossier <strong>non livré / non annulé</strong>.
                </p>
                {driversAssignable.length === 0 && (
                  <p className="text-sm text-amber-600 mt-2">
                    Aucun chauffeur libre pour l’instant. Vous pourrez affecter un chauffeur plus tard depuis la fiche
                    dossier.
                  </p>
                )}
              </div>

              <div>
                <Label>2ème chauffeur (optionnel)</Label>
                <Select value={formData.driver2_id || "none"} onValueChange={handleDriver2Select}>
                  <SelectTrigger>
                    <SelectValue placeholder="Aucun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    {driversAssignable
                      .filter((d) => d.id !== formData.driver_id)
                      .map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.first_name} {driver.last_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Véhicule</Label>
                <Select value={formData.vehicle_id} onValueChange={handleVehicleSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un véhicule" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.filter(v => v.status === 'available').map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.plate_number} - {vehicle.brand} {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-slate-50 border-slate-200">
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Référence</span>
                <span className="font-mono text-right text-sm text-slate-700">
                  Générée à la validation
                  <span className="block text-xs font-normal text-slate-500 mt-0.5">
                    (ex. OP-{new Date().getFullYear()}-AB12CD34)
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Client</span>
                <span className="font-medium">{formData.client_name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trajet</span>
                <span className="font-medium">{formData.pickup_city} → {formData.delivery_city}</span>
              </div>
              {formData.driver_name && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Chauffeur{formData.driver2_name ? 's' : ''}</span>
                  <span className="font-medium">
                    {formData.driver_name}
                    {formData.driver2_name && ` + ${formData.driver2_name}`}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={createMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Création...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Créer l'opération
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}