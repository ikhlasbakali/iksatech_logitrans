import React, { useState } from 'react';
import { appApi } from '@/api/appApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Wrench,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import StatusBadge from "@/components/ui/StatusBadge";

const maintenanceTypes = {
  preventive: { label: 'Préventive', icon: Calendar, color: 'text-blue-600' },
  corrective: { label: 'Corrective', icon: Wrench, color: 'text-orange-600' },
  inspection: { label: 'Inspection', icon: CheckCircle2, color: 'text-green-600' },
  repair: { label: 'Réparation', icon: AlertCircle, color: 'text-red-600' },
  oil_change: { label: 'Vidange', icon: Wrench, color: 'text-amber-600' },
  tire_change: { label: 'Pneus', icon: Wrench, color: 'text-slate-600' },
  brake_service: { label: 'Freins', icon: Wrench, color: 'text-purple-600' },
  other: { label: 'Autre', icon: Wrench, color: 'text-gray-600' },
};

export default function VehicleMaintenancePanel({ vehicleId, vehiclePlate, currentMileage }) {
  const [newMaintenanceOpen, setNewMaintenanceOpen] = useState(false);
  const [newMaintenance, setNewMaintenance] = useState({
    type: 'preventive',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    cost: '',
    service_provider: '',
    status: 'scheduled',
  });

  const queryClient = useQueryClient();

  const { data: maintenances = [] } = useQuery({
    queryKey: ['maintenances', vehicleId],
    queryFn: () => appApi.entities.MaintenanceHistory.filter({ vehicle_id: vehicleId }, '-date'),
  });

  const createMaintenance = useMutation({
    mutationFn: (data) => appApi.entities.MaintenanceHistory.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenances', vehicleId] });
      setNewMaintenanceOpen(false);
      setNewMaintenance({
        type: 'preventive',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        cost: '',
        service_provider: '',
        status: 'scheduled',
      });
    },
  });

  const handleSubmit = () => {
    createMaintenance.mutate({
      vehicle_id: vehicleId,
      vehicle_plate: vehiclePlate,
      mileage_at_service: currentMileage,
      ...newMaintenance,
      cost: parseFloat(newMaintenance.cost) || 0,
    });
  };

  const upcomingMaintenances = maintenances.filter(m => 
    ['scheduled', 'in_progress'].includes(m.status) && 
    new Date(m.date) >= new Date()
  );

  const completedMaintenances = maintenances.filter(m => m.status === 'completed');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Historique maintenance</h3>
        <Dialog open={newMaintenanceOpen} onOpenChange={setNewMaintenanceOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Planifier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle maintenance</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Type</Label>
                <Select value={newMaintenance.type} onValueChange={(v) => setNewMaintenance({...newMaintenance, type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(maintenanceTypes).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  value={newMaintenance.description}
                  onChange={(e) => setNewMaintenance({...newMaintenance, description: e.target.value})}
                  placeholder="Détails de l'intervention..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date prévue</Label>
                  <Input 
                    type="date"
                    value={newMaintenance.date}
                    onChange={(e) => setNewMaintenance({...newMaintenance, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Coût (€)</Label>
                  <Input 
                    type="number"
                    value={newMaintenance.cost}
                    onChange={(e) => setNewMaintenance({...newMaintenance, cost: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <Label>Prestataire</Label>
                <Input 
                  value={newMaintenance.service_provider}
                  onChange={(e) => setNewMaintenance({...newMaintenance, service_provider: e.target.value})}
                  placeholder="Nom du garage/prestataire"
                />
              </div>
              <div>
                <Label>Statut</Label>
                <Select value={newMaintenance.status} onValueChange={(v) => setNewMaintenance({...newMaintenance, status: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Planifiée</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="completed">Terminée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleSubmit} disabled={createMaintenance.isPending}>
                {createMaintenance.isPending ? 'Création...' : 'Créer la maintenance'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Upcoming maintenances */}
      {upcomingMaintenances.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-600">Prochaines interventions</p>
          {upcomingMaintenances.map((maintenance, index) => {
            const typeConfig = maintenanceTypes[maintenance.type] || maintenanceTypes.other;
            const Icon = typeConfig.icon;
            const daysUntil = differenceInDays(new Date(maintenance.date), new Date());
            
            return (
              <motion.div
                key={maintenance.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 bg-amber-50 border border-amber-200 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${typeConfig.color}`} />
                    <span className="font-medium text-slate-900">{typeConfig.label}</span>
                  </div>
                  <StatusBadge status={maintenance.status} size="sm" />
                </div>
                <p className="text-sm text-slate-600 mb-2">{maintenance.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(maintenance.date), 'dd/MM/yyyy', { locale: fr })}
                    {daysUntil >= 0 && ` (dans ${daysUntil} jour${daysUntil > 1 ? 's' : ''})`}
                  </span>
                  {maintenance.cost > 0 && (
                    <span className="font-medium">{maintenance.cost.toFixed(2)} €</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Completed maintenances */}
      {completedMaintenances.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-600">Historique</p>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {completedMaintenances.slice(0, 5).map((maintenance, index) => {
              const typeConfig = maintenanceTypes[maintenance.type] || maintenanceTypes.other;
              const Icon = typeConfig.icon;
              
              return (
                <div
                  key={maintenance.id}
                  className="p-3 bg-slate-50 rounded-lg text-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${typeConfig.color}`} />
                      <span className="font-medium text-slate-700">{typeConfig.label}</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {format(new Date(maintenance.date), 'dd/MM/yy', { locale: fr })}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs">{maintenance.description}</p>
                  {maintenance.cost > 0 && (
                    <p className="text-xs text-slate-500 mt-1">Coût: {maintenance.cost.toFixed(2)} €</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {maintenances.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <Wrench className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucune maintenance enregistrée</p>
        </div>
      )}
    </div>
  );
}