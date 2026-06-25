import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  MessageSquare,
  AlertTriangle,
  Search,
  BarChart3,
  Smartphone,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

const fleetMissionRoles = ['admin', 'manager', 'exploitation_manager', 'agent', 'support'];

function userCanFleetTable(userRole) {
  const r = String(userRole || '').trim().toLowerCase();
  return fleetMissionRoles.includes(r);
}

const fleetTableAction = {
  icon: ClipboardList,
  label: 'Tableau logistique',
  color: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  page: 'FleetDashboard',
};

const baseDefaultActions = [
  {
    icon: Plus,
    label: 'Nouvelle opération',
    color: 'bg-blue-600 hover:bg-blue-700 text-white',
    page: 'NewOperation',
  },
  {
    icon: Search,
    label: 'Rechercher',
    color: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
    page: 'Operations',
  },
  {
    icon: AlertTriangle,
    label: 'Déclarer incident',
    color: 'bg-red-50 hover:bg-red-100 text-red-700',
    page: 'Incidents',
  },
  {
    icon: BarChart3,
    label: 'Rapports',
    color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700',
    page: 'Reports',
  },
];

const driverActions = [
  {
    icon: Smartphone,
    label: 'App Chauffeur',
    color: 'bg-blue-600 hover:bg-blue-700 text-white',
    page: 'DriverApp',
  },
  {
    icon: MessageSquare,
    label: 'Messages',
    color: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800',
    page: 'Messages',
  },
];

export default function QuickActions({ className, userRole }) {
  const isDriver = String(userRole || '').toLowerCase() === 'driver';
  const actions = isDriver
    ? driverActions
    : [
        ...(userCanFleetTable(userRole) ? [fleetTableAction] : []),
        ...baseDefaultActions,
      ];

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {actions.map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <Button 
            className={`${action.color} shadow-sm`}
            onClick={() => window.location.href = createPageUrl(action.page)}
          >
            <action.icon className="w-4 h-4 mr-2" />
            {action.label}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}