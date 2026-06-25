import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { appApi } from '@/api/appApi';
import { computeDeliveryAnalytics, operationsToReportRows } from '@/services/reporting/reportingService';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Download,
  Calendar,
  Package,
  Truck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadCsv, downloadPdf } from "@/utils/export";
import { APP_NAME } from "@/config/branding";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';

// Mock data for charts
const operationsData = [
  { name: 'Lun', operations: 45, delivered: 42, incidents: 2 },
  { name: 'Mar', operations: 52, delivered: 48, incidents: 1 },
  { name: 'Mer', operations: 38, delivered: 35, incidents: 3 },
  { name: 'Jeu', operations: 61, delivered: 58, incidents: 1 },
  { name: 'Ven', operations: 55, delivered: 52, incidents: 2 },
  { name: 'Sam', operations: 28, delivered: 27, incidents: 0 },
  { name: 'Dim', operations: 12, delivered: 12, incidents: 0 },
];

const monthlyTrend = [
  { name: 'Jan', value: 1240 },
  { name: 'Fév', value: 1380 },
  { name: 'Mar', value: 1520 },
  { name: 'Avr', value: 1420 },
  { name: 'Mai', value: 1680 },
  { name: 'Juin', value: 1890 },
  { name: 'Juil', value: 1750 },
  { name: 'Août', value: 1450 },
  { name: 'Sep', value: 1920 },
  { name: 'Oct', value: 2100 },
  { name: 'Nov', value: 1980 },
  { name: 'Déc', value: 2250 },
];

const statusDistribution = [
  { name: 'Livrées', value: 65, color: '#10b981' },
  { name: 'En transit', value: 20, color: '#f59e0b' },
  { name: 'En attente', value: 10, color: '#3b82f6' },
  { name: 'Incidents', value: 5, color: '#ef4444' },
];

const driverPerformance = [
  { name: 'J. Dupont', deliveries: 45, onTime: 98, rating: 4.8 },
  { name: 'M. Martin', deliveries: 42, onTime: 96, rating: 4.9 },
  { name: 'P. Durand', deliveries: 38, onTime: 92, rating: 4.6 },
  { name: 'S. Bernard', deliveries: 52, onTime: 99, rating: 4.7 },
  { name: 'L. Petit', deliveries: 35, onTime: 91, rating: 4.5 },
  { name: 'E. Leroy', deliveries: 48, onTime: 97, rating: 4.9 },
];

