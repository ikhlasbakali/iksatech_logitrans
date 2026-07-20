import React from 'react';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Clock, 
  Award,
  CheckCircle,
  BarChart3
} from 'lucide-react';

export const TeamMetrics: React.FC = () => {
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

  return (
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
  );
};
