import React from 'react';
import { X, Clock, TrendingUp, DollarSign, BarChart3, Calendar, Target, Activity } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface DailyRevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyRevenueModal: React.FC<DailyRevenueModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;

  // Données simulées du revenu quotidien
  const dailyData = {
    currentRevenue: 92333, // Basé sur 2 770 000 € / 30 jours
    target: 100000,
    hourlyAverage: 11542, // 92333 / 8 heures
    hoursCompleted: 8,
    totalHours: 8,
    growthRate: 5.2, // Croissance cohérente avec les données
    previousDay: 87750
  };


  const clientBreakdown = [
    { client: 'Baltic Trade OÜ', revenue: 25000, transactions: 15, status: 'completed' },
    { client: 'Tokai Assembly K.K.', revenue: 22000, transactions: 12, status: 'completed' },
    { client: 'Midland Components Ltd', revenue: 18000, transactions: 10, status: 'completed' },
    { client: 'Riga Industrial Desk', revenue: 15000, transactions: 8, status: 'completed' },
    { client: 'Krakow Ceramica SP', revenue: 12333, transactions: 6, status: 'completed' },
    { client: 'Arctic Line OY', revenue: 0, transactions: 0, status: 'pending' }
  ];

  const commercialBreakdown = [
    { commercial: 'Nadia Volkov', revenue: 25000, clients: 8, status: 'completed' },
    { commercial: 'James Okoro', revenue: 22000, clients: 7, status: 'completed' },
    { commercial: 'Kenji Takano', revenue: 18000, clients: 6, status: 'completed' },
    { commercial: 'Yelena Popova', revenue: 15000, clients: 5, status: 'completed' },
    { commercial: 'Viktor Rostov', revenue: 12333, clients: 4, status: 'completed' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'break': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'break': return 'Pause';
      case 'pending': return 'En attente';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Détails du Revenu Quotidien</h2>
                <p className="text-gray-600">Analyse complète du {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
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
        <div className="p-6">
          {/* Résumé du jour */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-orange-600" />
              Résumé du Jour
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-orange-700">Revenu Actuel</p>
                    <p className="text-3xl font-bold text-orange-900 mt-2">
                      {formatCurrency(dailyData.currentRevenue)}
                    </p>
                    <p className="text-sm text-orange-600 mt-2">Aujourd'hui</p>
                  </div>
                  <DollarSign className="w-10 h-10 text-orange-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-700">Objectif</p>
                    <p className="text-3xl font-bold text-green-900 mt-2">
                      {formatCurrency(dailyData.target)}
                    </p>
                    <p className="text-sm text-green-600 mt-2">
                      {formatPercentage((dailyData.currentRevenue / dailyData.target) * 100)} atteint
                    </p>
                  </div>
                  <Target className="w-10 h-10 text-green-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-700">Moyenne Horaire</p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">
                      {formatCurrency(dailyData.hourlyAverage)}
                    </p>
                    <p className="text-sm text-blue-600 mt-2">Par heure</p>
                  </div>
                  <Clock className="w-10 h-10 text-blue-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-700">Croissance</p>
                    <p className="text-3xl font-bold text-purple-900 mt-2">
                      +{formatPercentage(dailyData.growthRate)}
                    </p>
                    <p className="text-sm text-purple-600 mt-2">vs hier</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-purple-600" />
                </div>
              </div>
            </div>
          </div>


          {/* Détail par client */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-3 text-green-600" />
              Détail par Client
            </h3>
            
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clientBreakdown.map((client, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {client.client}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {client.revenue > 0 ? formatCurrency(client.revenue) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {client.transactions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                            {getStatusText(client.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {client.revenue > 0 ? (
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                                  style={{ width: `${(client.revenue / Math.max(...clientBreakdown.filter(c => c.revenue > 0).map(c => c.revenue))) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600">
                                {formatPercentage((client.revenue / dailyData.currentRevenue) * 100)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Détail par commercial */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
              Détail par Commercial
            </h3>
            
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commercial</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clients</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {commercialBreakdown.map((commercial, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {commercial.commercial}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(commercial.revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {commercial.clients}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(commercial.status)}`}>
                            {getStatusText(commercial.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                                style={{ width: `${(commercial.revenue / Math.max(...commercialBreakdown.map(c => c.revenue))) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">
                              {formatPercentage((commercial.revenue / dailyData.currentRevenue) * 100)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(dailyData.currentRevenue)}</p>
                <p className="text-sm text-gray-600">Revenu Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{formatCurrency(dailyData.currentRevenue - dailyData.previousDay)}</p>
                <p className="text-sm text-gray-600">Écart vs Hier</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(dailyData.hourlyAverage)}</p>
                <p className="text-sm text-gray-600">Moyenne Horaire</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{formatPercentage(dailyData.growthRate)}</p>
                <p className="text-sm text-gray-600">Taux de Croissance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
