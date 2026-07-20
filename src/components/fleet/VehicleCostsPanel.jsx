import React, { useState } from 'react';
import { appApi } from '@/api/appApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { 
  Plus,
  Fuel,
  Wrench,
  DollarSign,
  TrendingUp,
  Download
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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

const costTypes = {
  fuel: { label: 'Carburant', icon: Fuel, color: 'text-blue-600', bg: 'bg-blue-50' },
  maintenance: { label: 'Maintenance', icon: Wrench, color: 'text-orange-600', bg: 'bg-orange-50' },
  repair: { label: 'Réparation', icon: Wrench, color: 'text-red-600', bg: 'bg-red-50' },
  insurance: { label: 'Assurance', icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
  tax: { label: 'Taxe', icon: DollarSign, color: 'text-slate-600', bg: 'bg-slate-50' },
  toll: { label: 'Péage', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
  fine: { label: 'Amende', icon: DollarSign, color: 'text-red-600', bg: 'bg-red-50' },
  other: { label: 'Autre', icon: DollarSign, color: 'text-gray-600', bg: 'bg-gray-50' },
};

export default function VehicleCostsPanel({ vehicleId, vehiclePlate, currentMileage }) {
  const [newCostOpen, setNewCostOpen] = useState(false);
  const [newCost, setNewCost] = useState({
    type: 'fuel',
    date: format(new Date(), 'yyyy-MM-dd'),
    amount: '',
    quantity: '',
    supplier: '',
  });

  const queryClient = useQueryClient();

  const { data: costs = [] } = useQuery({
    queryKey: ['vehicleCosts', vehicleId],
    queryFn: () => appApi.entities.VehicleCost.filter({ vehicle_id: vehicleId }, '-date'),
  });

  const createCost = useMutation({
    mutationFn: (data) => appApi.entities.VehicleCost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicleCosts', vehicleId] });
      setNewCostOpen(false);
      setNewCost({
        type: 'fuel',
        date: format(new Date(), 'yyyy-MM-dd'),
        amount: '',
        quantity: '',
        supplier: '',
      });
    },
  });

  const handleSubmit = () => {
    createCost.mutate({
      vehicle_id: vehicleId,
      vehicle_plate: vehiclePlate,
      mileage_at_transaction: currentMileage,
      ...newCost,
      amount: parseFloat(newCost.amount) || 0,
      quantity: parseFloat(newCost.quantity) || 0,
      unit_price: newCost.quantity ? (parseFloat(newCost.amount) / parseFloat(newCost.quantity)) : 0,
    });
  };

  // Calculate stats
  const thisMonthCosts = costs.filter(c => {
    const costDate = new Date(c.date);
    return costDate >= startOfMonth(new Date()) && costDate <= endOfMonth(new Date());
  });

  const totalThisMonth = thisMonthCosts.reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalAllTime = costs.reduce((sum, c) => sum + (c.amount || 0), 0);

  const costsByType = costs.reduce((acc, cost) => {
    acc[cost.type] = (acc[cost.type] || 0) + cost.amount;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 mb-1">Ce mois</p>
            <p className="text-2xl font-bold text-slate-900">{totalThisMonth.toFixed(0)} €</p>
            <p className="text-xs text-slate-500 mt-1">{thisMonthCosts.length} transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 mb-1">Total cumulé</p>
            <p className="text-2xl font-bold text-slate-900">{totalAllTime.toFixed(0)} €</p>
            <p className="text-xs text-slate-500 mt-1">{costs.length} transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown by type */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-600">Répartition des coûts</p>
        {Object.entries(costsByType).map(([type, total]) => {
          const typeConfig = costTypes[type] || costTypes.other;
          const Icon = typeConfig.icon;
          const percentage = totalAllTime > 0 ? (total / totalAllTime) * 100 : 0;
          
          return (
            <div key={type} className={`p-3 rounded-lg ${typeConfig.bg}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${typeConfig.color}`} />
                  <span className="text-sm font-medium text-slate-900">{typeConfig.label}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{total.toFixed(0)} €</span>
              </div>
              <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${typeConfig.color.replace('text-', 'bg-')}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">{percentage.toFixed(1)}% du total</p>
            </div>
          );
        })}
      </div>

      {/* Add cost button */}
      <Dialog open={newCostOpen} onOpenChange={setNewCostOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une dépense
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle dépense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Type</Label>
              <Select value={newCost.type} onValueChange={(v) => setNewCost({...newCost, type: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(costTypes).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input 
                  type="date"
                  value={newCost.date}
                  onChange={(e) => setNewCost({...newCost, date: e.target.value})}
                />
              </div>
              <div>
                <Label>Montant (€)</Label>
                <Input 
                  type="number"
                  step="0.01"
                  value={newCost.amount}
                  onChange={(e) => setNewCost({...newCost, amount: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </div>
            {newCost.type === 'fuel' && (
              <div>
                <Label>Quantité (litres)</Label>
                <Input 
                  type="number"
                  step="0.1"
                  value={newCost.quantity}
                  onChange={(e) => setNewCost({...newCost, quantity: e.target.value})}
                  placeholder="0.0"
                />
              </div>
            )}
            <div>
              <Label>Fournisseur</Label>
              <Input 
                value={newCost.supplier}
                onChange={(e) => setNewCost({...newCost, supplier: e.target.value})}
                placeholder="Nom du fournisseur"
              />
            </div>
            <Button className="w-full" onClick={handleSubmit} disabled={createCost.isPending}>
              {createCost.isPending ? 'Ajout...' : 'Ajouter la dépense'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recent costs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-600">Dernières dépenses</p>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {costs.slice(0, 10).map((cost, index) => {
            const typeConfig = costTypes[cost.type] || costTypes.other;
            const Icon = typeConfig.icon;
            
            return (
              <div
                key={cost.id}
                className="p-2 bg-slate-50 rounded-lg text-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${typeConfig.color}`} />
                  <div>
                    <p className="font-medium text-slate-700">{typeConfig.label}</p>
                    <p className="text-xs text-slate-500">
                      {format(new Date(cost.date), 'dd/MM/yy', { locale: fr })}
                      {cost.supplier && ` • ${cost.supplier}`}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-slate-900">{cost.amount.toFixed(2)} €</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}