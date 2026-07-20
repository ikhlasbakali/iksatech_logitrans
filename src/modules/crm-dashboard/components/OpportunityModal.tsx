import React from 'react';
import { X, Building2, Calendar, DollarSign, Target, MapPin, TrendingUp, Package, Plane, Ship, Car } from 'lucide-react';
import { formatCurrency, formatPercentage, formatDate } from '../utils/formatters';
import type { OpportunityDetails } from '../types/crm';

interface OpportunityModalProps {
  opportunity: OpportunityDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OpportunityModal: React.FC<OpportunityModalProps> = ({ 
  opportunity, 
  isOpen, 
  onClose 
}) => {
  if (!isOpen || !opportunity) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'qualification': return 'bg-yellow-100 text-yellow-800';
      case 'devis': return 'bg-orange-100 text-orange-800';
      case 'negociation': return 'bg-purple-100 text-purple-800';
      case 'signature': return 'bg-green-100 text-green-800';
      case 'perdu': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'prospect': return 'Prospect';
      case 'qualification': return 'Qualification';
      case 'devis': return 'Devis';
      case 'negociation': return 'Négociation';
      case 'signature': return 'Signature';
      case 'perdu': return 'Perdu';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'prospect': return Target;
      case 'qualification': return TrendingUp;
      case 'devis': return DollarSign;
      case 'negociation': return Building2;
      case 'signature': return Target;
      case 'perdu': return X;
      default: return Target;
    }
  };

  const StatusIcon = getStatusIcon(opportunity.status);

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
                <h2 className="text-2xl font-bold text-gray-900">{opportunity.client_name}</h2>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(opportunity.status)}`}>
                    <StatusIcon className="w-3 h-3 inline mr-1" />
                    {getStatusLabel(opportunity.status)}
                  </span>
                  <span className="text-sm text-gray-500">• {opportunity.category}</span>
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
                  <p className="text-sm font-medium text-blue-600">Valeur de l'Opportunité</p>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(opportunity.value)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex items-center mt-2">
                <Target className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  {formatPercentage(opportunity.probability)} probabilité
                </span>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Date de Création</p>
                  <p className="text-lg font-bold text-green-900">
                    {formatDate(opportunity.created_date)}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm text-green-600 mt-2">
                {Math.floor((new Date().getTime() - new Date(opportunity.created_date).getTime()) / (1000 * 60 * 60 * 24))} jours
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Total Services</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {opportunity.services.transport_international + 
                     opportunity.services.transport_national + 
                     opportunity.services.stockage + 
                     opportunity.services.parking}
                  </p>
                </div>
                <Package className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-sm text-purple-600 mt-2">
                Services commandés
              </p>
            </div>
          </div>

          {/* Détails des services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              Détails des Services Commandés
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Plane className="w-5 h-5 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-900">
                    {opportunity.services.transport_international}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">Transport International</p>
                <p className="text-xs text-blue-600 mt-1">Voyages internationaux</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Car className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-900">
                    {opportunity.services.transport_national}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">Transport National</p>
                <p className="text-xs text-green-600 mt-1">Voyages nationaux</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Package className="w-5 h-5 text-orange-600" />
                  <span className="text-2xl font-bold text-orange-900">
                    {opportunity.services.stockage}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">Stockage</p>
                <p className="text-xs text-orange-600 mt-1">Unités de stockage</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-900">
                    {opportunity.services.parking}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">Parking</p>
                <p className="text-xs text-purple-600 mt-1">Places de parking</p>
              </div>
            </div>
          </div>

          {/* Timeline du processus */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-orange-600" />
              Timeline du Processus Commercial
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Prospect identifié</p>
                    <p className="text-sm text-gray-500">Premier contact avec {opportunity.client_name}</p>
                  </div>
                  <span className="text-sm text-gray-400">{formatDate(opportunity.created_date)}</span>
                </div>
                
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-4 ${
                    ['qualification', 'devis', 'negociation', 'signature'].includes(opportunity.status) 
                      ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Qualification</p>
                    <p className="text-sm text-gray-500">Évaluation des besoins et budget</p>
                  </div>
                  <span className="text-sm text-gray-400">En cours</span>
                </div>

                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-4 ${
                    ['devis', 'negociation', 'signature'].includes(opportunity.status) 
                      ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Devis établi</p>
                    <p className="text-sm text-gray-500">Proposition commerciale détaillée</p>
                  </div>
                  <span className="text-sm text-gray-400">En cours</span>
                </div>

                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-4 ${
                    ['negociation', 'signature'].includes(opportunity.status) 
                      ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Négociation</p>
                    <p className="text-sm text-gray-500">Discussion des termes et conditions</p>
                  </div>
                  <span className="text-sm text-gray-400">En cours</span>
                </div>

                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-4 ${
                    opportunity.status === 'signature' ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Signature</p>
                    <p className="text-sm text-gray-500">Contrat signé et projet lancé</p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {opportunity.status === 'signature' ? 'Terminé' : 'En attente'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Informations complémentaires */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-green-600" />
              Informations Complémentaires
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Contact Principal</h4>
                <p className="text-sm text-gray-600">Responsable Logistique</p>
                <p className="text-sm text-gray-600">+33 1 23 45 67 89</p>
                <p className="text-sm text-gray-600">contact@{opportunity.client_name.toLowerCase().replace(/\s+/g, '')}.com</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Délais</h4>
                <p className="text-sm text-gray-600">Début prévu: {formatDate(opportunity.created_date)}</p>
                <p className="text-sm text-gray-600">Durée estimée: 3-6 mois</p>
                <p className="text-sm text-gray-600">Période de facturation: Mensuelle</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
