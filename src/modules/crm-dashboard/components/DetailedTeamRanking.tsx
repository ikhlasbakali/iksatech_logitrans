import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  TrendingDown,
  Target,
  CheckCircle,
  AlertTriangle,
  User
} from 'lucide-react';
import { SalespersonDetailModal } from './SalespersonDetailModal';

interface TeamMember {
  rank: number;
  initials: string;
  name: string;
  performance: 'Excellent' | 'Bon' | 'Moyen' | 'À améliorer';
  caRealized: number;
  objective: number;
  performanceRate: number;
  deals: string;
  conversion: number;
  trend: 'up' | 'down' | 'stable';
}

export const DetailedTeamRanking: React.FC = () => {
  const [selectedSalesperson, setSelectedSalesperson] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Données détaillées pour chaque commercial
  const salespersonDetails = {
    'Nadia El Mansouri': {
      name: 'Nadia El Mansouri',
      initials: 'AD',
      deals: 50,
      revenue: 630000,
      growth: 18.5,
      pipeline: {
        prospects: 15,
        qualification: 12,
        quotes: 10,
        negotiation: 8,
        signature: 5,
        lost: 3
      },
      services: {
        transportInternational: 25,
        transportNational: 15,
        stockage: 8,
        parking: 12
      }
    },
    'Maha El Amri': {
      name: 'Maha El Amri',
      initials: 'MEA',
      deals: 68,
      revenue: 560000,
      growth: 22.8,
      pipeline: {
        prospects: 20,
        qualification: 15,
        quotes: 12,
        negotiation: 10,
        signature: 8,
        lost: 3
      },
      services: {
        transportInternational: 30,
        transportNational: 20,
        stockage: 10,
        parking: 8
      }
    },
    'Fatiha El Hassany': {
      name: 'Fatiha El Hassany',
      initials: 'FEH',
      deals: 52,
      revenue: 430000,
      growth: 20.1,
      pipeline: {
        prospects: 18,
        qualification: 14,
        quotes: 10,
        negotiation: 7,
        signature: 3,
        lost: 0
      },
      services: {
        transportInternational: 28,
        transportNational: 16,
        stockage: 6,
        parking: 2
      }
    },
    'Chaimae Chekrouni': {
      name: 'Chaimae Chekrouni',
      initials: 'CC',
      deals: 48,
      revenue: 400000,
      growth: 15.2,
      pipeline: {
        prospects: 16,
        qualification: 12,
        quotes: 8,
        negotiation: 7,
        signature: 5,
        lost: 0
      },
      services: {
        transportInternational: 24,
        transportNational: 14,
        stockage: 7,
        parking: 3
      }
    },
    'Yousra Es-Selasy': {
      name: 'Yousra Es-Selasy',
      initials: 'YE',
      deals: 44,
      revenue: 370000,
      growth: 16.7,
      pipeline: {
        prospects: 14,
        qualification: 11,
        quotes: 9,
        negotiation: 6,
        signature: 4,
        lost: 0
      },
      services: {
        transportInternational: 22,
        transportNational: 12,
        stockage: 6,
        parking: 4
      }
    },
    'Ferdaous Akdi': {
      name: 'Ferdaous Akdi',
      initials: 'FA',
      deals: 42,
      revenue: 360000,
      growth: 12.3,
      pipeline: {
        prospects: 13,
        qualification: 10,
        quotes: 8,
        negotiation: 6,
        signature: 5,
        lost: 0
      },
      services: {
        transportInternational: 20,
        transportNational: 12,
        stockage: 6,
        parking: 4
      }
    },
    'Jaouhara Baha': {
      name: 'Jaouhara Baha',
      initials: 'JB',
      deals: 5,
      revenue: 20000,
      growth: -15.2,
      pipeline: {
        prospects: 2,
        qualification: 1,
        quotes: 1,
        negotiation: 1,
        signature: 0,
        lost: 0
      },
      services: {
        transportInternational: 2,
        transportNational: 2,
        stockage: 1,
        parking: 0
      }
    }
  };

  const teamMembers: TeamMember[] = [
    {
      rank: 1,
      initials: 'AD',
      name: 'Nadia El Mansouri',
      performance: 'Bon',
      caRealized: 630000,
      objective: 600000,
      performanceRate: 105.0,
      deals: '63/75',
      conversion: 84.0,
      trend: 'up'
    },
    {
      rank: 2,
      initials: 'MEA',
      name: 'Maha El Amri',
      performance: 'Excellent',
      caRealized: 560000,
      objective: 500000,
      performanceRate: 112.0,
      deals: '56/68',
      conversion: 82.4,
      trend: 'up'
    },
    {
      rank: 3,
      initials: 'FEH',
      name: 'Fatiha El Hassany',
      performance: 'Bon',
      caRealized: 430000,
      objective: 400000,
      performanceRate: 107.5,
      deals: '43/52',
      conversion: 82.7,
      trend: 'up'
    },
    {
      rank: 4,
      initials: 'CC',
      name: 'Chaimae Chekrouni',
      performance: 'Moyen',
      caRealized: 400000,
      objective: 450000,
      performanceRate: 88.9,
      deals: '40/48',
      conversion: 83.3,
      trend: 'down'
    },
    {
      rank: 5,
      initials: 'YE',
      name: 'Yousra Es-Selasy',
      performance: 'Bon',
      caRealized: 370000,
      objective: 350000,
      performanceRate: 105.7,
      deals: '37/44',
      conversion: 84.1,
      trend: 'up'
    },
    {
      rank: 6,
      initials: 'FA',
      name: 'Ferdaous Akdi',
      performance: 'Bon',
      caRealized: 360000,
      objective: 380000,
      performanceRate: 94.7,
      deals: '36/42',
      conversion: 85.7,
      trend: 'down'
    },
    {
      rank: 7,
      initials: 'JB',
      name: 'Jaouhara Baha',
      performance: 'À améliorer',
      caRealized: 20000,
      objective: 50000,
      performanceRate: 40.0,
      deals: '2/5',
      conversion: 40.0,
      trend: 'down'
    }
  ];

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
      case 'Excellent':
        return 'text-green-600 bg-green-100';
      case 'Bon':
        return 'text-blue-600 bg-blue-100';
      case 'Moyen':
        return 'text-yellow-600 bg-yellow-100';
      case 'À améliorer':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'Excellent':
        return <Trophy className="w-4 h-4" />;
      case 'Bon':
        return <Medal className="w-4 h-4" />;
      case 'Moyen':
        return <Target className="w-4 h-4" />;
      case 'À améliorer':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-500" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-gray-500 font-bold">#{rank}</span>;
    }
  };

  const handleSalespersonClick = (member: TeamMember) => {
    const details = salespersonDetails[member.name as keyof typeof salespersonDetails];
    if (details) {
      setSelectedSalesperson(details);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Trophy className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Classement Détaillé de l'Équipe</h2>
            <p className="text-gray-600">Performance individuelle des commerciaux</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rang
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commercial
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CA Réalisé
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Objectif
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Affaires
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Conversion
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teamMembers.map((member) => (
              <tr key={member.rank} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getRankIcon(member.rank)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{member.initials}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div 
                        className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handleSalespersonClick(member)}
                      >
                        {member.name}
                      </div>
                      <div className="text-sm text-gray-500">{member.initials}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">{formatCurrency(member.caRealized)}</div>
                  <div className="flex items-center text-xs text-gray-500">
                    {member.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                    ) : member.trend === 'down' ? (
                      <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                    ) : null}
                    {member.trend === 'up' ? '+' : member.trend === 'down' ? '-' : ''}5.0%
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(member.objective)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPerformanceColor(member.performance)}`}>
                      {getPerformanceIcon(member.performance)}
                      <span className="ml-1">{member.performance}</span>
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{formatPercentage(member.performanceRate)}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.deals}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${
                          member.conversion >= 80 ? 'bg-green-500' : 
                          member.conversion >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(member.conversion, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatPercentage(member.conversion)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Résumé en bas */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">7</div>
            <div className="text-sm text-gray-500">Commerciaux</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(2770000)}</div>
            <div className="text-sm text-gray-500">CA Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">84.1%</div>
            <div className="text-sm text-gray-500">Conversion Moyenne</div>
          </div>
        </div>
      </div>

      {/* Modal de détails */}
      <SalespersonDetailModal
        salesperson={selectedSalesperson}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
