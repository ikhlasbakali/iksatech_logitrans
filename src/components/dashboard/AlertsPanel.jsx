import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Clock, 
  FileX, 
  AlertCircle,
  ChevronRight,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const alertIcons = {
  delay: Clock,
  document: FileX,
  incident: AlertTriangle,
  system: AlertCircle,
};

const alertColors = {
  delay: 'bg-amber-50 border-amber-200 text-amber-700',
  document: 'bg-blue-50 border-blue-200 text-blue-700',
  incident: 'bg-red-50 border-red-200 text-red-700',
  system: 'bg-slate-50 border-slate-200 text-slate-700',
};

const mockAlerts = [
  {
    id: 1,
    type: 'delay',
    title: 'Retard détecté',
    message: 'OP-2024-0892 - Retard estimé de 45 min',
    time: '5 min',
    operationId: 'op1'
  },
  {
    id: 2,
    type: 'document',
    title: 'Document manquant',
    message: 'OP-2024-0891 - CMR non uploadé',
    time: '15 min',
    operationId: 'op2'
  },
  {
    id: 3,
    type: 'incident',
    title: 'Incident signalé',
    message: 'OP-2024-0890 - Problème mécanique',
    time: '32 min',
    operationId: 'op3'
  },
  {
    id: 4,
    type: 'delay',
    title: 'ETA mis à jour',
    message: 'OP-2024-0889 - Nouvelle heure: 16h30',
    time: '1h',
    operationId: 'op4'
  },
];

export default function AlertsPanel({ limit = 5, className }) {
  const alerts = mockAlerts.slice(0, limit);
  
  if (alerts.length === 0) {
    return (
      <div className={cn("bg-white rounded-2xl border border-slate-200/60 p-6", className)}>
        <div className="text-center py-8 text-slate-500">
          <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucune alerte active</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("bg-white rounded-2xl border border-slate-200/60 overflow-hidden", className)}>
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-100 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <h3 className="font-semibold text-slate-900">Alertes actives</h3>
          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            {alerts.length}
          </span>
        </div>
        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
          Tout voir
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
      
      <div className="divide-y divide-slate-100">
        <AnimatePresence>
          {alerts.map((alert, index) => {
            const Icon = alertIcons[alert.type];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-4 hover:bg-slate-50/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'p-2 rounded-lg border',
                    alertColors[alert.type]
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-slate-900 text-sm">{alert.title}</p>
                      <span className="text-xs text-slate-400">il y a {alert.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 truncate">{alert.message}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors mt-1" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}