import React from 'react';
import { Fuel as Funnel, Target, Users, DollarSign } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface PipelineStage {
  name: string;
  count: number;
  value: number;
  color: string;
}

interface PipelineOverviewProps {
  stages?: PipelineStage[];
  onStageClick?: (stage: PipelineStage) => void;
}

export const PipelineOverview: React.FC<PipelineOverviewProps> = ({ 
  stages, 
  onStageClick 
}) => {
  // Données simulées pour les étapes du pipeline
  const defaultStages: PipelineStage[] = [
    { name: 'Prospects', count: 147, value: 2450000, color: 'bg-gray-500' },
    { name: 'Qualification', count: 89, value: 1680000, color: 'bg-yellow-500' },
    { name: 'Devis', count: 52, value: 980000, color: 'bg-orange-500' },
    { name: 'Négociation', count: 28, value: 520000, color: 'bg-blue-500' },
    { name: 'Signature', count: 15, value: 285000, color: 'bg-green-500' },
    { name: 'Perdu', count: 23, value: 420000, color: 'bg-red-500' }
  ];

  const pipelineStages = stages || defaultStages;
  const totalValue = pipelineStages.reduce((sum, stage) => sum + stage.value, 0);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Funnel className="w-5 h-5 mr-2 text-blue-600" />
        Pipeline CRM
      </h3>
      
      {/* Vue d'ensemble */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-blue-900">{formatCurrency(totalValue)}</div>
          <div className="text-sm text-blue-600">Valeur totale</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-green-900">
            {pipelineStages.reduce((sum, stage) => sum + stage.count, 0)}
          </div>
          <div className="text-sm text-green-600">Opportunités totales</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-purple-900">68.3%</div>
          <div className="text-sm text-purple-600">Taux conversion</div>
        </div>
      </div>
      
      {/* Étapes du pipeline */}
      <div className="space-y-3">
        {pipelineStages.map((stage) => {
          const percentage = (stage.value / totalValue) * 100;
          const isClickable = !!onStageClick;
          
          return (
            <div
              key={stage.name}
              className={`
                flex items-center justify-between p-4 rounded-lg border border-gray-100
                transition-all duration-200
                ${isClickable ? 'hover:bg-gray-50 cursor-pointer hover:border-blue-200' : ''}
              `}
              onClick={() => onStageClick?.(stage)}
            >
              <div className="flex items-center flex-1">
                <div className={`w-4 h-4 rounded-full ${stage.color} mr-3`}></div>
                <div>
                  <div className="font-medium text-gray-900">{stage.name}</div>
                  <div className="text-sm text-gray-500">{stage.count} opportunités</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${stage.color}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-right min-w-[120px]">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(stage.value)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatPercentage(percentage)} du total
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};