import React from 'react';
import { TrendingUp, TrendingDown, Calendar, DollarSign, BarChart3, Target } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface RevenueEvaluationProps {
  currentYearData: Array<{
    month: string;
    revenue: number;
    target: number;
  }>;
  previousYearData: Array<{
    month: string;
    revenue: number;
  }>;
  onDetailsClick?: () => void;
}

export const RevenueEvaluation: React.FC<RevenueEvaluationProps> = ({
  currentYearData,
  previousYearData,
  onDetailsClick
}) => {
  // Vérification des données
  if (!currentYearData || !previousYearData || currentYearData.length === 0 || previousYearData.length === 0) {
    return null;
  }

  // Calculs des métriques
  const currentMonth = currentYearData[currentYearData.length - 1];
  const previousMonth = currentYearData[currentYearData.length - 2];
  const sameMonthLastYear = previousYearData[previousYearData.length - 1];
  
  const currentYearTotal = currentYearData.reduce((sum, month) => sum + month.revenue, 0);
  const previousYearTotal = previousYearData.reduce((sum, month) => sum + month.revenue, 0);
  const currentYearTarget = currentYearData.reduce((sum, month) => sum + month.target, 0);
  
  const monthOverMonthGrowth = previousMonth ? 
    ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100 : 0;
  
  const yearOverYearGrowth = sameMonthLastYear ? 
    ((currentMonth.revenue - sameMonthLastYear.revenue) / sameMonthLastYear.revenue) * 100 : 0;
  
  const yearOverYearTotalGrowth = previousYearTotal ? 
    ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100 : 0;
  
  const targetAchievement = currentYearTarget ? 
    (currentYearTotal / currentYearTarget) * 100 : 0;

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? 
      <TrendingUp className="w-4 h-4 text-green-600" /> : 
      <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-blue-100/50">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-slate-900 flex items-center">
          <BarChart3 className="w-7 h-7 mr-4 text-blue-600" />
          Évaluation du Chiffre d'Affaires
        </h3>
        {onDetailsClick && (
          <button
            onClick={onDetailsClick}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            Voir détails complets →
          </button>
        )}
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700">Ce Mois</p>
              <p className="text-3xl font-bold text-blue-900">
                {formatCurrency(currentMonth.revenue)}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-blue-600" />
          </div>
          <div className="flex items-center mt-3">
            {getGrowthIcon(monthOverMonthGrowth)}
            <span className={`text-sm font-bold ml-2 ${getGrowthColor(monthOverMonthGrowth)}`}>
              {formatPercentage(Math.abs(monthOverMonthGrowth))} vs mois dernier
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-700">Même Mois 2025</p>
              <p className="text-3xl font-bold text-green-900">
                {formatCurrency(sameMonthLastYear.revenue)}
              </p>
            </div>
            <Calendar className="w-10 h-10 text-green-600" />
          </div>
          <div className="flex items-center mt-3">
            {getGrowthIcon(yearOverYearGrowth)}
            <span className={`text-sm font-bold ml-2 ${getGrowthColor(yearOverYearGrowth)}`}>
              {formatPercentage(Math.abs(yearOverYearGrowth))} vs année dernière
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-2xl border border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-700">CA Année Courante</p>
              <p className="text-3xl font-bold text-purple-900">
                {formatCurrency(currentYearTotal)}
              </p>
            </div>
            <BarChart3 className="w-10 h-10 text-purple-600" />
          </div>
          <div className="flex items-center mt-3">
            {getGrowthIcon(yearOverYearTotalGrowth)}
            <span className={`text-sm font-bold ml-2 ${getGrowthColor(yearOverYearTotalGrowth)}`}>
              {formatPercentage(Math.abs(yearOverYearTotalGrowth))} vs 2025
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-6 rounded-2xl border border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-orange-700">Objectif Année</p>
              <p className="text-3xl font-bold text-orange-900">
                {formatCurrency(currentYearTarget)}
              </p>
            </div>
            <Target className="w-10 h-10 text-orange-600" />
          </div>
          <div className="flex items-center mt-3">
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(targetAchievement, 100)}%` }}
              ></div>
            </div>
            <span className="text-sm font-bold text-orange-600 ml-3">
              {formatPercentage(targetAchievement)}
            </span>
          </div>
        </div>
      </div>


      {/* Analyse des tendances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Tendances Positives
          </h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Croissance mensuelle de {formatPercentage(Math.abs(monthOverMonthGrowth))}</li>
            <li>• Croissance annuelle de {formatPercentage(Math.abs(yearOverYearTotalGrowth))}</li>
            <li>• {currentYearData.filter(m => m.revenue > m.target).length} mois ont dépassé l'objectif</li>
            <li>• Performance moyenne de {formatPercentage(targetAchievement)} de l'objectif</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-orange-600" />
            Points d'Attention
          </h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• {currentYearData.filter(m => m.revenue < m.target).length} mois sous l'objectif</li>
            <li>• Écart moyen de {formatCurrency(currentYearTarget - currentYearTotal)} à l'objectif</li>
            <li>• Mois le plus faible : {currentYearData.reduce((min, month) => 
              month.revenue < min.revenue ? month : min
            ).month}</li>
            <li>• Objectif restant : {formatCurrency(Math.max(0, currentYearTarget - currentYearTotal))}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
