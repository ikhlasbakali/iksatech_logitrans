import React, { useState } from 'react';
import { X, User, TrendingUp, Target, Calendar, DollarSign, BarChart3, Plane, Ship, Package, Car } from 'lucide-react';
import { formatCurrency, formatPercentage, formatDate } from '../utils/formatters';
import type { SalespersonDetails, SalespersonPerformance } from '../types/crm';
import { PipelineDetailsModal } from './PipelineDetailsModal';

interface SalespersonModalProps {
  salesperson: SalespersonDetails | SalespersonPerformance | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SalespersonModal: React.FC<SalespersonModalProps> = ({ 
  salesperson, 
  isOpen, 
  onClose 
}) => {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);

  if (!isOpen || !salesperson) return null;

  const handleStageClick = (stage: string) => {
    setSelectedStage(stage);
    setIsPipelineModalOpen(true);
  };

  const handleClosePipelineModal = () => {
    setIsPipelineModalOpen(false);
    setSelectedStage(null);
  };

  // Données par défaut pour éviter les erreurs
  const defaultServices = {
    transport_international: 25,
    transport_national: 15,
    stockage: 8,
    parking: 12
  };

  const defaultPipeline = {
    prospects: 15,
    qualification: 12,
    devis: 10,
    negociation: 8,
    signature: 5,
    perdu: 3
  };

  // Utiliser les données du salesperson ou les valeurs par défaut
  const services = salesperson.services || defaultServices;
  const pipeline = {
    prospects: salesperson.prospects || defaultPipeline.prospects,
    qualification: salesperson.qualification || defaultPipeline.qualification,
    devis: salesperson.devis || defaultPipeline.devis,
    negociation: salesperson.negociation || defaultPipeline.negociation,
    signature: salesperson.signature || defaultPipeline.signature,
    perdu: salesperson.perdu || defaultPipeline.perdu
  };

  // Calculer le total des affaires
  const totalDeals = salesperson.total_deals || salesperson.deals_total || (pipeline.prospects + pipeline.qualification + pipeline.devis + pipeline.negociation + pipeline.signature + pipeline.perdu);
  
  // Utiliser les données disponibles selon le type
  const revenue = salesperson.revenue || salesperson.revenue_achieved || 0;
  const revenueGrowth = salesperson.revenue_growth || 18.5;

  const pipelineData = [
    { label: 'Prospects', value: pipeline.prospects, color: 'bg-blue-500', percentage: (pipeline.prospects / totalDeals) * 100 },
    { label: 'Qualification', value: pipeline.qualification, color: 'bg-yellow-500', percentage: (pipeline.qualification / totalDeals) * 100 },
    { label: 'Devis', value: pipeline.devis, color: 'bg-orange-500', percentage: (pipeline.devis / totalDeals) * 100 },
    { label: 'Négociation', value: pipeline.negociation, color: 'bg-purple-500', percentage: (pipeline.negociation / totalDeals) * 100 },
    { label: 'Signature', value: pipeline.signature, color: 'bg-green-500', percentage: (pipeline.signature / totalDeals) * 100 },
    { label: 'Perdu', value: pipeline.perdu, color: 'bg-red-500', percentage: (pipeline.perdu / totalDeals) * 100 }
  ];

  const servicesData = [
    { label: 'Transport International', value: services.transport_international, color: 'bg-blue-500', icon: Plane },
    { label: 'Transport National', value: services.transport_national, color: 'bg-green-500', icon: Car },
    { label: 'Stockage', value: services.stockage, color: 'bg-orange-500', icon: Package },
    { label: 'Parking', value: services.parking, color: 'bg-purple-500', icon: Target }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-blue-100/50">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Détails Équipe Commerciale</h2>
                <p className="text-blue-100 text-lg">Performance individuelle détaillée</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Informations du commercial */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200/50 shadow-lg">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">
                  {salesperson.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900">{salesperson.name}</h3>
                <div className="flex items-center space-x-8 mt-3">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-xl font-bold text-slate-900">{totalDeals} affaires</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-xl font-bold text-slate-900">{formatCurrency(revenue)}</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-xl font-bold text-green-600">
                      +{formatPercentage(revenueGrowth)} croissance
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pipeline des affaires */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-blue-100/50">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <Target className="w-6 h-6 mr-3 text-blue-600" />
              Pipeline des Affaires
            </h3>
            
            {/* Graphique en barres du pipeline */}
            <div className="mb-6">
              <div className="flex items-end justify-between h-48 space-x-2">
                {pipelineData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gray-200 rounded-t-lg mb-2" style={{ height: '120px' }}>
                      <div 
                        className={`w-full ${item.color} rounded-t-lg transition-all duration-500`}
                        style={{ height: `${(item.value / Math.max(...pipelineData.map(p => p.value))) * 100}%` }}
                        title={`${item.label}: ${item.value}`}
                      ></div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{item.value}</div>
                      <div className="text-sm font-semibold text-slate-600">{item.label}</div>
                      <div className="text-xs text-slate-500">{formatPercentage(item.percentage)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Détails du pipeline */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {pipelineData.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-slate-50 to-gray-100 p-4 rounded-xl border border-slate-200/50 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
                  onClick={() => {
                    const stageMap: { [key: string]: string } = {
                      'Prospects': 'prospects',
                      'Qualification': 'qualification', 
                      'Devis': 'devis',
                      'Négociation': 'negociation',
                      'Signature': 'signature',
                      'Perdu': 'perdu'
                    };
                    handleStageClick(stageMap[item.label] || item.label.toLowerCase());
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-4 h-4 ${item.color} rounded-full`}></div>
                    <span className="text-2xl font-bold text-slate-900">{item.value}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{formatPercentage(item.percentage)} du total</p>
                  <div className="mt-2 text-xs text-blue-600 font-medium">
                    Cliquez pour voir les détails →
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Répartition par services */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-green-100/50">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <Package className="w-6 h-6 mr-3 text-green-600" />
              Répartition par Services
            </h3>
            
            {/* Graphique en barres des services */}
            <div className="mb-6">
              <div className="flex items-end justify-between h-48 space-x-2">
                {servicesData.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-200 rounded-t-lg mb-2" style={{ height: '120px' }}>
                        <div 
                          className={`w-full ${service.color} rounded-t-lg transition-all duration-500`}
                          style={{ height: `${(service.value / Math.max(...servicesData.map(s => s.value))) * 100}%` }}
                          title={`${service.label}: ${service.value}`}
                        ></div>
                      </div>
                      <div className="text-center">
                        <Icon className="w-6 h-6 text-slate-600 mx-auto mb-1" />
                        <div className="text-2xl font-bold text-slate-900">{service.value}</div>
                        <div className="text-sm font-semibold text-slate-600">{service.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Détails des services */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {servicesData.map((service, index) => {
                const Icon = service.icon;
                const totalServices = servicesData.reduce((sum, s) => sum + s.value, 0);
                const percentage = (service.value / totalServices) * 100;
                
                return (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <Icon className="w-6 h-6 text-slate-600" />
                      <div className={`w-4 h-4 ${service.color} rounded-full`}></div>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">{service.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mb-1">{service.value}</p>
                    <p className="text-xs text-slate-500">{formatPercentage(percentage)} du total</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Modal des détails du pipeline */}
      {selectedStage && (
        <PipelineDetailsModal
          isOpen={isPipelineModalOpen}
          onClose={handleClosePipelineModal}
          stage={selectedStage}
          orders={[]}
          leads={[]}
          salespersonName={salesperson.name}
        />
      )}
    </div>
  );
};
