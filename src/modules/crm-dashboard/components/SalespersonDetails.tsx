import React, { useState } from 'react';
import { Eye, EyeOff, ChevronDown, ChevronUp, User, TrendingUp, Target, AlertCircle } from 'lucide-react';
import type { SalespersonDetails } from '../types/crm';

interface SalespersonDetailsProps {
  salespeople: SalespersonDetails[];
}

export const SalespersonDetailsComponent: React.FC<SalespersonDetailsProps> = ({ salespeople }) => {
  const [expandedSalesperson, setExpandedSalesperson] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (achieved: number, total: number) => {
    const ratio = achieved / total;
    if (ratio >= 0.8) return 'text-green-600';
    if (ratio >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!showDetails) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Détails Équipe Commerciale</h3>
          <button
            onClick={() => setShowDetails(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir les détails
          </button>
        </div>
        <div className="text-center text-gray-500">
          <p>Cliquez sur "Voir les détails" pour explorer les performances</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Détails Équipe Commerciale</h3>
        <button
          onClick={() => setShowDetails(false)}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <EyeOff className="w-4 h-4 mr-2" />
          Masquer
        </button>
      </div>

      <div className="space-y-4">
        {salespeople.map((salesperson) => (
          <div key={salesperson.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <h4 className="font-semibold text-gray-900">{salesperson.name}</h4>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {salesperson.total_deals} affaires
                  </span>
                </div>
                <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {salesperson.revenue.toLocaleString()} €
                  </div>
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    +{salesperson.revenue_growth}% croissance
                  </div>
                </div>
              </div>
              <button
                onClick={() => setExpandedSalesperson(
                  expandedSalesperson === salesperson.id ? null : salesperson.id
                )}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                {expandedSalesperson === salesperson.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>

            {expandedSalesperson === salesperson.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                {/* Pipeline des affaires */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Pipeline des Affaires</h5>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-blue-600 font-medium">Prospects</p>
                      <p className="text-lg font-bold text-blue-900">{salesperson.prospects}</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-yellow-600 font-medium">Qualification</p>
                      <p className="text-lg font-bold text-yellow-900">{salesperson.qualification}</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-orange-600 font-medium">Devis</p>
                      <p className="text-lg font-bold text-orange-900">{salesperson.devis}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-purple-600 font-medium">Négociation</p>
                      <p className="text-lg font-bold text-purple-900">{salesperson.negociation}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-green-600 font-medium">Signature</p>
                      <p className="text-lg font-bold text-green-900">{salesperson.signature}</p>
                    </div>
                  </div>
                  {salesperson.perdu > 0 && (
                    <div className="mt-3 bg-red-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-red-600 font-medium">Perdu</p>
                      <p className="text-lg font-bold text-red-900">{salesperson.perdu}</p>
                    </div>
                  )}
                </div>

                {/* Services */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Répartition par Services</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Transport International</p>
                      <p className="text-lg font-bold text-blue-900">{salesperson.services.transport_international}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Transport National</p>
                      <p className="text-lg font-bold text-green-900">{salesperson.services.transport_national}</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm text-orange-600 font-medium">Stockage</p>
                      <p className="text-lg font-bold text-orange-900">{salesperson.services.stockage}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm text-purple-600 font-medium">Parking</p>
                      <p className="text-lg font-bold text-purple-900">{salesperson.services.parking}</p>
                    </div>
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
