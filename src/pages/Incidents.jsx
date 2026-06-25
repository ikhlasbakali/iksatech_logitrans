import React, { useState } from 'react';
import { appApi } from '@/api/appApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  AlertTriangle, 
  Plus, 
  Search,
  Clock,
  User,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusBadge from "@/components/ui/StatusBadge";
import { createPageUrl } from "@/utils";

const incidentTypes = {
  delay: { label: 'Retard', color: 'bg-amber-100 text-amber-700' },
  damage: { label: 'Avarie', color: 'bg-red-100 text-red-700' },
  accident: { label: 'Accident', color: 'bg-red-100 text-red-700' },
  breakdown: { label: 'Panne', color: 'bg-orange-100 text-orange-700' },
  missing_docs: { label: 'Documents manquants', color: 'bg-blue-100 text-blue-700' },
  customer_complaint: { label: 'Réclamation client', color: 'bg-purple-100 text-purple-700' },
  other: { label: 'Autre', color: 'bg-slate-100 text-slate-700' },
};

const severityConfig = {
  low: { label: 'Faible', color: 'text-green-600 bg-green-50' },
  medium: { label: 'Moyen', color: 'text-amber-600 bg-amber-50' },
  high: { label: 'Élevé', color: 'text-orange-600 bg-orange-50' },
  critical: { label: 'Critique', color: 'text-red-600 bg-red-50' },
};

// Mock incidents
const mockIncidents = [
  {
    id: 1,
    operation_id: 'op1',
    operation_ref: 'OP-2024-0890',
    type: 'delay',
    severity: 'medium',
    title: 'Retard trafic A6',
    description: 'Embouteillage sur A6, retard estimé 45 minutes',
    status: 'open',
    reported_by: 'Omar Al-Khatib',
    assigned_to: 'Dispatch — Terminal 4',
    created_date: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 2,
    operation_id: 'op2',
    operation_ref: 'OP-2024-0885',
    type: 'damage',
    severity: 'high',
    title: 'Colis endommagé',
    description: 'Palette n°3 endommagée lors du déchargement',
    status: 'in_progress',
    reported_by: 'Aisha Okonkwo',
    assigned_to: 'Support qualité',
    created_date: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 3,
    operation_id: 'op3',
    operation_ref: 'OP-2024-0878',
    type: 'missing_docs',
    severity: 'low',
    title: 'CMR non signé',
    description: 'Le client n\'a pas signé le CMR',
    status: 'resolved',
    reported_by: 'Viktor Rostov',
    assigned_to: 'Back-office',
    resolution: 'CMR récupéré par email',
    created_date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    resolved_at: new Date(Date.now() - 1000 * 60 * 60 * 20),
  },
  {
    id: 4,
    operation_id: 'op4',
    operation_ref: 'OP-2024-0882',
    type: 'breakdown',
    severity: 'critical',
    title: 'Panne moteur',
    description: 'Véhicule immobilisé sur aire de repos A7',
    status: 'in_progress',
    reported_by: 'Kenji Tanaka',
    assigned_to: 'Support technique',
    created_date: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
];

export default function Incidents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newIncidentOpen, setNewIncidentOpen] = useState(false);
  const [newIncident, setNewIncident] = useState({
    type: 'other',
    severity: 'medium',
    title: '',
    description: '',
    operation_ref: '',
  });

  const queryClient = useQueryClient();

  const { data: incidents = [] } = useQuery({
    queryKey: ['incidents'],
    queryFn: () => appApi.entities.Incident.list('-created_date'),
  });

  const displayIncidents = incidents.length > 0 ? incidents : mockIncidents;

  const filteredIncidents = displayIncidents.filter(incident => {
    const matchesSearch = !searchTerm || 
      incident.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.operation_ref?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: displayIncidents.length,
    open: displayIncidents.filter(i => i.status === 'open').length,
    inProgress: displayIncidents.filter(i => i.status === 'in_progress').length,
    resolved: displayIncidents.filter(i => ['resolved', 'closed'].includes(i.status)).length,
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
            Incidents & Support
          </motion.h1>
          <p className="text-slate-500 mt-1">
            Gestion des incidents et tickets de support
          </p>
        </div>
        <Dialog open={newIncidentOpen} onOpenChange={setNewIncidentOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Déclarer un incident
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Déclarer un incident</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Référence opération</Label>
                <Input 
                  placeholder="OP-2024-XXXX"
                  value={newIncident.operation_ref}
                  onChange={(e) => setNewIncident({...newIncident, operation_ref: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select 
                    value={newIncident.type} 
                    onValueChange={(v) => setNewIncident({...newIncident, type: v})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(incidentTypes).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Gravité</Label>
                  <Select 
                    value={newIncident.severity} 
                    onValueChange={(v) => setNewIncident({...newIncident, severity: v})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(severityConfig).map(([key, { label }]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Titre</Label>
                <Input 
                  placeholder="Résumé de l'incident"
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({...newIncident, title: e.target.value})}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  placeholder="Décrivez l'incident en détail..."
                  rows={4}
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
                />
              </div>
              <Button className="w-full" onClick={() => setNewIncidentOpen(false)}>
                Créer l'incident
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.open}</p>
              <p className="text-sm text-red-600">Ouverts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.inProgress}</p>
              <p className="text-sm text-amber-600">En cours</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              <p className="text-sm text-slate-500">Résolus</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Rechercher un incident..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="open">Ouverts</TabsTrigger>
            <TabsTrigger value="in_progress">En cours</TabsTrigger>
            <TabsTrigger value="resolved">Résolus</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Incidents list */}
      <div className="space-y-4">
        {filteredIncidents.map((incident, index) => {
          const typeConfig = incidentTypes[incident.type] || incidentTypes.other;
          const severity = severityConfig[incident.severity] || severityConfig.medium;
          
          return (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`hover:shadow-md transition-shadow cursor-pointer ${
                incident.status === 'open' ? 'border-l-4 border-l-red-500' :
                incident.status === 'in_progress' ? 'border-l-4 border-l-amber-500' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeConfig.color}`}>
                          {typeConfig.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severity.color}`}>
                          {severity.label}
                        </span>
                        <StatusBadge status={incident.status} size="sm" />
                        {incident.operation_ref && (
                          <span className="font-mono text-xs text-slate-500">
                            {incident.operation_ref}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">{incident.title}</h3>
                      <p className="text-sm text-slate-600 mb-3">{incident.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          Signalé par {incident.reported_by}
                        </span>
                        {incident.assigned_to && (
                          <span className="flex items-center gap-1">
                            <ArrowRight className="w-3.5 h-3.5" />
                            Assigné à {incident.assigned_to}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {format(new Date(incident.created_date), "dd/MM/yyyy HH:mm", { locale: fr })}
                        </span>
                      </div>
                      {incident.resolution && (
                        <div className="mt-3 p-2 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-700">
                            <CheckCircle2 className="w-4 h-4 inline mr-1" />
                            Résolution: {incident.resolution}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Commenter
                      </Button>
                      {incident.operation_id && (
                        <Button 
                          size="sm"
                          onClick={() => window.location.href = createPageUrl('OperationDetail') + '?id=' + incident.operation_id}
                        >
                          Voir dossier
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}