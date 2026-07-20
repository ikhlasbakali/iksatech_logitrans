import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Truck, MapPin, Maximize2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const truckIcon = new L.DivIcon({
  className: 'custom-truck-icon',
  html: `<div style="background: #3b82f6; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(59,130,246,0.4); border: 3px solid white;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 17h4V5H2v12h3m15-5h2l3 3v5h-2"></path>
      <circle cx="7.5" cy="17.5" r="2.5"></circle>
      <circle cx="17.5" cy="17.5" r="2.5"></circle>
    </svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const mockVehiclePositions = [
  { id: 1, lat: 48.8566, lng: 2.3522, driver: 'Viktor Rostov', status: 'in_transit', reference: 'OP-2024-0892' },
  { id: 2, lat: 48.7904, lng: 2.4556, driver: 'Aisha Okonkwo', status: 'loading', reference: 'OP-2024-0891' },
  { id: 3, lat: 49.0033, lng: 2.5144, driver: 'Omar Al-Khatib', status: 'in_transit', reference: 'OP-2024-0890' },
  { id: 4, lat: 48.6844, lng: 2.3847, driver: 'Helena Varga', status: 'in_transit', reference: 'OP-2024-0889' },
];

export default function MiniMap({ className }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border border-slate-200/60 overflow-hidden ${className}`}
    >
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <MapPin className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="font-semibold text-slate-900">Véhicules en temps réel</h3>
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            {mockVehiclePositions.length} actifs
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.location.href = createPageUrl('LiveMap')}
        >
          <Maximize2 className="w-4 h-4 mr-1" />
          Agrandir
        </Button>
      </div>
      
      <div className="h-[300px] relative">
        <MapContainer
          center={[48.8566, 2.3522]}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {mockVehiclePositions.map((vehicle) => (
            <Marker
              key={vehicle.id}
              position={[vehicle.lat, vehicle.lng]}
              icon={truckIcon}
            >
              <Popup>
                <div className="p-1">
                  <p className="font-semibold text-slate-900">{vehicle.reference}</p>
                  <p className="text-sm text-slate-600">{vehicle.driver}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </motion.div>
  );
}