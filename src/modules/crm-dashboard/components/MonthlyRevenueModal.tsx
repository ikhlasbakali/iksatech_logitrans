import React from 'react';
import { X, TrendingUp, Calendar, DollarSign, BarChart3, Clock, Target } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface MonthlyRevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MonthlyRevenueModal: React.FC<MonthlyRevenueModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;

  // Données simulées du revenu mensuel
  const monthlyData = {
    currentMonth: 2770000,
    previousMonth: 2630000,
    target: 2730000,
    dailyAverage: 92333,
    daysCompleted: 30,
    daysInMonth: 30,
    growthRate: 5.2
  };

  const dailyBreakdown = [
    { day: 1, revenue: 8500, status: 'completed' },
    { day: 2, revenue: 9200, status: 'completed' },
    { day: 3, revenue: 7800, status: 'completed' },
    { day: 4, revenue: 10500, status: 'completed' },
    { day: 5, revenue: 11200, status: 'completed' },
    { day: 6, revenue: 9800, status: 'completed' },
    { day: 7, revenue: 8900, status: 'completed' },
    { day: 8, revenue: 10200, status: 'completed' },
    { day: 9, revenue: 11500, status: 'completed' },
    { day: 10, revenue: 10800, status: 'completed' },
    { day: 11, revenue: 9500, status: 'completed' },
    { day: 12, revenue: 12200, status: 'completed' },
    { day: 13, revenue: 11800, status: 'completed' },
    { day: 14, revenue: 13200, status: 'completed' },
    { day: 15, revenue: 12800, status: 'completed' },
    { day: 16, revenue: 14500, status: 'completed' },
    { day: 17, revenue: 13800, status: 'completed' },
    { day: 18, revenue: 15200, status: 'completed' },
    { day: 19, revenue: 14800, status: 'completed' },
    { day: 20, revenue: 16500, status: 'completed' },
    { day: 21, revenue: 15800, status: 'completed' },
    { day: 22, revenue: 17200, status: 'completed' },
    { day: 23, revenue: 16800, status: 'completed' },
    { day: 24, revenue: 18500, status: 'completed' },
    { day: 25, revenue: 17800, status: 'completed' },
    { day: 26, revenue: 19200, status: 'completed' },
    { day: 27, revenue: 18800, status: 'completed' },
    { day: 28, revenue: 20500, status: 'completed' },
    { day: 29, revenue: 19800, status: 'completed' },
    { day: 30, revenue: 21200, status: 'completed' }
  ];

  const weeklyBreakdown = [
    { week: 'Semaine 1', revenue: 47200, days: 7, average: 6743 },
    { week: 'Semaine 2', revenue: 52300, days: 7, average: 7471 },
    { week: 'Semaine 3', revenue: 57800, days: 7, average: 8257 },
    { week: 'Semaine 4', revenue: 62500, days: 7, average: 8929 },
    { week: 'Semaine 5', revenue: 113000, days: 2, average: 56500 }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Détails du Revenu Mensuel</h2>
                <p className="text-gray-600">Analyse complète du mois de {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
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
          {/* Résumé du mois */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-purple-600" />
              Résumé du Mois
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-700">Revenu Actuel</p>
                    <p className="text-3xl font-bold text-purple-900 mt-2">
                      {formatCurrency(monthlyData.currentMonth)}
                    </p>
                    <p className="text-sm text-purple-600 mt-2">Ce mois</p>
                  </div>
                  <DollarSign className="w-10 h-10 text-purple-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-700">Objectif</p>
                    <p className="text-3xl font-bold text-green-900 mt-2">
                      {formatCurrency(monthlyData.target)}
                    </p>
                    <p className="text-sm text-green-600 mt-2">
                      {formatPercentage((monthlyData.currentMonth / monthlyData.target) * 100)} atteint
                    </p>
                  </div>
                  <Target className="w-10 h-10 text-green-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-700">Moyenne Quotidienne</p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">
                      {formatCurrency(monthlyData.dailyAverage)}
                    </p>
                    <p className="text-sm text-blue-600 mt-2">Par jour</p>
                  </div>
                  <Clock className="w-10 h-10 text-blue-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-orange-700">Croissance</p>
                    <p className="text-3xl font-bold text-orange-900 mt-2">
                      +{formatPercentage(monthlyData.growthRate)}
                    </p>
                    <p className="text-sm text-orange-600 mt-2">vs mois dernier</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Répartition hebdomadaire */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
              Répartition Hebdomadaire
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weeklyBreakdown.map((week, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200/50 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-lg font-bold text-blue-900">{week.week}</p>
                      <p className="text-sm text-blue-600">{week.days} jours</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-900">{formatCurrency(week.revenue)}</p>
                      <p className="text-sm text-blue-600">Moy: {formatCurrency(week.average)}</p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(week.revenue / Math.max(...weeklyBreakdown.map(w => w.revenue))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Détail quotidien */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-green-600" />
              Détail Quotidien
            </h3>
            
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jour</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dailyBreakdown.map((day, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Jour {day.day}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(day.revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Terminé
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                                style={{ width: `${(day.revenue / Math.max(...dailyBreakdown.map(d => d.revenue))) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">
                              {formatPercentage((day.revenue / monthlyData.dailyAverage) * 100)}
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
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(monthlyData.currentMonth)}</p>
                <p className="text-sm text-gray-600">Revenu Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{formatCurrency(monthlyData.currentMonth - monthlyData.previousMonth)}</p>
                <p className="text-sm text-gray-600">Écart vs Mois Dernier</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(monthlyData.dailyAverage)}</p>
                <p className="text-sm text-gray-600">Moyenne Quotidienne</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{formatPercentage(monthlyData.growthRate)}</p>
                <p className="text-sm text-gray-600">Taux de Croissance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
