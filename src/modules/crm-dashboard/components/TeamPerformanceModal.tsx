import React from 'react';
import { X, Users, TrendingUp, Target, Award, BarChart3, Calendar, DollarSign, Star } from 'lucide-react';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/formatters';
import type { SalespersonPerformance } from '../types/crm';

interface TeamPerformanceModalProps {
  salespeople: SalespersonPerformance[];
  isOpen: boolean;
  onClose: () => void;
}

export const TeamPerformanceModal: React.FC<TeamPerformanceModalProps> = ({ 
  salespeople, 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;

  // Calculs des métriques d'équipe
  const totalRevenue = salespeople.reduce((sum, person) => sum + person.revenue_achieved, 0);
  const totalTarget = salespeople.reduce((sum, person) => sum + person.revenue_target, 0);
  const totalDeals = salespeople.reduce((sum, person) => sum + person.deals_closed, 0);
  const totalDealsTarget = salespeople.reduce((sum, person) => sum + person.deals_total, 0);
  const avgConversionRate = salespeople.reduce((sum, person) => sum + person.conversion_rate, 0) / salespeople.length;
  const avgDealTime = salespeople.reduce((sum, person) => sum + person.avg_deal_time, 0) / salespeople.length;

  const topPerformer = salespeople.reduce((top, person) => 
    person.revenue_achieved > top.revenue_achieved ? person : top
  );

  const getPerformanceColor = (achieved: number, target: number) => {
    const ratio = achieved / target;
    if (ratio >= 1.1) return 'text-green-600';
    if (ratio >= 0.9) return 'text-blue-600';
    if (ratio >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceLevel = (achieved: number, target: number) => {
    const ratio = achieved / target;
    if (ratio >= 1.1) return 'Excellent';
    if (ratio >= 0.9) return 'Bon';
    if (ratio >= 0.7) return 'Moyen';
    return 'À améliorer';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Performance Équipe Commerciale</h2>
                <p className="text-gray-600">Analyse détaillée de l'équipe de {salespeople.length} commerciaux</p>
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
          {/* Métriques d'équipe */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Métriques d'Équipe
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">CA Total Équipe</p>
                    <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">
                    {formatPercentage((totalRevenue / totalTarget) * 100)} de l'objectif
                  </span>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Affaires Conclues</p>
                    <p className="text-2xl font-bold text-green-900">{totalDeals}</p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm text-green-600 mt-2">
                  {formatPercentage((totalDeals / totalDealsTarget) * 100)} du total
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Taux Conversion Moyen</p>
                    <p className="text-2xl font-bold text-purple-900">{formatPercentage(avgConversionRate)}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-sm text-purple-600 mt-2">
                  Performance équipe
                </p>
              </div>

              <div className="bg-orange-50 p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Délai Moyen</p>
                    <p className="text-2xl font-bold text-orange-900">{avgDealTime.toFixed(0)} jours</p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
                <p className="text-sm text-orange-600 mt-2">
                  Par affaire
                </p>
              </div>
            </div>
          </div>

          {/* Top performer */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-600" />
              Top Performer
            </h3>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{topPerformer.name}</h4>
                    <p className="text-sm text-gray-600">Meilleure performance de l'équipe</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(topPerformer.revenue_achieved)}</p>
                  <p className="text-sm text-green-600">
                    +{formatPercentage(((topPerformer.revenue_achieved - topPerformer.revenue_target) / topPerformer.revenue_target) * 100)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Classement détaillé */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-600" />
              Classement Détaillé de l'Équipe
            </h3>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rang
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commercial
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CA Réalisé
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Objectif
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Affaires
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conversion
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salespeople
                      .sort((a, b) => b.revenue_achieved - a.revenue_achieved)
                      .map((person, index) => {
                        const performanceRatio = (person.revenue_achieved / person.revenue_target) * 100;
                        const isTopPerformer = person.name === topPerformer.name;
                        
                        return (
                          <tr key={person.id} className={isTopPerformer ? 'bg-yellow-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {index === 0 && <Award className="w-4 h-4 text-yellow-500 mr-2" />}
                                <span className={`text-sm font-bold ${
                                  index === 0 ? 'text-yellow-600' : 
                                  index === 1 ? 'text-gray-600' : 
                                  index === 2 ? 'text-orange-600' : 'text-gray-500'
                                }`}>
                                  #{index + 1}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-blue-600 font-medium text-sm">
                                    {person.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{person.name}</div>
                                  <div className="text-sm text-gray-500">
                                    {getPerformanceLevel(person.revenue_achieved, person.revenue_target)}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {formatCurrency(person.revenue_achieved)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {formatCurrency(person.revenue_target)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      performanceRatio >= 100 ? 'bg-green-500' :
                                      performanceRatio >= 80 ? 'bg-blue-500' :
                                      performanceRatio >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${Math.min(performanceRatio, 100)}%` }}
                                  ></div>
                                </div>
                                <span className={`text-sm font-medium ${getPerformanceColor(person.revenue_achieved, person.revenue_target)}`}>
                                  {formatPercentage(performanceRatio)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {person.deals_closed}/{person.deals_total}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {formatPercentage(person.conversion_rate)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Analyse des performances */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Analyse des Performances
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-medium text-gray-900 mb-4">Répartition des Performances</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Excellent (≥110%)</span>
                    <span className="text-sm font-medium text-green-600">
                      {salespeople.filter(p => (p.revenue_achieved / p.revenue_target) >= 1.1).length} commerciaux
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bon (90-109%)</span>
                    <span className="text-sm font-medium text-blue-600">
                      {salespeople.filter(p => (p.revenue_achieved / p.revenue_target) >= 0.9 && (p.revenue_achieved / p.revenue_target) < 1.1).length} commerciaux
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Moyen (70-89%)</span>
                    <span className="text-sm font-medium text-yellow-600">
                      {salespeople.filter(p => (p.revenue_achieved / p.revenue_target) >= 0.7 && (p.revenue_achieved / p.revenue_target) < 0.9).length} commerciaux
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">À améliorer (&lt;70%)</span>
                    <span className="text-sm font-medium text-red-600">
                      {salespeople.filter(p => (p.revenue_achieved / p.revenue_target) < 0.7).length} commerciaux
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-medium text-gray-900 mb-4">Objectifs d'Équipe</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Objectif CA</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(totalTarget)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CA Réalisé</span>
                    <span className="text-sm font-medium text-green-600">{formatCurrency(totalRevenue)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${Math.min((totalRevenue / totalTarget) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-green-600">
                      {formatPercentage((totalRevenue / totalTarget) * 100)} de l'objectif
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommandations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              Recommandations d'Équipe
            </h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Points Forts</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {topPerformer.name} excelle avec {formatPercentage(((topPerformer.revenue_achieved - topPerformer.revenue_target) / topPerformer.revenue_target) * 100)} au-dessus de l'objectif</li>
                    <li>• Taux de conversion moyen de {formatPercentage(avgConversionRate)}</li>
                    <li>• {salespeople.filter(p => (p.revenue_achieved / p.revenue_target) >= 1.0).length} commerciaux ont atteint leur objectif</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Axes d'Amélioration</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Accompagner {salespeople.filter(p => (p.revenue_achieved / p.revenue_target) < 0.7).length} commerciaux en difficulté</li>
                    <li>• Réduire le délai moyen de {avgDealTime.toFixed(0)} jours</li>
                    <li>• Atteindre 100% de l'objectif d'équipe</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