const delayReasons = [
  { name: 'Trafic', value: 35 },
  { name: 'Météo', value: 20 },
  { name: 'Client absent', value: 18 },
  { name: 'Panne véhicule', value: 12 },
  { name: 'Documents', value: 10 },
  { name: 'Autre', value: 5 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Reports() {
  const [period, setPeriod] = useState('week');

  const { data: analytics } = useQuery({
    queryKey: ['reportingAnalytics'],
    queryFn: computeDeliveryAnalytics,
  });

  const { data: operations = [] } = useQuery({
    queryKey: ['operations'],
    queryFn: () => appApi.entities.Operation.list(),
  });

  const kpis = {
    totalOperations: 2847,
    deliveryRate: 97.2,
    averageDelay: 12,
    incidents: 23,
    activeDrivers: 18,
    onTimeRate: 94.5,
  };

  const handleExportCsv = () => {
    const rows = [
      { section: "KPI", label: "Opérations totales", value: kpis.totalOperations },
      { section: "KPI", label: "Taux de livraison", value: `${kpis.deliveryRate}%` },
      { section: "KPI", label: "Ponctualité", value: `${kpis.onTimeRate}%` },
      { section: "KPI", label: "Délai moyen (min)", value: kpis.averageDelay },
      { section: "KPI", label: "Incidents", value: kpis.incidents },
      { section: "KPI", label: "Chauffeurs actifs", value: kpis.activeDrivers },
      ...operationsData.map((row) => ({
        section: "Ops par jour",
        label: row.name,
        value: row.operations,
        extra: `Livrées: ${row.delivered}, Incidents: ${row.incidents}`,
      })),
      ...monthlyTrend.map((row) => ({
        section: "Tendance mensuelle",
        label: row.name,
        value: row.value,
      })),
      ...statusDistribution.map((row) => ({
        section: "Statuts",
        label: row.name,
        value: row.value,
      })),
      ...driverPerformance.map((row) => ({
        section: "Chauffeurs",
        label: row.name,
        value: row.deliveries,
        extra: `Ponctualité: ${row.onTime}%, Note: ${row.rating}`,
      })),
      ...delayReasons.map((row) => ({
        section: "Retards",
        label: row.name,
        value: row.value,
      })),
    ];

    downloadCsv("rapport-logitrans.csv", rows, ["section", "label", "value", "extra"]);
  };

  const handleExportPdf = () => {
    downloadPdf({
      title: `Rapports ${APP_NAME}`,
      sections: [
        {
          title: "KPI",
          columns: ["Indicateur", "Valeur"],
          rows: [
            { Indicateur: "Opérations totales", Valeur: kpis.totalOperations },
            { Indicateur: "Taux de livraison", Valeur: `${kpis.deliveryRate}%` },
            { Indicateur: "Ponctualité", Valeur: `${kpis.onTimeRate}%` },
            { Indicateur: "Délai moyen (min)", Valeur: kpis.averageDelay },
            { Indicateur: "Incidents", Valeur: kpis.incidents },
            { Indicateur: "Chauffeurs actifs", Valeur: kpis.activeDrivers },
          ],
        },
        {
          title: "Opérations par jour",
          columns: ["Jour", "Opérations", "Livrées", "Incidents"],
          rows: operationsData.map((row) => ({
            Jour: row.name,
            Opérations: row.operations,
            Livrées: row.delivered,
            Incidents: row.incidents,
          })),
        },
        {
          title: "Performance chauffeurs",
          columns: ["Chauffeur", "Livraisons", "Ponctualité", "Note"],
          rows: driverPerformance.map((row) => ({
            Chauffeur: row.name,
            Livraisons: row.deliveries,
            Ponctualité: `${row.onTime}%`,
            Note: row.rating,
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
            Rapports & Analytics
          </motion.h1>
          <p className="text-slate-500 mt-1">
            Tableau de bord des performances
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
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
              <DropdownMenuItem
                onClick={() =>
                  downloadCsv(
                    'logitrans-operations-reelles.csv',
                    operationsToReportRows(operations),
                    ['reference', 'client', 'status', 'delay_minutes', 'pickup_city', 'delivery_city', 'incoterm']
                  )
                }
              >
                CSV — opérations (données app)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {analytics && (
        <Card className="border-blue-200 bg-blue-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Indicateurs calculés sur vos dossiers (local)</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Opérations suivies</p>
              <p className="text-2xl font-bold text-slate-900">{analytics.operations_total}</p>
            </div>
            <div>
              <p className="text-slate-500">Taux livraison (statut)</p>
              <p className="text-2xl font-bold text-emerald-700">{analytics.delivery_rate_pct}%</p>
            </div>
            <div>
              <p className="text-slate-500">Taux retard &gt; 30 min</p>
              <p className="text-2xl font-bold text-amber-700">{analytics.delay_rate_pct}%</p>
            </div>
            <div>
              <p className="text-slate-500">Retard moyen (min)</p>
              <p className="text-2xl font-bold text-slate-900">{analytics.avg_delay_minutes}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Package className="w-4 h-4" />
              <span className="text-xs">Opérations</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{kpis.totalOperations}</p>
            <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
              <TrendingUp className="w-3 h-3" />
              +12.5%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs">Taux livraison</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{kpis.deliveryRate}%</p>
            <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
              <TrendingUp className="w-3 h-3" />
              +2.1%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Ponctualité</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{kpis.onTimeRate}%</p>
            <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
              <TrendingUp className="w-3 h-3" />
              +1.8%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Délai moyen</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">{kpis.averageDelay} min</p>
            <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
              <TrendingDown className="w-3 h-3" />
              +3 min
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs">Incidents</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{kpis.incidents}</p>
            <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
              <TrendingDown className="w-3 h-3" />
              -15%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-xs">Chauffeurs actifs</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{kpis.activeDrivers}</p>
            <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
              sur 22 total
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operations this week */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Opérations cette semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={operationsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="operations" fill="#3b82f6" name="Opérations" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="delivered" fill="#10b981" name="Livrées" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Répartition des statuts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Évolution annuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    fill="url(#colorGradient)"
                    name="Opérations"
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Delay reasons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Causes de retard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={delayReasons} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} name="%" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Driver performance table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance des chauffeurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Chauffeur</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Livraisons</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Ponctualité</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Note</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Performance</th>
                </tr>
              </thead>
              <tbody>
                {driverPerformance.map((driver, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-medium">
                            {driver.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium text-slate-900">{driver.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-slate-900">{driver.deliveries}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-semibold ${
                        driver.onTime >= 95 ? 'text-green-600' : 
                        driver.onTime >= 90 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {driver.onTime}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-amber-600">⭐ {driver.rating}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            driver.onTime >= 95 ? 'bg-green-500' : 
                            driver.onTime >= 90 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${driver.onTime}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}