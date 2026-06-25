import React from 'react';
import { differenceInDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { 
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  FileText,
  Shield,
  Calendar
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VehicleComplianceAlerts({ vehicle }) {
  const checkCompliance = () => {
    const alerts = [];
    const today = new Date();

    // Contrôle technique
    if (vehicle.technical_inspection_date) {
      const daysUntil = differenceInDays(new Date(vehicle.technical_inspection_date), today);
      if (daysUntil < 0) {
        alerts.push({
          type: 'critical',
          icon: AlertCircle,
          title: 'Contrôle technique expiré',
          message: `Expiré depuis ${Math.abs(daysUntil)} jours`,
          date: vehicle.technical_inspection_date,
          action: 'Planifier immédiatement'
        });
      } else if (daysUntil <= 30) {
        alerts.push({
          type: 'warning',
          icon: AlertTriangle,
          title: 'Contrôle technique à renouveler',
          message: `Dans ${daysUntil} jour${daysUntil > 1 ? 's' : ''}`,
          date: vehicle.technical_inspection_date,
          action: 'Planifier'
        });
      }
    }

    // Assurance
    if (vehicle.insurance_expiry) {
      const daysUntil = differenceInDays(new Date(vehicle.insurance_expiry), today);
      if (daysUntil < 0) {
        alerts.push({
          type: 'critical',
          icon: AlertCircle,
          title: 'Assurance expirée',
          message: `Expirée depuis ${Math.abs(daysUntil)} jours`,
          date: vehicle.insurance_expiry,
          action: 'Renouveler immédiatement'
        });
      } else if (daysUntil <= 60) {
        alerts.push({
          type: 'warning',
          icon: AlertTriangle,
          title: 'Assurance à renouveler',
          message: `Dans ${daysUntil} jour${daysUntil > 1 ? 's' : ''}`,
          date: vehicle.insurance_expiry,
          action: 'Renouveler'
        });
      }
    }

    // Carte grise
    if (vehicle.registration_expiry) {
      const daysUntil = differenceInDays(new Date(vehicle.registration_expiry), today);
      if (daysUntil < 0) {
        alerts.push({
          type: 'critical',
          icon: AlertCircle,
          title: 'Carte grise expirée',
          message: `Expirée depuis ${Math.abs(daysUntil)} jours`,
          date: vehicle.registration_expiry,
          action: 'Renouveler'
        });
      } else if (daysUntil <= 90) {
        alerts.push({
          type: 'warning',
          icon: AlertTriangle,
          title: 'Carte grise à renouveler',
          message: `Dans ${daysUntil} jour${daysUntil > 1 ? 's' : ''}`,
          date: vehicle.registration_expiry,
          action: 'Renouveler'
        });
      }
    }

    // Maintenance préventive
    if (vehicle.last_maintenance_km && vehicle.maintenance_interval_km && vehicle.mileage) {
      const kmSinceLastMaintenance = vehicle.mileage - vehicle.last_maintenance_km;
      const kmUntilNextMaintenance = vehicle.maintenance_interval_km - kmSinceLastMaintenance;
      
      if (kmUntilNextMaintenance <= 0) {
        alerts.push({
          type: 'warning',
          icon: AlertTriangle,
          title: 'Maintenance préventive nécessaire',
          message: `Dépassé de ${Math.abs(kmUntilNextMaintenance)} km`,
          action: 'Planifier maintenance'
        });
      } else if (kmUntilNextMaintenance <= 5000) {
        alerts.push({
          type: 'info',
          icon: Calendar,
          title: 'Maintenance préventive à prévoir',
          message: `Dans ${kmUntilNextMaintenance} km`,
          action: 'Planifier'
        });
      }
    }

    return alerts;
  };

  const alerts = checkCompliance();

  if (alerts.length === 0) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-900">Conformité OK</p>
              <p className="text-sm text-green-700">Tous les documents sont à jour</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-slate-900">Alertes de conformité</h3>
      {alerts.map((alert, index) => {
        const Icon = alert.icon;
        const isCritical = alert.type === 'critical';
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={
              isCritical 
                ? 'bg-red-50 border-red-300 border-l-4' 
                : alert.type === 'warning'
                ? 'bg-amber-50 border-amber-300 border-l-4'
                : 'bg-blue-50 border-blue-300 border-l-4'
            }>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon className={
                      isCritical 
                        ? 'w-5 h-5 text-red-600 mt-0.5' 
                        : alert.type === 'warning'
                        ? 'w-5 h-5 text-amber-600 mt-0.5'
                        : 'w-5 h-5 text-blue-600 mt-0.5'
                    } />
                    <div className="flex-1">
                      <p className={`font-semibold ${
                        isCritical ? 'text-red-900' : 
                        alert.type === 'warning' ? 'text-amber-900' : 'text-blue-900'
                      }`}>
                        {alert.title}
                      </p>
                      <p className={`text-sm mt-1 ${
                        isCritical ? 'text-red-700' : 
                        alert.type === 'warning' ? 'text-amber-700' : 'text-blue-700'
                      }`}>
                        {alert.message}
                      </p>
                      {alert.date && (
                        <p className="text-xs text-slate-500 mt-1">
                          Date: {format(new Date(alert.date), 'dd/MM/yyyy', { locale: fr })}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className={
                      isCritical 
                        ? 'border-red-300 text-red-700 hover:bg-red-100' 
                        : alert.type === 'warning'
                        ? 'border-amber-300 text-amber-700 hover:bg-amber-100'
                        : 'border-blue-300 text-blue-700 hover:bg-blue-100'
                    }
                  >
                    {alert.action}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}