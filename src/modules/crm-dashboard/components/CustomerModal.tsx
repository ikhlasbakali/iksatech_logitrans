import React from 'react';
import { X, Building2, TrendingUp, TrendingDown, Calendar, DollarSign, Star, Plane, Ship, MapPin, Award } from 'lucide-react';
import { formatCurrency, formatPercentage, formatDate, getGrowthColor } from '../utils/formatters';
import type { CustomerMetrics } from '../types/crm';

interface CustomerModalProps {
  customer: CustomerMetrics | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({ 
  customer, 
  isOpen, 
  onClose 
}) => {
  if (!isOpen || !customer) return null;

  const categoryColors = {
    Enterprise: 'bg-purple-100 text-purple-800',
    SMB: 'bg-blue-100 text-blue-800',
    Startup: 'bg-green-100 text-green-800'
  };

  const categoryIcons = {
    Enterprise: Award,
    SMB: Building2,
    Startup: TrendingUp
  };

  const CategoryIcon = categoryIcons[customer.category as keyof typeof categoryIcons] || Building2;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    categoryColors[customer.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    {customer.country}
                  </div>
                </div>
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
          {/* Métriques principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Chiffre d'Affaires</p>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(customer.revenue)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <div className={`flex items-center mt-2 ${getGrowthColor(customer.revenue_growth)}`}>
                {customer.revenue_growth > 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                  +{formatPercentage(customer.revenue_growth)}
                </span>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Commandes</p>
                  <p className="text-2xl font-bold text-green-900">{customer.orders_count}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-green-600 mt-2">
                {formatCurrency(customer.avg_order_value)} moyenne
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Voyages Total</p>
                  <p className="text-2xl font-bold text-purple-900">{customer.trips_count}</p>
                </div>
                <Plane className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex items-center justify-between mt-2 text-sm">
                <div className="flex items-center text-blue-600">
                  <Plane className="w-3 h-3 mr-1" />
                  {customer.import_trips} import
                </div>
                <div className="flex items-center text-green-600">
                  <Ship className="w-3 h-3 mr-1" />
                  {customer.export_trips} export
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Évaluation</p>
                  <p className="text-2xl font-bold text-orange-900">{customer.evaluation_score}/5</p>
                </div>
                <Star className="w-8 h-8 text-orange-600" />
              </div>
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(customer.evaluation_score) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Comparaison année précédente */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Comparaison Année Précédente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Chiffre d'Affaires</h4>
                  <div className={`flex items-center ${getGrowthColor(customer.revenue_growth)}`}>
                    {customer.revenue_growth > 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    <span className="font-medium">+{formatPercentage(customer.revenue_growth)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cette année</span>
                    <span className="font-semibold">{formatCurrency(customer.revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Année dernière</span>
                    <span className="font-semibold">{formatCurrency(customer.revenue_previous_year)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ 
                        width: `${Math.min((customer.revenue / customer.revenue_previous_year) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-medium text-gray-900 mb-4">Dernière Commande</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {formatDate(customer.last_order_date)}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(customer.avg_order_value)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Détails des services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" />
              Détails des Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Plane className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-medium text-gray-900">Transport International</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-900">{customer.import_trips}</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">Voyages d'import</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Ship className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-medium text-gray-900">Transport National</span>
                    </div>
                    <span className="text-2xl font-bold text-green-900">{customer.export_trips}</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">Voyages d'export</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="w-5 h-5 text-orange-600 mr-2" />
                      <span className="font-medium text-gray-900">Total Voyages</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-900">{customer.trips_count}</span>
                  </div>
                  <p className="text-sm text-orange-600 mt-1">Tous services confondus</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-purple-600 mr-2" />
                      <span className="font-medium text-gray-900">Satisfaction</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-purple-900">{customer.evaluation_score}</span>
                      <span className="text-sm text-purple-600 ml-1">/5</span>
                    </div>
                  </div>
                  <p className="text-sm text-purple-600 mt-1">Note client</p>
                </div>
              </div>
            </div>
          </div>

          {/* Historique des commandes (simulation) */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-orange-600" />
              Historique des Commandes
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Commande #CMD-2025-001</p>
                    <p className="text-sm text-gray-500">Transport International • 5 voyages</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(45000)}</p>
                    <p className="text-sm text-gray-500">{formatDate('2025-12-10')}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Commande #CMD-2025-002</p>
                    <p className="text-sm text-gray-500">Transport National • 3 voyages</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(28000)}</p>
                    <p className="text-sm text-gray-500">{formatDate('2025-11-28')}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">Commande #CMD-2025-003</p>
                    <p className="text-sm text-gray-500">Stockage • 2 unités</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(15000)}</p>
                    <p className="text-sm text-gray-500">{formatDate('2025-11-15')}</p>
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
