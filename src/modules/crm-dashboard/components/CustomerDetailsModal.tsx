import React from 'react';
import { X, Building2, MapPin, Calendar, TrendingUp, TrendingDown, Plane, Ship, Star, Euro, Users, Target, Award } from 'lucide-react';
import { formatCurrency, formatDate, formatPercentage, getGrowthColor } from '../utils/formatters';
import type { CustomerMetrics } from '../types/crm';

interface CustomerDetailsModalProps {
  customer: CustomerMetrics | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  customer,
  isOpen,
  onClose
}) => {
  if (!isOpen || !customer) return null;

  const formatDH = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Automobile': 'bg-blue-100 text-blue-800 border-blue-200',
      'Logistique': 'bg-green-100 text-green-800 border-green-200',
      'Céramique': 'bg-orange-100 text-orange-800 border-orange-200',
      'Transport': 'bg-purple-100 text-purple-800 border-purple-200',
      'Sanitaire': 'bg-pink-100 text-pink-800 border-pink-200',
      'Design': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 mr-4" />
              <div>
                <h2 className="text-2xl font-bold">{customer.name}</h2>
                <p className="text-blue-100">Détails Client - #{customer.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200/50">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Informations Générales
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">Catégorie:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getCategoryColor(customer.category)}`}>
                    {customer.category}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">Pays:</span>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">{customer.country}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">Dernière commande:</span>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">{formatDate(customer.last_order_date)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border border-green-200/50">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <Euro className="w-5 h-5 mr-2" />
                Performance Financière
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">CA Total (EUR):</span>
                  <span className="text-lg font-bold text-green-900">{formatCurrency(customer.revenue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">CA Total (DH):</span>
                  <span className="text-lg font-bold text-green-900">{formatDH(customer.revenue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">Croissance:</span>
                  <div className={`flex items-center ${getGrowthColor(customer.revenue_growth)}`}>
                    {customer.revenue_growth > 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    <span className="font-bold">+{formatPercentage(customer.revenue_growth)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">CA Année Précédente:</span>
                  <span className="text-sm font-semibold text-green-800">{formatCurrency(customer.revenue_previous_year)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Commandes et Voyages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-2xl border border-purple-200/50">
              <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Commandes
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-700">Total Commandes:</span>
                  <span className="text-xl font-bold text-purple-900">{customer.orders_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-700">Panier Moyen:</span>
                  <span className="text-lg font-bold text-purple-900">{formatCurrency(customer.avg_order_value)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-700">Total Voyages:</span>
                  <span className="text-lg font-bold text-purple-900">{customer.trips_count}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-6 rounded-2xl border border-orange-200/50">
              <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                <Plane className="w-5 h-5 mr-2" />
                Répartition Voyages
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-700">Import:</span>
                  <div className="flex items-center">
                    <Plane className="w-4 h-4 mr-1 text-orange-600" />
                    <span className="text-lg font-bold text-orange-900">{customer.import_trips}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-700">Export:</span>
                  <div className="flex items-center">
                    <Ship className="w-4 h-4 mr-1 text-orange-600" />
                    <span className="text-lg font-bold text-orange-900">{customer.export_trips}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-700">Taux Import:</span>
                  <span className="text-sm font-semibold text-orange-800">
                    {formatPercentage((customer.import_trips / customer.trips_count) * 100)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Évaluation et Performance */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-6 rounded-2xl border border-indigo-200/50">
            <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Évaluation et Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-yellow-500 mr-1" />
                  <span className="text-2xl font-bold text-indigo-900">{customer.evaluation_score}</span>
                  <span className="text-sm text-indigo-600 ml-1">/5</span>
                </div>
                <p className="text-sm font-medium text-indigo-700">Note Client</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-900 mb-2">
                  {formatPercentage(customer.revenue_growth)}
                </div>
                <p className="text-sm font-medium text-indigo-700">Croissance Annuelle</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-900 mb-2">
                  {customer.orders_count}
                </div>
                <p className="text-sm font-medium text-indigo-700">Commandes Actives</p>
              </div>
            </div>
          </div>

          {/* Graphique de performance */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-2xl border border-slate-200/50">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Évolution des Performances
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">CA 2025:</span>
                <div className="flex items-center">
                  <div className="w-32 bg-slate-200 rounded-full h-3 mr-3">
                    <div 
                      className="bg-slate-400 h-3 rounded-full" 
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{formatCurrency(customer.revenue_previous_year)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">CA 2025:</span>
                <div className="flex items-center">
                  <div className="w-32 bg-slate-200 rounded-full h-3 mr-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" 
                      style={{ width: `${(customer.revenue / customer.revenue_previous_year) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{formatCurrency(customer.revenue)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
