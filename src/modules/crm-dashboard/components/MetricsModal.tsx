import React from 'react';
import { X, DollarSign, TrendingUp, Target, Plane, Ship, AlertTriangle, BarChart3 } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import type { DashboardMetrics } from '../types/crm';

interface MetricsModalProps {
  metrics: DashboardMetrics | null;
  isOpen: boolean;
  onClose: () => void;
  currency: 'EUR' | 'DH';
}

export const MetricsModal: React.FC<MetricsModalProps> = ({ 
  metrics, 
  isOpen, 
  onClose,
  currency
}) => {
  if (!isOpen || !metrics) return null;

  const formatDH = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Détails des Métriques</h2>
                <p className="text-gray-600">Analyse complète des performances du tableau de bord</p>
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
          {/* Chiffres d'affaires détaillés */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
              Chiffres d'Affaires Détaillés
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currency === 'EUR' ? (
                <>
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600">EUR (HT)</span>
                      <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{formatCurrency(metrics.total_revenue_ht)}</p>
                    <p className="text-sm text-blue-600 mt-1">+{formatPercentage(metrics.revenue_growth)} vs mois dernier</p>
                  </div>

                  <div className="bg-green-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-600">EUR (TTC)</span>
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-900">{formatCurrency(metrics.total_revenue_ttc)}</p>
                    <p className="text-sm text-green-600 mt-1">TVA incluse</p>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-600">DH (MAD)</span>
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-900">{formatDH(metrics.total_revenue_dh)}</p>
                    <p className="text-sm text-purple-600 mt-1">+{formatPercentage(metrics.revenue_growth_previous_year)} vs année dernière</p>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-orange-600">Taux de Change</span>
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-orange-900">1 EUR = 10 MAD</p>
                    <p className="text-sm text-orange-600 mt-1">Taux approximatif</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-purple-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-600">DH (HT)</span>
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-900">{formatDH(metrics.total_revenue_dh)}</p>
                    <p className="text-sm text-purple-600 mt-1">+{formatPercentage(metrics.revenue_growth_previous_year)} vs année dernière</p>
                  </div>

                  <div className="bg-green-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-600">DH (TTC)</span>
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-900">{formatDH(metrics.total_revenue_dh * 1.2)}</p>
                    <p className="text-sm text-green-600 mt-1">TVA incluse</p>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600">EUR (MAD)</span>
                      <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{formatCurrency(metrics.total_revenue_ht)}</p>
                    <p className="text-sm text-blue-600 mt-1">+{formatPercentage(metrics.revenue_growth)} vs mois dernier</p>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-orange-600">Taux de Change</span>
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-orange-900">1 EUR = 10 MAD</p>
                    <p className="text-sm text-orange-600 mt-1">Taux approximatif</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Pipeline détaillé */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Pipeline CRM Détaillé
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-green-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-600">Pipeline Actif</span>
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {currency === 'DH' ? formatDH((metrics.pipeline_value - metrics.pipeline_lost) * 10) : formatCurrency(metrics.pipeline_value - metrics.pipeline_lost)}
                </p>
                <p className="text-sm text-green-600 mt-1">282 opportunités</p>
              </div>

              <div className="bg-red-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-600">Pipeline Perdu</span>
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-red-900">
                  {currency === 'DH' ? formatDH(metrics.pipeline_lost * 10) : formatCurrency(metrics.pipeline_lost)}
                </p>
                <p className="text-sm text-red-600 mt-1">Opportunités perdues</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600">Taux de Conversion</span>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-900">82.5%</p>
                <p className="text-sm text-blue-600 mt-1">232 affaires conclues</p>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-600">Panier Moyen</span>
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-900">
                  {currency === 'DH' ? formatDH(13167 * 10) : formatCurrency(13167)}
                </p>
                <p className="text-sm text-purple-600 mt-1">Par transaction</p>
              </div>
            </div>
          </div>

          {/* Voyages et transport */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Plane className="w-5 h-5 mr-2 text-blue-600" />
              Voyages et Transport
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600">Total Voyages</span>
                  <Plane className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-900">450</p>
                <p className="text-sm text-blue-600 mt-1">Tous services confondus</p>
              </div>

              <div className="bg-green-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-600">Import</span>
                  <Ship className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-900">280</p>
                <p className="text-sm text-green-600 mt-1">62.2% du total</p>
              </div>

              <div className="bg-orange-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-orange-600">Export</span>
                  <Plane className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-orange-900">170</p>
                <p className="text-sm text-orange-600 mt-1">37.8% du total</p>
              </div>
            </div>
          </div>

          {/* Comparaisons temporelles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Comparaisons Temporelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-medium text-gray-900 mb-4">Ce Mois vs Mois Dernier</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ce mois</span>
                    <span className="font-semibold">
                      {currency === 'DH' ? formatDH(2770000 * 10) : formatCurrency(2770000)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Mois dernier</span>
                    <span className="font-semibold">
                      {currency === 'DH' ? formatDH(2630000 * 10) : formatCurrency(2630000)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ 
                        width: `${Math.min((2770000 / 2630000) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-green-600">+5.2%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-medium text-gray-900 mb-4">Cette Année vs Année Dernière</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cette année</span>
                    <span className="font-semibold">
                      {currency === 'DH' ? formatDH(33240000 * 10) : formatCurrency(33240000)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Année dernière</span>
                    <span className="font-semibold">
                      {currency === 'DH' ? formatDH(3200000 * 10) : formatCurrency(3200000)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ 
                        width: `${Math.min((33240000 / 32000000) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-blue-600">+3.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Objectifs et évaluation */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-600" />
              Objectifs et Évaluation
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Taux d'Évaluation Objectif</h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-purple-500 h-3 rounded-full"
                          style={{ width: `${metrics.objective_evaluation_rate}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-purple-900">
                      {formatPercentage(metrics.objective_evaluation_rate)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Performance par rapport aux objectifs fixés
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Résumé des Performances</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Objectif CA mensuel</span>
                      <span className="text-sm font-medium text-green-600">✓ Atteint</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Objectif voyages</span>
                      <span className="text-sm font-medium text-green-600">✓ Dépassé</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Objectif conversion</span>
                      <span className="text-sm font-medium text-yellow-600">⚠ En cours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Objectif satisfaction</span>
                      <span className="text-sm font-medium text-green-600">✓ Excellent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
