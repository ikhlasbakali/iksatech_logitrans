import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  MessageSquare,
  MapPin,
  User,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";

const activityIcons = {
  created: { icon: Plus, color: 'bg-blue-100 text-blue-600' },
  assigned: { icon: User, color: 'bg-indigo-100 text-indigo-600' },
  status_change: { icon: Truck, color: 'bg-amber-100 text-amber-600' },
  location_update: { icon: MapPin, color: 'bg-green-100 text-green-600' },
  document_added: { icon: FileText, color: 'bg-purple-100 text-purple-600' },
  message: { icon: MessageSquare, color: 'bg-sky-100 text-sky-600' },
  incident: { icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
  completed: { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600' },
};

import { Plus } from "lucide-react";

const mockActivities = [
  {
    id: 1,
    type: 'completed',
    title: 'Livraison effectuée',
    description: 'OP-2024-0888 livré à Lyon',
    actor: 'Omar Al-Khatib',
    time: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 2,
    type: 'status_change',
    title: 'Statut mis à jour',
    description: 'OP-2024-0892 → En transit',
    actor: 'Système',
    time: new Date(Date.now() - 1000 * 60 * 12),
  },
  {
    id: 3,
    type: 'document_added',
    title: 'Document ajouté',
    description: 'CMR signé - OP-2024-0887',
    actor: 'Viktor Rostov',
    time: new Date(Date.now() - 1000 * 60 * 25),
  },
  {
    id: 4,
    type: 'incident',
    title: 'Incident signalé',
    description: 'Retard trafic - OP-2024-0890',
    actor: 'Aisha Okonkwo',
    time: new Date(Date.now() - 1000 * 60 * 35),
  },
  {
    id: 5,
    type: 'assigned',
    title: 'Chauffeur assigné',
    description: 'H. Varga → OP-2024-0893',
    actor: 'Dispatch — Terminal 4',
    time: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: 6,
    type: 'created',
    title: 'Nouvelle opération',
    description: 'OP-2024-0894 créé',
    actor: 'Client API',
    time: new Date(Date.now() - 1000 * 60 * 55),
  },
];

export default function ActivityFeed({ limit = 6, className }) {
  const activities = mockActivities.slice(0, limit);
  
  return (
    <div className={cn("bg-white rounded-2xl border border-slate-200/60 overflow-hidden", className)}>
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900">Activité récente</h3>
      </div>
      
      <div className="p-4">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100" />
          
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const { icon: Icon, color } = activityIcons[activity.type] || activityIcons.status_change;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative flex gap-4 pl-2"
                >
                  <div className={cn(
                    "relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    color
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm text-slate-900">{activity.title}</p>
                      <span className="text-xs text-slate-400">
                        {format(activity.time, 'HH:mm', { locale: fr })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 truncate">{activity.description}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.actor}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}