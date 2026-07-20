import React, { useState } from 'react';
import { appApi } from '@/api/appApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Truck, 
  Plus, 
  Search,
  Thermometer,
  AlertTriangle,
  Settings,
  MapPin,
  Calendar,
  Gauge,
  MoreVertical,
  Eye,
  Boxes,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusBadge from "@/components/ui/StatusBadge";
import { createPageUrl } from "@/utils";
import {
  fleetStatsByCategory,
  getVehicleAssetCategory,
  assetCategoryLabels,
  ASSET_TRACTOR,
  ASSET_TRAILER,
} from "@/utils/fleetCategories";

const vehicleTypes = {
  van: { label: 'Fourgon', icon: '🚐' },
  truck_12t: { label: 'Porteur 12T', icon: '🚛' },
  truck_19t: { label: 'Porteur 19T', icon: '🚛' },
  truck_44t: { label: 'Ensemble 44T', icon: '🚚' },
  semi_trailer: { label: 'Semi-remorque', icon: '🚚' },
  refrigerated: { label: 'Frigorifique', icon: '❄️' },
  tanker: { label: 'Citerne', icon: '⛽' },
};

// Mock vehicles
const mockVehicles = [
  { 
    id: 1, 
    plate_number: 'AB-123-CD', 
    asset_category: 'tractor',
    type: 'truck_19t',
    brand: 'Renault',
    model: 'T High',
    year: 2022,
    status: 'in_use',
    max_weight: 19000,
    temperature_controlled: false,
    adr_certified: true,
    current_driver: 'Viktor Rostov',
    mileage: 125000,
    next_maintenance: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
  },
  { 
    id: 2, 
    plate_number: 'EF-456-GH', 
    asset_category: 'tractor',
    type: 'refrigerated',
    brand: 'DAF',
    model: 'XF',
    year: 2021,
    status: 'in_use',
    max_weight: 26000,
    temperature_controlled: true,
    adr_certified: false,
    current_driver: 'Aisha Okonkwo',
    mileage: 189000,
    next_maintenance: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
  },
  { 
    id: 3, 
    plate_number: 'IJ-789-KL', 
    asset_category: 'tractor',
    type: 'truck_44t',
    brand: 'Volvo',
    model: 'FH16',
    year: 2023,
    status: 'in_use',
    max_weight: 44000,
    temperature_controlled: false,
    adr_certified: true,
    current_driver: 'Omar Al-Khatib',
    mileage: 78000,
    next_maintenance: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  },
  { 
    id: 4, 
    plate_number: 'MN-012-OP', 
    asset_category: 'tractor',
    type: 'refrigerated',
    brand: 'Mercedes',
    model: 'Actros',
    year: 2022,
    status: 'in_use',
    max_weight: 19000,
    temperature_controlled: true,
    adr_certified: false,
    current_driver: 'Helena Varga',
    mileage: 145000,
    next_maintenance: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
  },
  { 
    id: 5, 
    plate_number: 'QR-345-ST', 
    asset_category: 'tractor',
    type: 'truck_19t',
    brand: 'Scania',
    model: 'R500',
    year: 2021,
    status: 'available',
    max_weight: 19000,
    temperature_controlled: false,
    adr_certified: true,
    current_driver: null,
    mileage: 210000,
    next_maintenance: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
  },
  { 
    id: 6, 
    plate_number: 'UV-678-WX', 
    asset_category: 'tractor',
    type: 'van',
    brand: 'Iveco',
    model: 'Daily',
    year: 2020,
    status: 'maintenance',
    max_weight: 3500,
    temperature_controlled: false,
    adr_certified: false,
    current_driver: null,
    mileage: 89000,
    next_maintenance: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: 7,
    plate_number: "RM-DEMO-01",
    asset_category: "trailer",
    type: "semi_trailer",
    brand: "Krone",
    model: "SD",
    year: 2023,
    status: "available",
    max_weight: 24000,
    temperature_controlled: false,
    adr_certified: false,
    current_driver: null,
    mileage: 0,
    next_maintenance: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
  },
];

