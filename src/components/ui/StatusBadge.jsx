import React from 'react';
import { cn } from "@/lib/utils";

const statusConfig = {
  // Operation statuses
  draft: { label: 'Brouillon', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  confirmed: { label: 'Confirmé', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  assigned: { label: 'Affecté', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  in_transit: { label: 'En transit', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  loading: { label: 'Chargement', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  unloading: { label: 'Déchargement', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  delivered: { label: 'Livré', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'Clôturé', color: 'bg-green-50 text-green-700 border-green-200' },
  cancelled: { label: 'Annulé', color: 'bg-red-50 text-red-700 border-red-200' },
  incident: { label: 'Incident', color: 'bg-red-100 text-red-800 border-red-300' },
  
  // Driver statuses
  available: { label: 'Disponible', color: 'bg-green-50 text-green-700 border-green-200' },
  on_mission: { label: 'En mission', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  off_duty: { label: 'Repos', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  on_break: { label: 'Pause', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  inactive: { label: 'Inactif', color: 'bg-gray-100 text-gray-500 border-gray-200' },
  
  // Vehicle statuses
  in_use: { label: 'En service', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  maintenance: { label: 'Maintenance', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  out_of_service: { label: 'Hors service', color: 'bg-red-50 text-red-700 border-red-200' },
  
  // Incident statuses
  open: { label: 'Ouvert', color: 'bg-red-50 text-red-700 border-red-200' },
  in_progress: { label: 'En cours', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  resolved: { label: 'Résolu', color: 'bg-green-50 text-green-700 border-green-200' },
  closed: { label: 'Fermé', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  
  // Document statuses
  pending: { label: 'En attente', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  validated: { label: 'Validé', color: 'bg-green-50 text-green-700 border-green-200' },
  rejected: { label: 'Rejeté', color: 'bg-red-50 text-red-700 border-red-200' },
  
  // Priority
  low: { label: 'Basse', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  medium: { label: 'Moyenne', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  high: { label: 'Haute', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  urgent: { label: 'Urgente', color: 'bg-red-100 text-red-800 border-red-300' },
  critical: { label: 'Critique', color: 'bg-red-100 text-red-800 border-red-300' },
};

export default function StatusBadge({ status, size = 'default', showDot = false, className }) {
  const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };
  
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-medium rounded-full border',
      config.color,
      sizeClasses[size],
      className
    )}>
      {showDot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full',
          status === 'in_transit' || status === 'on_mission' ? 'bg-amber-500 animate-pulse' : 'bg-current opacity-60'
        )} />
      )}
      {config.label}
    </span>
  );
}