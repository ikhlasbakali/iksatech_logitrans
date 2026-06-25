import React from 'react';
import { X, BarChart3, TrendingUp, Target, Calendar, Award, Users, DollarSign } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface TopServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TopServiceModal: React.FC<TopServiceModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;

  // Données simulées du Top Service
  const serviceData = {
    name: 'Transport International',
    revenue: 1200000,
    margin: 75.2,
    rank: 1,
    clients: 45,
    transactions: 120,
    averageTicket: 10000,
    growth: 18.5,
    costPerUnit: 2480,
    profitPerUnit: 7520
  };

  const monthlyPerformance = [
    { month: 'Janvier', revenue: 980000, margin: 72.1, clients: 38, status: 'Excellent' },
    { month: 'Février', revenue: 1050000, margin: 73.8, clients: 42, status: 'Excellent' },
    { month: 'Mars', revenue: 1100000, margin: 74.2, clients: 44, status: 'Excellent' },
    { month: 'Avril', revenue: 1150000, margin: 74.8, clients: 46, status: 'Excellent' },
    { month: 'Mai', revenue: 1180000, margin: 75.0, clients: 47, status: 'Excellent' },
    { month: 'Juin', revenue: 1200000, margin: 75.1, clients: 48, status: 'Excellent' },
    { month: 'Juillet', revenue: 1220000, margin: 75.3, clients: 49, status: 'Excellent' },
    { month: 'Août', revenue: 1210000, margin: 75.2, clients: 48, status: 'Excellent' },
    { month: 'Septembre', revenue: 1200000, margin: 75.2, clients: 45, status: 'Excellent' }
  ];

  const topClients = [
    { client: 'Atlas Mécanique', revenue: 180000, percentage: 15.0, orders: 18 },
    { client: 'YAZAKI MOROCCO', revenue: 150000, percentage: 12.5, orders: 15 },
    { client: 'DELPHI TECHNOLOGIES', revenue: 120000, percentage: 10.0, orders: 12 },
    { client: 'BOSCH MAROC', revenue: 100000, percentage: 8.3, orders: 10 },
    { client: 'VALEOMAROC', revenue: 80000, percentage: 6.7, orders: 8 }
  ];

  const routes = [
    { route: 'Casablanca → Tanger', revenue: 300000, trips: 45, efficiency: 95.2 },
    { route: 'Rabat → Fès', revenue: 250000, trips: 38, efficiency: 92.8 },
    { route: 'Marrakech → Agadir', revenue: 200000, trips: 32, efficiency: 89.5 },
    { route: 'Casablanca → Meknès', revenue: 180000, trips: 28, efficiency: 87.3 },
    { route: 'Autres routes', revenue: 270000, trips: 42, efficiency: 85.1 }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Détails Top Service</h2>
                <p className="text-gray-600">Analyse complète de {serviceData.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Résumé du service */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Award className="w-6 h-6 mr-3 text-purple-600" />
              Résumé du Service
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-700">Revenu Total</p>
                    <p className="text-3xl font-bold text-purple-900 mt-2">
                      {formatCurrency(serviceData.revenue)}
                    </p>
                    <p className="text-sm text-purple-600 mt-2">Ce mois</p>
                  </div>
                  <DollarSign className="w-10 h-10 text-purple-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-700">Marge</p>
                    <p className="text-3xl font-bold text-green-900 mt-2">
                      {formatPercentage(serviceData.margin)}
                    </p>
                    <p className="text-sm text-green-600 mt-2">Rentabilité</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-green-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-700">Clients</p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">
                      {serviceData.clients}
                    </p>
                    <p className="text-sm text-blue-600 mt-2">Actifs</p>
                  </div>
                  <Users className="w-10 h-10 text-blue-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-orange-700">Croissance</p>
                    <p className="text-3xl font-bold text-orange-900 mt-2">
                      +{formatPercentage(serviceData.growth)}
                    </p>
                    <p className="text-sm text-orange-600 mt-2">vs mois dernier</p>
                  </div>
                  <Target className="w-10 h-10 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Performance mensuelle */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-blue-600" />
              Performance Mensuelle
            </h3>
            
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mois</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marge</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clients</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {monthlyPerformance.map((month, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {month.month}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(month.revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPercentage(month.margin)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {month.clients}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {month.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top clients */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="w-6 h-6 mr-3 text-green-600" />
              Top Clients
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topClients.map((client, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200/50 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{client.client}</p>
                        <p className="text-xs text-gray-500">{client.orders} commandes</p>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-semibold rounded-full">
                      {formatPercentage(client.percentage)}
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(client.revenue)}</p>
                    <p className="text-sm text-gray-600">Revenu généré</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                      style={{ width: `${client.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Routes principales */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="w-6 h-6 mr-3 text-orange-600" />
              Routes Principales
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {routes.map((route, index) => (
                <div key={index} className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200/50 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-orange-700">{route.route}</p>
                        <p className="text-xs text-orange-600">{route.trips} voyages</p>
                      </div>
                    </div>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 text-xs font-semibold rounded-full">
                      {formatPercentage(route.efficiency)}
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="text-xl font-bold text-orange-900">{formatCurrency(route.revenue)}</p>
                    <p className="text-sm text-orange-600">Revenu généré</p>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                      style={{ width: `${(route.revenue / Math.max(...routes.map(r => r.revenue))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistiques avancées */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-gray-600" />
              Statistiques Avancées
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(serviceData.averageTicket)}</p>
                <p className="text-sm text-gray-600">Panier Moyen</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{formatCurrency(serviceData.profitPerUnit)}</p>
                <p className="text-sm text-gray-600">Profit par Unité</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(serviceData.costPerUnit)}</p>
                <p className="text-sm text-gray-600">Coût par Unité</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{serviceData.transactions}</p>
                <p className="text-sm text-gray-600">Transactions Total</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
