import React, { useState } from 'react';
import { appApi } from '@/api/appApi';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  SlidersHorizontal,
  Package,
  ArrowUpDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createPageUrl } from "@/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadCsv, downloadPdf } from "@/utils/export";
import { APP_NAME } from "@/config/branding";

import OperationsTable from "@/components/dashboard/OperationsTable";
import StatusBadge from "@/components/ui/StatusBadge";

const statusFilters = [
  { value: 'all', label: 'Toutes' },
  { value: 'in_transit', label: 'En transit' },
  { value: 'loading', label: 'Chargement' },
  { value: 'delivered', label: 'Livrées' },
  { value: 'incident', label: 'Incidents' },
];

export default function Operations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const { data: operations = [], isLoading } = useQuery({
    queryKey: ['operations'],
    queryFn: () => appApi.entities.Operation.list('-created_date', 100),
  });

  // Filter operations
  const filteredOperations = operations.filter(op => {
    const matchesSearch = !searchTerm || 
      op.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.driver_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || op.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || op.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Stats
  const stats = {
    total: operations.length,
    inTransit: operations.filter(op => op.status === 'in_transit').length,
    delivered: operations.filter(op => op.status === 'delivered').length,
    incidents: operations.filter(op => op.status === 'incident').length,
  };

  const handleExportCsv = () => {
    const rows = filteredOperations.map((op) => ({
      reference: op.reference,
      client: op.client_name,
      statut: op.status,
      priorite: op.priority,
      chauffeur: op.driver_name,
      vehicule: op.vehicle_plate,
      retard_min: op.delay_minutes ?? "",
    }));
    downloadCsv("operations-logitrans.csv", rows, [
      "reference",
      "client",
      "statut",
      "priorite",
      "chauffeur",
      "vehicule",
      "retard_min",
    ]);
  };

  const handleExportPdf = () => {
    downloadPdf({
      title: `Export opérations ${APP_NAME}`,
      sections: [
        {
          title: "Opérations",
          columns: [
            "Référence",
            "Client",
            "Statut",
            "Priorité",
            "Chauffeur",
            "Véhicule",
            "Retard (min)",
          ],
          rows: filteredOperations.map((op) => ({
            "Référence": op.reference,
            Client: op.client_name,
            Statut: op.status,
            Priorité: op.priority,
            Chauffeur: op.driver_name,
            "Véhicule": op.vehicle_plate,
            "Retard (min)": op.delay_minutes ?? "",
          })),
        },
      ],
    });
  };

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
            Opérations
          </motion.h1>
          <p className="text-slate-500 mt-1">
            Gérez et suivez toutes vos opérations de transport
          </p>
        </div>
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportCsv}>
                Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPdf}>
                Export PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => window.location.href = createPageUrl('NewOperation')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle opération
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200/60 p-4 flex items-center gap-4"
        >
          <div className="p-3 bg-blue-50 rounded-xl">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-sm text-slate-500">Total</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-xl border border-slate-200/60 p-4 flex items-center gap-4"
        >
          <div className="p-3 bg-amber-50 rounded-xl">
            <ArrowUpDown className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.inTransit}</p>
            <p className="text-sm text-slate-500">En transit</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200/60 p-4 flex items-center gap-4"
        >
          <div className="p-3 bg-green-50 rounded-xl">
            <Package className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.delivered}</p>
            <p className="text-sm text-slate-500">Livrées</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl border border-slate-200/60 p-4 flex items-center gap-4"
        >
          <div className="p-3 bg-red-50 rounded-xl">
            <Package className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.incidents}</p>
            <p className="text-sm text-slate-500">Incidents</p>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher par référence, client, chauffeur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status filter tabs */}
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList>
              {statusFilters.map((filter) => (
                <TabsTrigger key={filter.value} value={filter.value}>
                  {filter.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Priority filter */}
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes priorités</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Operations table */}
      <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            Chargement des opérations...
          </div>
        ) : (
          <OperationsTable operations={filteredOperations} />
        )}
      </div>
    </div>
  );
}