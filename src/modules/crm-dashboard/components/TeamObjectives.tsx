import React from 'react';
import { 
  Target, 
  TrendingUp, 
  CheckCircle,
  BarChart3,
  DollarSign,
  Award
} from 'lucide-react';

export const TeamObjectives: React.FC = () => {
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

  const objectiveCA = 2730000;
  const realizedCA = 2770000;
  const achievementRate = (realizedCA / objectiveCA) * 100;
  const isObjectiveAchieved = achievementRate >= 100;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Target className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Objectifs d'Équipe</h2>
            <p className="text-gray-600">Performance par rapport aux objectifs fixés</p>
          </div>
        </div>
        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isObjectiveAchieved 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isObjectiveAchieved ? (
            <CheckCircle className="w-4 h-4 mr-1" />
          ) : (
            <Target className="w-4 h-4 mr-1" />
          )}
          {isObjectiveAchieved ? 'Objectif Atteint' : 'En Cours'}
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Objectif CA */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-600">Objectif CA</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(objectiveCA)}</p>
            </div>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>

        {/* CA Réalisé */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-green-600">CA Réalisé</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(realizedCA)}</p>
            </div>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(achievementRate, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Barre de progression principale */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Progression de l'Objectif</h3>
          <div className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${
              isObjectiveAchieved ? 'text-green-600' : 'text-orange-600'
            }`}>
              {formatPercentage(achievementRate)}
            </span>
            <span className="text-sm text-gray-500">de l'objectif</span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div 
            className={`h-4 rounded-full transition-all duration-1000 ${
              isObjectiveAchieved ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-orange-500 to-orange-600'
            }`}
            style={{ width: `${Math.min(achievementRate, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>0 €</span>
          <span className="font-medium">Objectif: {formatCurrency(objectiveCA)}</span>
          <span className="font-medium">Réalisé: {formatCurrency(realizedCA)}</span>
        </div>
      </div>

      {/* Détails de performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(realizedCA - objectiveCA)}
          </div>
          <div className="text-sm text-gray-600">Dépassement</div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <div className="flex items-center justify-center mb-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatPercentage(achievementRate - 100)}
          </div>
          <div className="text-sm text-gray-600">Au-dessus de l'objectif</div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <div className="flex items-center justify-center mb-2">
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {isObjectiveAchieved ? '100%' : formatPercentage(achievementRate)}
          </div>
          <div className="text-sm text-gray-600">Taux de Réussite</div>
        </div>
      </div>

      {/* Message de félicitations ou d'encouragement */}
      <div className={`mt-6 p-4 rounded-lg ${
        isObjectiveAchieved 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-orange-50 border border-orange-200'
      }`}>
        <div className="flex items-center">
          {isObjectiveAchieved ? (
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          ) : (
            <Target className="w-5 h-5 text-orange-600 mr-2" />
          )}
          <p className={`font-medium ${
            isObjectiveAchieved ? 'text-green-800' : 'text-orange-800'
          }`}>
            {isObjectiveAchieved 
              ? `🎉 Félicitations ! L'équipe a dépassé l'objectif de ${formatCurrency(realizedCA - objectiveCA)} !`
              : `L'équipe est à ${formatPercentage(100 - achievementRate)} de l'objectif. Continuez vos efforts !`
            }
          </p>
        </div>
      </div>
    </div>
  );
};
