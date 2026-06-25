import React from 'react';
import { 
  X, 
  User, 
  TrendingUp, 
  TrendingDown,
  Briefcase,
  Target,
  BarChart3,
  PieChart,
  DollarSign,
  Calendar,
  MapPin
} from 'lucide-react';

interface SalespersonDetail {
  name: string;
  initials: string;
  deals: number;
  revenue: number;
  growth: number;
  pipeline: {
    prospects: number;
    qualification: number;
    quotes: number;
    negotiation: number;
    signature: number;
    lost: number;
  };
  services: {
    transportInternational: number;
    transportNational: number;
    stockage: number;
    parking: number;
  };
}

interface SalespersonDetailModalProps {
  salesperson: SalespersonDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SalespersonDetailModal: React.FC<SalespersonDetailModalProps> = ({ 
  salesperson, 
  isOpen, 
  onClose 
}) => {
  if (!isOpen || !salesperson) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? 'text-green-600' : growth < 0 ? 'text-red-600' : 'text-gray-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? (
      <TrendingUp className="w-4 h-4" />
    ) : growth < 0 ? (
      <TrendingDown className="w-4 h-4" />
    ) : null;
  };

  const totalPipeline = Object.values(salesperson.pipeline).reduce((sum, value) => sum + value, 0);
  const totalServices = Object.values(salesperson.services).reduce((sum, value) => sum + value, 0);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mx-4 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-xl font-bold text-white">{salesperson.initials}</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{salesperson.name}</h3>
              <p className="text-gray-600">Détails Équipe Commerciale</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Affaires</p>
                <p className="text-2xl font-bold text-blue-900">{salesperson.deals}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Chiffre d'Affaires</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(salesperson.revenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Croissance</p>
                <div className="flex items-center">
                  <p className={`text-2xl font-bold ${getGrowthColor(salesperson.growth)}`}>
                    {formatPercentage(salesperson.growth)}
                  </p>
                  <div className={`ml-2 ${getGrowthColor(salesperson.growth)}`}>
                    {getGrowthIcon(salesperson.growth)}
                  </div>
                </div>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pipeline des Affaires */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Pipeline des Affaires
            </h4>
            <div className="space-y-3">
              {[
                { stage: 'Prospects', count: salesperson.pipeline.prospects, color: 'bg-blue-500' },
                { stage: 'Qualification', count: salesperson.pipeline.qualification, color: 'bg-yellow-500' },
                { stage: 'Devis', count: salesperson.pipeline.quotes, color: 'bg-orange-500' },
                { stage: 'Négociation', count: salesperson.pipeline.negotiation, color: 'bg-purple-500' },
                { stage: 'Signature', count: salesperson.pipeline.signature, color: 'bg-green-500' },
                { stage: 'Perdu', count: salesperson.pipeline.lost, color: 'bg-red-500' }
              ].map((item) => (
                <div key={item.stage} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${item.color} mr-3`}></div>
                    <span className="font-medium text-gray-900">{item.stage}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">{item.count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${totalPipeline > 0 ? (item.count / totalPipeline) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-blue-900">Total Pipeline</span>
                <span className="text-lg font-bold text-blue-900">{totalPipeline} affaires</span>
              </div>
            </div>
          </div>

          {/* Répartition par Services */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-green-600" />
              Répartition par Services
            </h4>
            <div className="space-y-3">
              {[
                { service: 'Transport International', count: salesperson.services.transportInternational, color: 'bg-blue-500' },
                { service: 'Transport National', count: salesperson.services.transportNational, color: 'bg-green-500' },
                { service: 'Stockage', count: salesperson.services.stockage, color: 'bg-purple-500' },
                { service: 'Parking', count: salesperson.services.parking, color: 'bg-orange-500' }
              ].map((item) => (
                <div key={item.service} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${item.color} mr-3`}></div>
                    <span className="font-medium text-gray-900">{item.service}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">{item.count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${totalServices > 0 ? (item.count / totalServices) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-900">Total Services</span>
                <span className="text-lg font-bold text-green-900">{totalServices} affaires</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Fermer
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Voir le Profil Complet
          </button>
        </div>
      </div>
    </div>
  );
};
