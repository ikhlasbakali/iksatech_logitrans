import React from 'react';
import { X, TrendingUp, TrendingDown, Users, Target, CheckCircle } from 'lucide-react';

interface TeamRankingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TeamRankingModal: React.FC<TeamRankingModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'Excellent': return 'text-green-600 bg-green-100';
      case 'Bon': return 'text-blue-600 bg-blue-100';
      case 'Moyen': return 'text-yellow-600 bg-yellow-100';
      case 'À améliorer': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const teamData = [
    {
      rank: 1,
      initials: 'AD',
      name: 'Nadia El Mansouri',
      performance: 'Bon',
      revenue: 630000,
      target: 600000,
      achievement: 105.0,
      deals: 63,
      total: 75,
      conversion: 84.0
    },
    {
      rank: 2,
      initials: 'MEA',
      name: 'Maha El Amri',
      performance: 'Excellent',
      revenue: 560000,
      target: 500000,
      achievement: 112.0,
      deals: 56,
      total: 68,
      conversion: 82.4
    },
    {
      rank: 3,
      initials: 'FEH',
      name: 'Fatiha El Hassany',
      performance: 'Bon',
      revenue: 430000,
      target: 400000,
      achievement: 107.5,
      deals: 43,
      total: 52,
      conversion: 82.7
    },
    {
      rank: 4,
      initials: 'CC',
      name: 'Chaimae Chekrouni',
      performance: 'Moyen',
      revenue: 400000,
      target: 450000,
      achievement: 88.9,
      deals: 40,
      total: 48,
      conversion: 83.3
    },
    {
      rank: 5,
      initials: 'YE',
      name: 'Yousra Es-Selasy',
      performance: 'Bon',
      revenue: 370000,
      target: 350000,
      achievement: 105.7,
      deals: 37,
      total: 44,
      conversion: 84.1
    },
    {
      rank: 6,
      initials: 'FA',
      name: 'Ferdaous Akdi',
      performance: 'Bon',
      revenue: 360000,
      target: 380000,
      achievement: 94.7,
      deals: 36,
      total: 42,
      conversion: 85.7
    },
    {
      rank: 7,
      initials: 'JB',
      name: 'Jaouhara Baha',
      performance: 'À améliorer',
      revenue: 20000,
      target: 50000,
      achievement: 40.0,
      deals: 2,
      total: 5,
      conversion: 40.0
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Classement Détaillé de l'Équipe</h2>
                <p className="text-gray-600">Performance globale de l'équipe commerciale</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Métriques d'Équipe */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-600">CA Total Équipe</p>
                  <p className="text-2xl font-bold text-blue-900">2 770 000 €</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-green-600">101.5% de l'objectif</span>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm font-bold text-green-600">+5.2%</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600">Affaires Conclues</p>
                  <p className="text-2xl font-bold text-green-900">277</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-green-600">82.9% du total</span>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm font-bold text-green-600">+12.3%</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-purple-600">Taux Conversion</p>
                  <p className="text-2xl font-bold text-purple-900">77.5%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-purple-600">Performance équipe</span>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm font-bold text-green-600">+3.1%</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-orange-600">Délai Moyen</p>
                  <p className="text-2xl font-bold text-orange-900">28 jours</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-orange-600">Par affaire</span>
                <div className="flex items-center">
                  <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm font-bold text-green-600">-2 jours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tableau de classement */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Classement Détaillé de l'Équipe</h3>
              <p className="text-sm text-gray-600">Performance individuelle de chaque commercial</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rang</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commercial</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CA Réalisé</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objectif</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Affaires</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamData.map((member, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-gray-900">#{member.rank}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-xs font-bold text-blue-600">{member.initials}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className={`text-xs px-2 py-1 rounded-full ${getPerformanceColor(member.performance)}`}>
                              {member.performance}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(member.revenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(member.target)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${member.achievement >= 100 ? 'bg-green-500' : 'bg-yellow-500'}`}
                              style={{ width: `${Math.min(member.achievement, 100)}%` }}
                            ></div>
                          </div>
                          <span className={`text-xs font-medium ${member.achievement >= 100 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {formatPercentage(member.achievement)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.deals}/{member.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPercentage(member.conversion)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamRankingModal;
