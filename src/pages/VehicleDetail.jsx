import React, { useState } from 'react';
import { appApi } from '@/api/appApi';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  ArrowLeft, 
  Truck, 
  Gauge,
  Calendar,
  Thermometer,
  AlertTriangle,
  Settings,
  DollarSign
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createPageUrl } from "@/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import { getVehicleAssetCategory, assetCategoryLabels } from "@/utils/fleetCategories";
import VehicleMaintenancePanel from "@/components/fleet/VehicleMaintenancePanel";
import VehicleCostsPanel from "@/components/fleet/VehicleCostsPanel";
import VehicleComplianceAlerts from "@/components/fleet/VehicleComplianceAlerts";

const vehicleTypes = {
  van: { label: 'Fourgon', icon: '🚐' },
  truck_12t: { label: 'Porteur 12T', icon: '🚛' },
  truck_19t: { label: 'Porteur 19T', icon: '🚛' },
  truck_44t: { label: 'Ensemble 44T', icon: '🚚' },
  semi_trailer: { label: 'Semi-remorque', icon: '🚚' },
  refrigerated: { label: 'Frigorifique', icon: '❄️' },
  tanker: { label: 'Citerne', icon: '⛽' },
};

export default function VehicleDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const vehicleId = urlParams.get('id');

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicle', vehicleId],
    queryFn: () => appApi.entities.Vehicle.filter({ id: vehicleId }),
  });

  const vehicle = vehicles[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <Truck className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Véhicule non trouvé</h2>
        <Button onClick={() => window.location.href = createPageUrl('Vehicles')}>
          Retour aux véhicules
        </Button>
      </div>
    );
  }

  const typeConfig = vehicleTypes[vehicle.type] || vehicleTypes.truck_19t;
  const assetCat = getVehicleAssetCategory(vehicle);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => window.location.href = createPageUrl('Vehicles')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-3xl">
              {typeConfig.icon}
            </div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold font-mono text-slate-900"
              >
                {vehicle.plate_number}
              </motion.h1>
              <p className="text-slate-500">{vehicle.brand} {vehicle.model} ({vehicle.year})</p>
              <span
                className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  assetCat === "trailer" ? "bg-violet-100 text-violet-800" : "bg-sky-100 text-sky-800"
                }`}
              >
                {assetCategoryLabels[assetCat]}
              </span>
            </div>
          </div>
        </div>
        <StatusBadge status={vehicle.status} size="lg" showDot />
      </div>

      {/* Compliance alerts */}
      <VehicleComplianceAlerts vehicle={vehicle} />

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="maintenance" className="bg-white rounded-2xl border border-slate-200/60">
            <TabsList className="w-full justify-start border-b rounded-none px-4 pt-2">
              <TabsTrigger value="maintenance">
                <Settings className="w-4 h-4 mr-2" />
                Maintenance
              </TabsTrigger>
              <TabsTrigger value="costs">
                <DollarSign className="w-4 h-4 mr-2" />
                Coûts
              </TabsTrigger>
            </TabsList>
            <TabsContent value="maintenance" className="p-6">
              <VehicleMaintenancePanel 
                vehicleId={vehicle.id} 
                vehiclePlate={vehicle.plate_number}
                currentMileage={vehicle.mileage}
              />
            </TabsContent>
            <TabsContent value="costs" className="p-6">
              <VehicleCostsPanel 
                vehicleId={vehicle.id}
                vehiclePlate={vehicle.plate_number}
                currentMileage={vehicle.mileage}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column - Vehicle info */}
        <div className="space-y-6">
          {/* Basic info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Type</span>
                <span className="font-medium">{typeConfig.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Marque</span>
                <span className="font-medium">{vehicle.brand}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Modèle</span>
                <span className="font-medium">{vehicle.model}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Année</span>
                <span className="font-medium">{vehicle.year}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">PTAC</span>
                <span className="font-medium">{vehicle.max_weight?.toLocaleString()} kg</span>
              </div>
            </CardContent>
          </Card>

          {/* Technical specs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Caractéristiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Température contrôlée</span>
                <span className={`text-sm font-medium ${vehicle.temperature_controlled ? 'text-blue-600' : 'text-slate-400'}`}>
                  {vehicle.temperature_controlled ? 'Oui' : 'Non'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Certifié ADR</span>
                <span className={`text-sm font-medium ${vehicle.adr_certified ? 'text-orange-600' : 'text-slate-400'}`}>
                  {vehicle.adr_certified ? 'Oui' : 'Non'}
                </span>
              </div>
              {vehicle.fuel_consumption_avg && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Consommation moy.</span>
                  <span className="text-sm font-medium">{vehicle.fuel_consumption_avg} L/100km</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mileage & Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kilométrage & Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                  <Gauge className="w-4 h-4" />
                  Kilométrage actuel
                </div>
                <p className="text-2xl font-bold text-slate-900">{vehicle.mileage?.toLocaleString()} km</p>
              </div>
              
              {vehicle.last_maintenance_km && vehicle.maintenance_interval_km && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Prochaine maintenance</span>
                    <span className="font-medium">
                      {(vehicle.last_maintenance_km + vehicle.maintenance_interval_km).toLocaleString()} km
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ 
                        width: `${Math.min(((vehicle.mileage - vehicle.last_maintenance_km) / vehicle.maintenance_interval_km) * 100, 100)}%` 
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {Math.max(0, vehicle.last_maintenance_km + vehicle.maintenance_interval_km - vehicle.mileage).toLocaleString()} km restants
                  </p>
                </div>
              )}

              {vehicle.next_maintenance && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Date prévue</span>
                  <span className="font-medium">
                    {format(new Date(vehicle.next_maintenance), 'dd/MM/yyyy', { locale: fr })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cost summary */}
          {(vehicle.total_fuel_cost > 0 || vehicle.total_maintenance_cost > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Coûts totaux</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {vehicle.total_fuel_cost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Carburant</span>
                    <span className="font-semibold text-blue-600">
                      {vehicle.total_fuel_cost.toLocaleString()} €
                    </span>
                  </div>
                )}
                {vehicle.total_maintenance_cost > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Maintenance</span>
                    <span className="font-semibold text-orange-600">
                      {vehicle.total_maintenance_cost.toLocaleString()} €
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-900">Total</span>
                    <span className="text-lg font-bold text-slate-900">
                      {(vehicle.total_fuel_cost + vehicle.total_maintenance_cost).toLocaleString()} €
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}