import React from 'react';
import { X, MapPin, DollarSign, Target, TrendingUp, Building2, Plane, Ship } from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/formatters';
import type { GeographicData } from '../types/crm';

interface GeographicModalProps {
  country: GeographicData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GeographicModal: React.FC<GeographicModalProps> = ({ 
  country, 
  isOpen, 
  onClose 
}) => {
  if (!isOpen || !country) return null;

  const getCountryFlag = (countryName: string) => {
    const flags: { [key: string]: string } = {
      'France': '🇫🇷',
      'Allemagne': '🇩🇪',
      'Espagne': '🇪🇸',
      'Italie': '🇮🇹',
      'Belgique': '🇧🇪',
      'Pays-Bas': '🇳🇱',
      'Suisse': '🇨🇭',
      'Royaume-Uni': '🇬🇧',
      'Maroc': '🇲🇦'
    };
    return flags[countryName] || '🌍';
  };

  const getCountryColor = (countryName: string) => {
    const colors: { [key: string]: string } = {
      'France': 'bg-blue-100 text-blue-800',
      'Allemagne': 'bg-yellow-100 text-yellow-800',
      'Espagne': 'bg-red-100 text-red-800',
      'Italie': 'bg-green-100 text-green-800',
      'Belgique': 'bg-orange-100 text-orange-800',
      'Pays-Bas': 'bg-purple-100 text-purple-800',
      'Suisse': 'bg-red-100 text-red-800',
      'Royaume-Uni': 'bg-blue-100 text-blue-800',
      'Maroc': 'bg-green-100 text-green-800'
    };
    return colors[countryName] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="text-3xl mr-3">{getCountryFlag(country.country)}</span>
                  {country.country}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCountryColor(country.country)}`}>
                    Marché actif
                  </span>
                  <span className="text-sm text-gray-500">• {country.deals} affaires</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Chiffre d'Affaires</p>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(country.revenue)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  +15.2% vs année dernière
                </span>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Nombre d'Affaires</p>
                  <p className="text-2xl font-bold text-green-900">{country.deals}</p>
                </div>
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-green-600 mt-2">
                {formatCurrency(country.revenue / country.deals)} par affaire
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Part de Marché</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {((country.revenue / 3700000) * 100).toFixed(1)}%
                  </p>
                </div>
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-sm text-purple-600 mt-2">
                Du CA total
              </p>
            </div>
          </div>

          {/* Détails géographiques */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Informations Géographiques
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Coordonnées</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Latitude</span>
                      <span className="font-mono text-sm">{country.lat}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Longitude</span>
                      <span className="font-mono text-sm">{country.lng}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Zone</span>
                      <span className="text-sm font-medium">
                        {country.country === 'France' ? 'Europe de l\'Ouest' :
                         country.country === 'Allemagne' ? 'Europe Centrale' :
                         country.country === 'Espagne' ? 'Europe du Sud' :
                         country.country === 'Italie' ? 'Europe du Sud' :
                         country.country === 'Belgique' ? 'Europe de l\'Ouest' :
                         country.country === 'Pays-Bas' ? 'Europe du Nord' :
                         country.country === 'Suisse' ? 'Europe Centrale' :
                         country.country === 'Royaume-Uni' ? 'Europe du Nord' :
                         'Afrique du Nord'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Informations Marché</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Devise</span>
                      <span className="text-sm font-medium">
                        {country.country === 'Royaume-Uni' ? 'GBP' : 'EUR'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Langue</span>
                      <span className="text-sm font-medium">
                        {country.country === 'Allemagne' ? 'Allemand' :
                         country.country === 'Espagne' ? 'Espagnol' :
                         country.country === 'Italie' ? 'Italien' :
                         country.country === 'Pays-Bas' ? 'Néerlandais' :
                         country.country === 'Suisse' ? 'Français/Allemand' :
                         country.country === 'Royaume-Uni' ? 'Anglais' :
                         country.country === 'Maroc' ? 'Arabe/Français' :
                         'Français'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Fuseau horaire</span>
                      <span className="text-sm font-medium">
                        {country.country === 'Royaume-Uni' ? 'GMT+0' :
                         country.country === 'Maroc' ? 'GMT+1' :
                         'GMT+1'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Répartition des services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Répartition des Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Plane className="w-5 h-5 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-900">
                    {Math.floor(country.deals * 0.4)}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">Transport International</p>
                <p className="text-xs text-blue-600 mt-1">{formatCurrency(country.revenue * 0.4)}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Ship className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-900">
                    {Math.floor(country.deals * 0.3)}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">Transport National</p>
                <p className="text-xs text-green-600 mt-1">{formatCurrency(country.revenue * 0.3)}</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="w-5 h-5 text-orange-600" />
                  <span className="text-2xl font-bold text-orange-900">
                    {Math.floor(country.deals * 0.2)}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">Stockage</p>
                <p className="text-xs text-orange-600 mt-1">{formatCurrency(country.revenue * 0.2)}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-900">
                    {Math.floor(country.deals * 0.1)}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">Parking</p>
                <p className="text-xs text-purple-600 mt-1">{formatCurrency(country.revenue * 0.1)}</p>
              </div>
            </div>
          </div>

          {/* Top clients dans ce pays */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-orange-600" />
              Top Clients dans {country.country}
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">
                      {country.country === 'France' ? 'Yazaki Corporation' :
                       country.country === 'Allemagne' ? 'TechMaroc Industries' :
                       country.country === 'Espagne' ? 'Digital Dynamics' :
                       country.country === 'Italie' ? 'Mediterranean Logistics' :
                       country.country === 'Belgique' ? 'Benelux Transport' :
                       country.country === 'Pays-Bas' ? 'Dutch Logistics' :
                       country.country === 'Suisse' ? 'Alpine Transport' :
                       country.country === 'Royaume-Uni' ? 'British Logistics' :
                       'Maroc Transport'}
                    </p>
                    <p className="text-sm text-gray-500">Enterprise • {country.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(country.revenue * 0.3)}</p>
                    <p className="text-sm text-gray-500">{Math.floor(country.deals * 0.4)} affaires</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">
                      {country.country === 'France' ? 'Global Logistics' :
                       country.country === 'Allemagne' ? 'German Transport' :
                       country.country === 'Espagne' ? 'Iberian Logistics' :
                       country.country === 'Italie' ? 'Italian Transport' :
                       country.country === 'Belgique' ? 'Belgian Logistics' :
                       country.country === 'Pays-Bas' ? 'Netherlands Transport' :
                       country.country === 'Suisse' ? 'Swiss Logistics' :
                       country.country === 'Royaume-Uni' ? 'UK Transport' :
                       'Atlas Logistics'}
                    </p>
                    <p className="text-sm text-gray-500">SMB • {country.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(country.revenue * 0.25)}</p>
                    <p className="text-sm text-gray-500">{Math.floor(country.deals * 0.3)} affaires</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {country.country === 'France' ? 'StartupVision' :
                       country.country === 'Allemagne' ? 'German Startup' :
                       country.country === 'Espagne' ? 'Spanish Startup' :
                       country.country === 'Italie' ? 'Italian Startup' :
                       country.country === 'Belgique' ? 'Belgian Startup' :
                       country.country === 'Pays-Bas' ? 'Dutch Startup' :
                       country.country === 'Suisse' ? 'Swiss Startup' :
                       country.country === 'Royaume-Uni' ? 'UK Startup' :
                       'Moroccan Startup'}
                    </p>
                    <p className="text-sm text-gray-500">Startup • {country.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(country.revenue * 0.2)}</p>
                    <p className="text-sm text-gray-500">{Math.floor(country.deals * 0.2)} affaires</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Évolution temporelle */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Évolution du Marché
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Part estimée (mois)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(country.revenue * 0.08)}
                  </p>
                  <p className="text-xs text-gray-500">Dérivée du CA zone (pas d&apos;historique mensuel stocké)</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Part estimée (trimestre)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(country.revenue * 0.25)}
                  </p>
                  <p className="text-xs text-gray-500">Même logique de répartition que la colonne précédente</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">CA zone (données app)</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(country.revenue)}</p>
                  <p className="text-xs text-gray-500">Comparaisons YoY : non disponibles sans série temporelle</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
