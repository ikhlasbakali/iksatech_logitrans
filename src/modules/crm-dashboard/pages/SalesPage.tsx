import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Bell, 
  Settings,
  TrendingUp,
  Users,
  Target,
  Award,
  BarChart3,
  Eye,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface TeamMember {
  id: string;
  rank: number;
  initials: string;
  name: string;
  performance: string;
  revenue: number;
  target: number;
  performanceRate: number;
  deals: string;
  conversion: number;
}

export const SalesPage: React.FC = () => {
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  // Données de l'équipe commerciale
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      rank: 1,
      initials: 'AD',
      name: 'Nadia El Mansouri',
      performance: 'Bon',
      revenue: 630000,
      target: 600000,
      performanceRate: 105.0,
      deals: '63/75',
      conversion: 84.0
    },
    {
      id: '2',
      rank: 2,
      initials: 'MEA',
      name: 'Maha El Amri',
      performance: 'Excellent',
      revenue: 560000,
      target: 500000,
      performanceRate: 112.0,
      deals: '56/68',
      conversion: 82.4
    },
    {
      id: '3',
      rank: 3,
      initials: 'FEH',
      name: 'Fatiha El Hassany',
      performance: 'Bon',
      revenue: 430000,
      target: 400000,
      performanceRate: 107.5,
      deals: '43/52',
      conversion: 82.7
    },
    {
      id: '4',
      rank: 4,
      initials: 'CC',
      name: 'Chaimae Chekrouni',
      performance: 'Moyen',
      revenue: 400000,
      target: 450000,
      performanceRate: 88.9,
      deals: '40/48',
      conversion: 83.3
    },
    {
      id: '5',
      rank: 5,
      initials: 'YE',
      name: 'Yousra Es-Selasy',
      performance: 'Bon',
      revenue: 370000,
      target: 350000,
      performanceRate: 105.7,
      deals: '37/44',
      conversion: 84.1
    },
    {
      id: '6',
      rank: 6,
      initials: 'FA',
      name: 'Ferdaous Akdi',
      performance: 'Bon',
      revenue: 360000,
      target: 380000,
      performanceRate: 94.7,
      deals: '36/42',
      conversion: 85.7
    },
    {
      id: '7',
      rank: 7,
      initials: 'JB',
      name: 'Jaouhara Baha',
      performance: 'À améliorer',
      revenue: 20000,
      target: 50000,
      performanceRate: 40.0,
      deals: '2/5',
      conversion: 40.0
    }
  ];

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Bon': return 'bg-blue-100 text-blue-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'À améliorer': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-500';
      case 2: return 'bg-blue-400';
      case 3: return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Ventes</h1>
            <p className="text-gray-600 mt-2">Performance et suivi des ventes</p>
          </div>
        </div>

        {/* Actions Rapides */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Actions Rapides</h2>
              <p className="text-gray-600">Accès direct aux fonctions principales</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
              <Search className="w-6 h-6 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-900">Rechercher</span>
            </button>
            
            <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
              <Filter className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-sm font-medium text-green-900">Filtrer</span>
            </button>
            
            <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors">
              <Download className="w-6 h-6 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-purple-900">Exporter</span>
            </button>
            
            <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors">
              <RefreshCw className="w-6 h-6 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-orange-900">Actualiser</span>
            </button>
            
            <button className="flex flex-col items-center p-4 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors">
              <Bell className="w-6 h-6 text-red-600 mb-2" />
              <span className="text-sm font-medium text-red-900">Notifications</span>
            </button>
            
            <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
              <Settings className="w-6 h-6 text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Paramètres</span>
            </button>
          </div>
        </div>

        {/* Métriques d'Équipe */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Métriques d'Équipe</h2>
                <p className="text-gray-600">Performance globale de l'équipe commerciale</p>
              </div>
            </div>
          </div>

          {/* Métriques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* CA Total Équipe */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">CA Total Équipe</p>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(2770000)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700 font-medium">101.5% de l'objectif</span>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">+5.2%</span>
                </div>
              </div>
            </div>

            {/* Affaires Conclues */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-500 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">Affaires Conclues</p>
                  <p className="text-2xl font-bold text-green-900">277</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700 font-medium">82.9% du total</span>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">+12.3%</span>
                </div>
              </div>
            </div>

            {/* Taux Conversion Moyen */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-purple-600">Taux Conversion</p>
                  <p className="text-2xl font-bold text-purple-900">77.5%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700 font-medium">Performance équipe</span>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">+3.1%</span>
                </div>
              </div>
            </div>

            {/* Revenu Actuel */}
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-xl border border-cyan-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-cyan-500 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-cyan-600">Revenu Actuel</p>
                  <p className="text-2xl font-bold text-cyan-900">{formatCurrency(92333)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-cyan-700 font-medium">Aujourd'hui</span>
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                  <span className="text-sm font-medium">LIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performer */}
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-500 rounded-full">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-yellow-900">Top Performer</h3>
                  <p className="text-xl font-semibold text-yellow-800">Nadia El Mansouri</p>
                  <p className="text-sm text-yellow-700">Meilleure performance de l'équipe</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-yellow-900">{formatCurrency(630000)}</p>
                <div className="flex items-center justify-end text-green-600 mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">+5.0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Classement Détaillé de l'Équipe */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Classement Détaillé de l'Équipe</h2>
              <p className="text-gray-600">(Cliquez pour voir les détails)</p>
            </div>
            <button 
              onClick={() => setIsTeamModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Voir détails</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase tracking-wider">Rang</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase tracking-wider">Commercial</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase tracking-wider">CA Réalisé</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase tracking-wider">Objectif</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase tracking-wider">Affaires</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold ${getRankColor(member.rank)}`}>
                        #{member.rank}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-700">{member.initials}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900">{formatCurrency(member.revenue)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900">{formatCurrency(member.target)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(member.performance)}`}>
                          {member.performance}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{formatPercentage(member.performanceRate)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900">{member.deals}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900">{formatPercentage(member.conversion)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
