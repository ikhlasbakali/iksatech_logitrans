import React from 'react';
import { X, Users, DollarSign, Calendar, Building, Phone, Mail, TrendingUp, Target, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface PipelineDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PipelineDetailsModal: React.FC<PipelineDetailsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Données simulées pour le pipeline CRM
  const pipelineData = {
    totalValue: 37000,
    activeValue: 25000,
    lostValue: 12000,
    totalOpportunities: 45,
    activeOpportunities: 32,
    lostOpportunities: 13,
    conversionRate: 71.1,
    averageDealSize: 1028,
    averageSalesCycle: 28
  };

  const opportunities = [
    {
      id: '1',
      name: 'Contrat Transport International',
      company: 'Atlas Mécanique Maroc',
      value: 8500,
      probability: 85,
      expectedClose: '2025-10-15',
      salesperson: 'Nadia El Mansouri',
      stage: 'Négociation',
      contact: {
        name: 'Ahmed Benali',
        email: 'a.benali@atlas-meca.example',
        phone: '+212 6 12 34 56 78'
      }
    },
    {
      id: '2',
      name: 'Services Logistiques',
      company: 'YAZAKI MOROCCO',
      value: 6200,
      probability: 70,
      expectedClose: '2025-10-20',
      salesperson: 'Maha El Amri',
      stage: 'Proposition',
      contact: {
        name: 'Fatima Zahra',
        email: 'f.zahra@yazaki.ma',
        phone: '+212 6 23 45 67 89'
      }
    },
    {
      id: '3',
      name: 'Transport National',
      company: 'TRO TRANSPORT RAPIDE',
      value: 4800,
      probability: 60,
      expectedClose: '2025-10-25',
      salesperson: 'Fatiha El Hassany',
      stage: 'Qualification',
      contact: {
        name: 'Omar Alami',
        email: 'o.alami@tro.ma',
        phone: '+212 6 34 56 78 90'
      }
    },
    {
      id: '4',
      name: 'Services de Stockage',
      company: 'JACOB DELAFON',
      value: 3500,
      probability: 45,
      expectedClose: '2025-11-05',
      salesperson: 'Chaimae Chekrouni',
      stage: 'Prospection',
      contact: {
        name: 'Karim Idrissi',
        email: 'k.idrissi@jacob.com',
        phone: '+212 6 45 67 89 01'
      }
    },
    {
      id: '5',
      name: 'Transport Express',
      company: 'YAZAKI EUROPE',
      value: 2800,
      probability: 30,
      expectedClose: '2025-11-10',
      salesperson: 'Yousra Es-Selasy',
      stage: 'Prospection',
      contact: {
        name: 'Sara Bennani',
        email: 's.bennani@yazaki.eu',
        phone: '+212 6 56 78 90 12'
      }
    }
  ];

  const stages = [
    { name: 'Prospection', count: 8, value: 8500, color: 'bg-gray-500' },
    { name: 'Qualification', count: 12, value: 12000, color: 'bg-blue-500' },
    { name: 'Proposition', count: 8, value: 9500, color: 'bg-yellow-500' },
    { name: 'Négociation', count: 4, value: 8500, color: 'bg-orange-500' },
    { name: 'Fermé Gagné', count: 0, value: 0, color: 'bg-green-500' },
    { name: 'Fermé Perdu', count: 13, value: 12000, color: 'bg-red-500' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Pipeline CRM - Détails Complets</h2>
                <p className="text-orange-100">Analyse détaillée des opportunités commerciales</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Résumé du Pipeline */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
              Résumé du Pipeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-orange-700">Valeur Totale</p>
                    <p className="text-2xl font-bold text-orange-900 mt-1">
                      {formatCurrency(pipelineData.totalValue)}
                    </p>
                </div>
                  <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
                </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-700">Pipeline Actif</p>
                    <p className="text-2xl font-bold text-green-900 mt-1">
                      {formatCurrency(pipelineData.activeValue)}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      {pipelineData.activeOpportunities} opportunités
                    </p>
              </div>
                  <Target className="w-8 h-8 text-green-600" />
            </div>
          </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                <div className="flex items-center justify-between">
          <div>
                    <p className="text-sm font-semibold text-red-700">Pipeline Perdu</p>
                    <p className="text-2xl font-bold text-red-900 mt-1">
                      {formatCurrency(pipelineData.lostValue)}
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      {pipelineData.lostOpportunities} opportunités
                    </p>
                      </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                      </div>
                    </div>
                    </div>
                  </div>

          {/* Répartition par Étapes */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              Répartition par Étapes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stages.map((stage, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{stage.name}</span>
                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stage.count} opportunités
                    </div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(stage.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunités Actives */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-600" />
              Opportunités Actives
            </h3>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Opportunité
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entreprise
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valeur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Probabilité
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commercial
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Étape
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {opportunities.map((opp) => (
                      <tr key={opp.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{opp.name}</div>
                          <div className="text-sm text-gray-500">{opp.contact.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{opp.company}</div>
                          <div className="text-sm text-gray-500">{opp.contact.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(opp.value)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${opp.probability}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{opp.probability}%</span>
                      </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {opp.salesperson}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {opp.stage}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                      </div>
                    </div>
                    </div>

          {/* Statistiques Avancées */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
              Statistiques Avancées
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-indigo-700">Taux de Conversion</p>
                    <p className="text-2xl font-bold text-indigo-900 mt-1">
                      {formatPercentage(pipelineData.conversionRate)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-indigo-600" />
                    </div>
                    </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-700">Panier Moyen</p>
                    <p className="text-2xl font-bold text-purple-900 mt-1">
                      {formatCurrency(pipelineData.averageDealSize)}
                    </p>
                    </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
              
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-xl border border-cyan-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-cyan-700">Cycle de Vente Moyen</p>
                    <p className="text-2xl font-bold text-cyan-900 mt-1">
                      {pipelineData.averageSalesCycle} jours
                    </p>
                </div>
                  <Calendar className="w-8 h-8 text-cyan-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
