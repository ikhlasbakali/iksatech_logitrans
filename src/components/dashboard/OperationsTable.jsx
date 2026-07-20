import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/StatusBadge";
import { 
  Eye, 
  MapPin, 
  Truck, 
  User, 
  Clock,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OperationsTable({ operations, compact = false, showActions = true }) {
  if (!operations || operations.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <Truck className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p>Aucune opération trouvée</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="font-semibold text-slate-700">Référence</TableHead>
            <TableHead className="font-semibold text-slate-700">Client</TableHead>
            <TableHead className="font-semibold text-slate-700">Trajet</TableHead>
            {!compact && <TableHead className="font-semibold text-slate-700">Chauffeur</TableHead>}
            <TableHead className="font-semibold text-slate-700">Statut</TableHead>
            <TableHead className="font-semibold text-slate-700">Date</TableHead>
            {!compact && <TableHead className="font-semibold text-slate-700">Priorité</TableHead>}
            {showActions && <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {operations.map((op, index) => (
            <motion.tr 
              key={op.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={cn(
                "group hover:bg-slate-50/80 transition-colors cursor-pointer",
                op.delay_minutes > 30 && "bg-red-50/30"
              )}
              onClick={() => window.location.href = createPageUrl('OperationDetail') + '?id=' + op.id}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  {op.delay_minutes > 30 && (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="font-mono font-semibold text-slate-900">{op.reference}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-medium text-slate-700">{op.client_name}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-600">{op.pickup_city}</span>
                  <ChevronRight className="w-3 h-3 text-slate-300" />
                  <span className="text-slate-600">{op.delivery_city}</span>
                </div>
              </TableCell>
              {!compact && (
                <TableCell>
                  {op.driver_name ? (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <span className="text-sm text-slate-700">{op.driver_name}</span>
                        {op.driver2_name && (
                          <span className="text-xs text-slate-500 block">+ {op.driver2_name}</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400 italic">Non affecté</span>
                  )}
                </TableCell>
              )}
              <TableCell>
                <StatusBadge status={op.status} showDot />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {op.scheduled_pickup ? format(new Date(op.scheduled_pickup), 'dd MMM', { locale: fr }) : '-'}
                </div>
              </TableCell>
              {!compact && (
                <TableCell>
                  <StatusBadge status={op.priority} size="sm" />
                </TableCell>
              )}
              {showActions && (
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = createPageUrl('OperationDetail') + '?id=' + op.id;
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Voir
                  </Button>
                </TableCell>
              )}
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}