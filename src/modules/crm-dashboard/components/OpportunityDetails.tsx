import React, { useState } from 'react';
import { Eye, EyeOff, ChevronDown, ChevronUp, MapPin, Calendar, DollarSign } from 'lucide-react';
import type { OpportunityDetails } from '../types/crm';

interface OpportunityDetailsProps {
  opportunities: OpportunityDetails[];
  onOpportunityClick?: (opportunity: OpportunityDetails) => void;
}

export const OpportunityDetailsComponent: React.FC<OpportunityDetailsProps> = ({ opportunities, onOpportunityClick }) => {
  const [expandedOpportunity, setExpandedOpportunity] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);

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

  if (!showDetails) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Détails des Opportunités</h3>
          <button
            onClick={() => setShowDetails(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir les détails
          </button>
        </div>
        <div className="text-center text-gray-500">
          <p>Cliquez sur "Voir les détails" pour explorer les opportunités</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Détails des Opportunités</h3>
        <button
          onClick={() => setShowDetails(false)}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <EyeOff className="w-4 h-4 mr-2" />
          Masquer
        </button>
      </div>

      <div className="space-y-4">
        {opportunities.map((opportunity) => (
          <div 
            key={opportunity.id} 
            className={`border border-gray-200 rounded-lg p-4 ${onOpportunityClick ? 'cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors' : ''}`}
            onClick={() => onOpportunityClick?.(opportunity)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <h4 className="font-semibold text-gray-900">{opportunity.client_name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(opportunity.status)}`}>
                    {getStatusLabel(opportunity.status)}
                  </span>
                  <span className="text-sm text-gray-500">{opportunity.category}</span>
                </div>
                <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {opportunity.value.toLocaleString()} €
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(opportunity.created_date).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {opportunity.probability}% probabilité
                  </div>
                </div>
              </div>
              <button
                onClick={() => setExpandedOpportunity(
                  expandedOpportunity === opportunity.id ? null : opportunity.id
                )}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                {expandedOpportunity === opportunity.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>

            {expandedOpportunity === opportunity.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="font-medium text-gray-900 mb-3">Détails des Services</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Transport International</p>
                    <p className="text-lg font-bold text-blue-900">{opportunity.services.transport_international}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Transport National</p>
                    <p className="text-lg font-bold text-green-900">{opportunity.services.transport_national}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-sm text-orange-600 font-medium">Stockage</p>
                    <p className="text-lg font-bold text-orange-900">{opportunity.services.stockage}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">Parking</p>
                    <p className="text-lg font-bold text-purple-900">{opportunity.services.parking}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
