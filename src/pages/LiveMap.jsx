import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { buildLiveFleetView } from '@/services/tracking/trackingService';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Truck, 
  MapPin, 
  Clock, 
  AlertTriangle,
  Phone,
  MessageSquare,
  Navigation,
  Layers,
  ChevronRight,
  X,
  RefreshCw
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPageUrl } from "@/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createTruckIcon = (status, delayed) => new L.DivIcon({
  className: 'custom-truck-icon',
  html: `<div style="background: ${delayed ? '#ef4444' : status === 'in_transit' ? '#3b82f6' : status === 'loading' ? '#f59e0b' : '#10b981'}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 3px solid white;">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 17h4V5H2v12h3m15-5h2l3 3v5h-2"></path>
      <circle cx="7.5" cy="17.5" r="2.5"></circle>
      <circle cx="17.5" cy="17.5" r="2.5"></circle>
    </svg>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

export default function LiveMap() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState(null);
  const [mapLayer, setMapLayer] = useState('street');

  const { data: vehicles = [] } = useQuery({
    queryKey: ['liveFleet'],
    queryFn: buildLiveFleetView,
    refetchInterval: 5000,
  });

  const selectedVehicle = vehicles.find((v) => v.id === selectedId) || null;

  const activeVehicles = vehicles.filter((v) =>
    ['in_transit', 'loading', 'unloading', 'incident'].includes(v.status)
  );
  const delayedVehicles = vehicles.filter((v) => v.delayed);

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Map */}
      <div className="flex-1 relative rounded-2xl overflow-hidden border border-slate-200/60">
        <MapContainer
          center={[48.5, 2.5]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url={mapLayer === 'street' 
              ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            }
          />
          {vehicles.map((vehicle) => (
            <React.Fragment key={vehicle.id}>
              <Marker
                position={[vehicle.lat, vehicle.lng]}
                icon={createTruckIcon(vehicle.status, vehicle.delayed)}
                eventHandlers={{
                  click: () => setSelectedId(vehicle.id),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-48">
                    <p className="font-semibold text-slate-900">{vehicle.reference}</p>
                    <p className="text-sm text-slate-600">{vehicle.driver}</p>
                    <p className="text-sm text-slate-500 mt-1">→ {vehicle.destination}</p>
                  </div>
                </Popup>
              </Marker>
              {vehicle.route && selectedId === vehicle.id && (
                <Polyline
                  positions={vehicle.route}
                  color="#3b82f6"
                  weight={4}
                  opacity={0.7}
                  dashArray="10, 10"
                />
              )}
            </React.Fragment>
          ))}
        </MapContainer>

        {/* Map controls */}
        <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
          <Button 
            variant="secondary" 
            size="sm"
            className="bg-white shadow-md"
            onClick={() => setMapLayer(mapLayer === 'street' ? 'dark' : 'street')}
          >
            <Layers className="w-4 h-4 mr-2" />
            {mapLayer === 'street' ? 'Mode sombre' : 'Mode clair'}
          </Button>
        </div>

        {/* Stats overlay */}
        <div className="absolute top-4 right-4 z-[1000] flex gap-2">
          <div className="bg-white rounded-xl shadow-md px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="font-semibold text-slate-900">{activeVehicles.length}</span>
            <span className="text-sm text-slate-500">actifs</span>
          </div>
          {delayedVehicles.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl shadow-md px-4 py-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="font-semibold text-red-700">{delayedVehicles.length}</span>
              <span className="text-sm text-red-600">en retard</span>
            </div>
          )}
        </div>

        {/* Refresh button */}
        <div className="absolute bottom-4 right-4 z-[1000]">
          <Button
            variant="secondary"
            className="bg-white shadow-md"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['liveFleet'] })}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-96 flex flex-col gap-4">
        {/* Vehicle list */}
        <Card className="flex-1 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Truck className="w-5 h-5 text-blue-600" />
              Véhicules en circulation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto max-h-[400px]">
            <div className="divide-y divide-slate-100">
              {vehicles.map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  whileHover={{ backgroundColor: 'rgba(248, 250, 252, 1)' }}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedId === vehicle.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedId(vehicle.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-slate-900">{vehicle.reference}</span>
                        {vehicle.delayed && (
                          <Badge variant="destructive" className="text-xs">
                            Retard
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{vehicle.driver}</p>
                    </div>
                    <StatusBadge status={vehicle.status} size="sm" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{vehicle.destination}</span>
                    {vehicle.eta && (
                      <>
                        <span className="text-slate-300">•</span>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{format(vehicle.eta, 'HH:mm')}</span>
                      </>
                    )}
                  </div>
                  {vehicle.speed > 0 && (
                    <p className="text-xs text-slate-400 mt-1">{vehicle.speed} km/h</p>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected vehicle detail */}
        <AnimatePresence>
          {selectedVehicle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Card className={selectedVehicle.delayed ? 'border-red-200 bg-red-50/50' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{selectedVehicle.reference}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setSelectedId(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Truck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{selectedVehicle.driver}</p>
                      <p className="text-sm text-slate-500">{selectedVehicle.vehicle}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Client</span>
                      <span className="font-medium">{selectedVehicle.client}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Destination</span>
                      <span className="font-medium">{selectedVehicle.destination}</span>
                    </div>
                    {selectedVehicle.eta && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">ETA</span>
                        <span className={`font-medium ${selectedVehicle.delayed ? 'text-red-600' : ''}`}>
                          {format(selectedVehicle.eta, 'HH:mm')}
                          {selectedVehicle.delayed && ` (+${selectedVehicle.delay_minutes}min)`}
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedVehicle.delayed && (
                    <div className="p-3 bg-red-100 rounded-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <p className="text-sm text-red-700 font-medium">
                        Retard de {selectedVehicle.delay_minutes} minutes
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Appeler
                    </Button>
                    <Button variant="outline" className="flex-1" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                  
                  <Button 
                    className="w-full"
                    disabled={!selectedVehicle.operation_id}
                    onClick={() =>
                      selectedVehicle.operation_id &&
                      (window.location.href =
                        createPageUrl('OperationDetail') + '?id=' + selectedVehicle.operation_id)
                    }
                  >
                    Voir le dossier
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}