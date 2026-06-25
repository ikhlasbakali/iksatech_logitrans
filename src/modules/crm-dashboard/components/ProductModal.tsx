import React from 'react';
import { X, Package, TrendingUp, DollarSign, BarChart3, Target, Calendar, Award } from 'lucide-react';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/formatters';
import type { ProductPerformance } from '../types/crm';

interface ProductModalProps {
  product: ProductPerformance | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ 
  product, 
  isOpen, 
  onClose 
}) => {
  if (!isOpen || !product) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Transport': return 'bg-blue-100 text-blue-800';
      case 'Logistique': return 'bg-green-100 text-green-800';
      case 'Administratif': return 'bg-purple-100 text-purple-800';
      case 'Service': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Transport': return Package;
      case 'Logistique': return Target;
      case 'Administratif': return Award;
      case 'Service': return BarChart3;
      default: return Package;
    }
  };

  const CategoryIcon = getCategoryIcon(product.category);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <CategoryIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                    {product.category}
                  </span>
                  <span className="text-sm text-gray-500">• {product.quantity_sold} unités vendues</span>
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
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(product.revenue)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  +{formatPercentage(product.growth_rate)}
                </span>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Quantité Vendue</p>
                  <p className="text-2xl font-bold text-green-900">{formatNumber(product.quantity_sold)}</p>
                </div>
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-green-600 mt-2">
                Unités cette année
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Marge</p>
                  <p className="text-2xl font-bold text-purple-900">{formatPercentage(product.margin)}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-sm text-purple-600 mt-2">
                Rentabilité
              </p>
            </div>

            <div className="bg-orange-50 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Prix Moyen</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {formatCurrency(product.revenue / product.quantity_sold)}
                  </p>
                </div>
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-sm text-orange-600 mt-2">
                Par unité
              </p>
            </div>
          </div>

          {/* Détails du service */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              Détails du Service
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Description</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {product.category === 'Transport' && product.name.includes('International') 
                      ? 'Service de transport international complet incluant la logistique douanière, le suivi en temps réel et la gestion des documents d\'expédition.'
                      : product.category === 'Transport' && product.name.includes('National')
                      ? 'Service de transport national avec livraison rapide, suivi GPS et garantie de livraison dans les délais convenus.'
                      : product.category === 'Logistique' && product.name.includes('Stockage')
                      ? 'Service de stockage sécurisé avec gestion d\'inventaire, contrôle de température et accès 24h/24.'
                      : product.category === 'Logistique' && product.name.includes('Parking')
                      ? 'Service de parking surveillé avec accès contrôlé, vidéosurveillance et maintenance des véhicules.'
                      : 'Service administratif complet incluant la gestion des documents, le suivi des procédures et l\'assistance client.'
                    }
                  </p>
                  
                  <h4 className="font-medium text-gray-900 mb-3">Caractéristiques</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Service disponible 24h/24</li>
                    <li>• Support client dédié</li>
                    <li>• Suivi en temps réel</li>
                    <li>• Assurance incluse</li>
                    <li>• Formation utilisateur</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Satisfaction client</span>
                      <span className="text-sm font-medium text-green-600">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Taux de récurrence</span>
                      <span className="text-sm font-medium text-blue-600">87%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Délai moyen</span>
                      <span className="text-sm font-medium text-orange-600">2.5 jours</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Évolution des ventes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Évolution des Ventes
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Volume (période agrégée)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.floor(product.quantity_sold * 0.1)}
                  </p>
                  <p className="text-xs text-gray-500">Estimation partielle à partir du volume total</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Volume (trimestre estimé)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.floor(product.quantity_sold * 0.3)}
                  </p>
                  <p className="text-xs text-gray-500">Même base de comptage que la colonne précédente</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Volume total (données app)</p>
                  <p className="text-2xl font-bold text-gray-900">{product.quantity_sold}</p>
                  <p className="text-xs text-gray-500">
                    Tendance :{" "}
                    {product.growth_rate
                      ? formatPercentage(product.growth_rate)
                      : "non calculée (historique requis)"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top clients */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-orange-600" />
              Top Clients pour ce Service
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Yazaki Corporation</p>
                    <p className="text-sm text-gray-500">Enterprise • France</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(product.revenue * 0.25)}</p>
                    <p className="text-sm text-gray-500">{Math.floor(product.quantity_sold * 0.15)} unités</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">TechMaroc Industries</p>
                    <p className="text-sm text-gray-500">Enterprise • Maroc</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(product.revenue * 0.20)}</p>
                    <p className="text-sm text-gray-500">{Math.floor(product.quantity_sold * 0.12)} unités</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">Global Logistics</p>
                    <p className="text-sm text-gray-500">SMB • France</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(product.revenue * 0.18)}</p>
                    <p className="text-sm text-gray-500">{Math.floor(product.quantity_sold * 0.10)} unités</p>
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
