import React from 'react';
import { appApi } from '@/api/appApi';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { 
  Plus,
  User,
  Truck,
  MapPin,
  FileText,
  MessageSquare,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { cn } from "@/lib/utils";

const eventIcons = {
  created: { icon: Plus, color: 'bg-blue-100 text-blue-600' },
  assigned: { icon: User, color: 'bg-indigo-100 text-indigo-600' },
  status_change: { icon: Truck, color: 'bg-amber-100 text-amber-600' },
  location_update: { icon: MapPin, color: 'bg-green-100 text-green-600' },
  document_added: { icon: FileText, color: 'bg-purple-100 text-purple-600' },
  message: { icon: MessageSquare, color: 'bg-sky-100 text-sky-600' },
  incident: { icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
  completed: { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600' },
  customs_passage: { icon: MapPin, color: 'bg-amber-100 text-amber-800' },
};

export default function OperationTimeline({ operationId }) {
  const { data: events = [] } = useQuery({
    queryKey: ['operationEvents', operationId],
    queryFn: () => appApi.entities.OperationEvent.filter({ operation_id: operationId }, '-created_date'),
  });

  const displayEvents = events;

  if (displayEvents.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 max-w-md mx-auto">
        <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="font-medium text-slate-700">Aucun événement enregistré</p>
        <p className="text-sm mt-2 text-slate-500">
          L&apos;historique se remplit automatiquement : création du dossier, changements de statut, pièces déposées ou
          validées (et par qui), messages, arrivées douane / points de contrôle, etc.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200" />

      <div className="space-y-6">
        {displayEvents.map((event, index) => {
          const { icon: Icon, color } = eventIcons[event.type] || eventIcons.status_change;
          return (
            <motion.div
              key={event.id}
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
              <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-900">{event.title}</p>
                    <p className="text-sm text-slate-600 mt-0.5">{event.description}</p>
                    <p className="text-xs text-slate-400 mt-1">{event.actor}</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {format(new Date(event.created_date), "dd/MM/yyyy HH:mm", { locale: fr })}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}