export default function Vehicles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    plate_number: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'truck_19t',
    asset_category: ASSET_TRACTOR,
    status: 'available',
    mileage: 0,
    temperature_controlled: false,
    adr_certified: false,
    next_maintenance: '',
  });

  const queryClient = useQueryClient();

  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => appApi.entities.Vehicle.list(),
  });

  const createMutation = useMutation({
    mutationFn: (payload) => appApi.entities.Vehicle.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      setDialogOpen(false);
      setFormData({
        plate_number: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        type: 'truck_19t',
        asset_category: ASSET_TRACTOR,
        status: 'available',
        mileage: 0,
        temperature_controlled: false,
        adr_certified: false,
        next_maintenance: '',
      });
    },
  });

  const displayVehicles = vehicles.length > 0 ? vehicles : mockVehicles;

  const filteredVehicles = displayVehicles.filter(vehicle => {
    const matchesSearch = !searchTerm || 
      vehicle.plate_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const cat = getVehicleAssetCategory(vehicle);
    const matchesCategory =
      categoryFilter === 'all' ||
      (categoryFilter === 'tractor' && cat === ASSET_TRACTOR) ||
      (categoryFilter === 'trailer' && cat === ASSET_TRAILER);
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const splitStats = fleetStatsByCategory(displayVehicles);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl lg:text-3xl font-bold text-slate-900"
          >
            Véhicules
          </motion.h1>
          <p className="text-slate-500 mt-1">
            Gérez votre flotte de véhicules
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau véhicule
        </Button>
      </div>

      {/* Stats — tracteurs et remorques séparés */}
      <div className="space-y-6">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Tracteurs</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-blue-100">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{splitStats.tractors.total}</p>
                  <p className="text-sm text-slate-500">Total tracteurs</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-emerald-100">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-xl">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{splitStats.tractors.available}</p>
                  <p className="text-sm text-slate-500">Disponibles</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-amber-100">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-xl">
                  <Truck className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{splitStats.tractors.active}</p>
                  <p className="text-sm text-slate-500">En service / transit</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-orange-100">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-orange-50 rounded-xl">
                  <Settings className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{splitStats.tractors.maintenance}</p>
                  <p className="text-sm text-slate-500">Maintenance</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Remorques</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-violet-100">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-violet-50 rounded-xl">
                  <Boxes className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{splitStats.trailers.total}</p>
                  <p className="text-sm text-slate-500">Total remorques</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-emerald-100">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <Boxes className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{splitStats.trailers.available}</p>
                  <p className="text-sm text-slate-500">Disponibles</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-amber-100">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-amber-50 rounded-xl">
                  <Boxes className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{splitStats.trailers.active}</p>
                  <p className="text-sm text-slate-500">En service / transit</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-orange-100">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-orange-50 rounded-xl">
                  <Settings className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{splitStats.trailers.maintenance}</p>
                  <p className="text-sm text-slate-500">Maintenance</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher par immatriculation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="all">Tous statuts</TabsTrigger>
              <TabsTrigger value="available">Disponibles</TabsTrigger>
              <TabsTrigger value="in_use">En service</TabsTrigger>
              <TabsTrigger value="in_transit">En transit</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
          <TabsList>
            <TabsTrigger value="all">Tout le parc</TabsTrigger>
            <TabsTrigger value="tractor">Tracteurs uniquement</TabsTrigger>
            <TabsTrigger value="trailer">Remorques uniquement</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Vehicles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map((vehicle, index) => {
          const typeConfig = vehicleTypes[vehicle.type] || vehicleTypes.truck_19t;
          const assetCat = getVehicleAssetCategory(vehicle);
          const maintenanceSoon = vehicle.next_maintenance && new Date(vehicle.next_maintenance) < new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
          
          return (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className={`hover:shadow-md transition-shadow cursor-pointer ${maintenanceSoon ? 'border-orange-200' : ''}`}
                onClick={() => window.location.href = createPageUrl('VehicleDetail') + '?id=' + vehicle.id}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">
                        {typeConfig.icon}
                      </div>
                      <div>
                        <h3 className="font-mono font-bold text-slate-900 text-lg">{vehicle.plate_number}</h3>
                        <p className="text-sm text-slate-500">{vehicle.brand} {vehicle.model}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.location.href = createPageUrl('VehicleDetail') + '?id=' + vehicle.id}>
                          <Eye className="w-4 h-4 mr-2" />
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const lat = vehicle.current_lat;
                            const lng = vehicle.current_lng;
                            if (
                              typeof lat === 'number' &&
                              typeof lng === 'number' &&
                              !Number.isNaN(lat) &&
                              !Number.isNaN(lng)
                            ) {
                              window.open(
                                `https://www.google.com/maps?q=${lat},${lng}`,
                                '_blank',
                                'noopener,noreferrer'
                              );
                              return;
                            }
                            const q = String(vehicle.plate_number || vehicle.id || '').trim();
                            if (!q) {
                              toast.info('Aucune position ni immatriculation pour ouvrir la carte.');
                              return;
                            }
                            window.open(
                              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`,
                              '_blank',
                              'noopener,noreferrer'
                            );
                          }}
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          Localiser
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.location.href = createPageUrl('VehicleDetail') + '?id=' + vehicle.id}>
                          <Settings className="w-4 h-4 mr-2" />
                          Maintenance
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <StatusBadge status={vehicle.status} size="sm" showDot />
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        assetCat === ASSET_TRAILER
                          ? "bg-violet-100 text-violet-800"
                          : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {assetCategoryLabels[assetCat]}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                      {typeConfig.label}
                    </span>
                    {vehicle.temperature_controlled && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full flex items-center gap-1">
                        <Thermometer className="w-3 h-3" />
                        Frigo
                      </span>
                    )}
                    {vehicle.adr_certified && (
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        ADR
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Gauge className="w-4 h-4" />
                        Kilométrage
                      </span>
                      <span className="font-medium">{vehicle.mileage?.toLocaleString()} km</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Prochaine maintenance
                      </span>
                      <span className={`font-medium ${maintenanceSoon ? 'text-orange-600' : ''}`}>
                        {vehicle.next_maintenance 
                          ? format(new Date(vehicle.next_maintenance), 'dd/MM/yyyy', { locale: fr })
                          : '-'
                        }
                      </span>
                    </div>
                  </div>

                  {maintenanceSoon && (
                    <div className="p-2 bg-orange-50 rounded-lg flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <p className="text-xs text-orange-700">Maintenance à planifier</p>
                    </div>
                  )}

                  {vehicle.current_driver && (
                    <div className="pt-4 border-t flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-medium">
                          {vehicle.current_driver.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{vehicle.current_driver}</p>
                        <p className="text-xs text-slate-500">Chauffeur assigné</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter un véhicule</DialogTitle>
            <DialogDescription>
              Renseignez les informations principales pour créer un nouveau véhicule.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Immatriculation</Label>
                <Input
                  value={formData.plate_number}
                  onChange={(e) => setFormData((prev) => ({ ...prev, plate_number: e.target.value }))}
                  placeholder="AB-123-CD"
                />
              </div>
              <div className="space-y-2">
                <Label>Année</Label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData((prev) => ({ ...prev, year: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Marque</Label>
                <Input
                  value={formData.brand}
                  onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
                  placeholder="Renault"
                />
              </div>
              <div className="space-y-2">
                <Label>Modèle</Label>
                <Input
                  value={formData.model}
                  onChange={(e) => setFormData((prev) => ({ ...prev, model: e.target.value }))}
                  placeholder="T High"
                />
              </div>
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select
                  value={formData.asset_category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      asset_category: value,
                      type:
                        value === ASSET_TRAILER
                          ? "semi_trailer"
                          : prev.type === "semi_trailer"
                            ? "truck_19t"
                            : prev.type,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ASSET_TRACTOR}>Tracteur (véhicule moteur)</SelectItem>
                    <SelectItem value={ASSET_TRAILER}>Remorque / semi-remorque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(vehicleTypes)
                      .filter(([key]) =>
                        formData.asset_category === ASSET_TRAILER
                          ? key === "semi_trailer"
                          : key !== "semi_trailer"
                      )
                      .map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="in_use">En service</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Kilométrage</Label>
                <Input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, mileage: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Prochaine maintenance</Label>
                <Input
                  type="date"
                  value={formData.next_maintenance}
                  onChange={(e) => setFormData((prev) => ({ ...prev, next_maintenance: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={formData.temperature_controlled}
                  onChange={(e) => setFormData((prev) => ({ ...prev, temperature_controlled: e.target.checked }))}
                />
                Frigorifique
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={formData.adr_certified}
                  onChange={(e) => setFormData((prev) => ({ ...prev, adr_certified: e.target.checked }))}
                />
                ADR
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  createMutation.mutate({
                    plate_number: formData.plate_number,
                    brand: formData.brand,
                    model: formData.model,
                    year: Number(formData.year),
                    type: formData.type,
                    asset_category: formData.asset_category,
                    status: formData.status,
                    mileage: Number(formData.mileage) || 0,
                    temperature_controlled: formData.temperature_controlled,
                    adr_certified: formData.adr_certified,
                    next_maintenance: formData.next_maintenance
                      ? new Date(formData.next_maintenance).toISOString()
                      : null,
                  });
                }}
              >
                Ajouter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}