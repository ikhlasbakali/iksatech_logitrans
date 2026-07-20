import React from 'react';
import { TrendingUp, Clock, Target, DollarSign, Users, AlertTriangle, CheckCircle } from 'lucide-react';

interface CrmPipelineAnalysisProps {
  className?: string;
}

export const CrmPipelineAnalysis: React.FC<CrmPipelineAnalysisProps> = ({ className = '' }) => {
  const pipelineData = [
    { stage: 'Nouveau', count: 400, value: 320000, percentage: 50.4, color: 'bg-gray-500' },
    { stage: 'Qualifié', count: 50, value: 40000, percentage: 6.3, color: 'bg-yellow-500' },
    { stage: 'Proposition', count: 30, value: 24000, percentage: 3.8, color: 'bg-orange-500' },
    { stage: 'ENCOURS', count: 20, value: 16000, percentage: 2.5, color: 'bg-blue-500' },
    { stage: 'Gagné', count: 350, value: 280000, percentage: 44.1, color: 'bg-green-500' },
    { stage: 'PERDU', count: 15, value: 12000, percentage: 1.9, color: 'bg-red-500' }
  ];

  const kpis = [
    {
      title: 'Opportunités Total',
      value: '793',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Revenu Espéré',
      value: '636.86k DH',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Revenu au Prorata',
      value: '630.87k DH',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Taille Moyenne',
      value: '803.11 DH',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Jours à Attribuer',
      value: '28.15 jours',
      icon: Clock,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Jours avant Clôture',
      value: '10.07 jours',
      icon: Clock,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  const sources = [
    { name: 'Indéfini', percentage: 65, color: 'bg-green-500' },
    { name: 'Direct', percentage: 20, color: 'bg-blue-500' },
    { name: 'Email', percentage: 10, color: 'bg-orange-500' },
    { name: 'Recommandation', percentage: 5, color: 'bg-purple-500' }
  ];

  const insights = [
    {
      type: 'success',
      title: 'Excellent Taux de Conversion',
      description: '85.2% des opportunités sont converties (350 gagnées vs 15 perdues)',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      type: 'warning',
      title: 'Goulot d\'Étranglement',
      description: 'Seulement 6.3% des opportunités passent en "Qualifié"',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      type: 'info',
      title: 'Pas de Retard',
      description: '0.00 jours de retard de clôture - Excellente gestion des délais',
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      type: 'warning',
      title: 'Taille Moyenne Faible',
      description: '803 DH par transaction - Potentiel d\'amélioration',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className={`bg-white rounded-xl p-6 border border-gray-100 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Target className="w-5 h-5 mr-2 text-blue-600" />
        Analyse pipeline — données démo LogiTrans
      </h3>

      {/* KPIs Principaux */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {kpis.map((kpi, index) => (
          <div key={index} className={`p-4 rounded-lg border ${kpi.bgColor} border-gray-200`}>
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div className="text-xl font-bold text-gray-900 mb-1">
              {kpi.value}
            </div>
            <div className="text-sm text-gray-600">
              {kpi.title}
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Détaillé */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-900 mb-4">Répartition du Pipeline</h4>
        <div className="space-y-3">
          {pipelineData.map((stage, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center flex-1">
                <div className={`w-4 h-4 rounded-full ${stage.color} mr-3`}></div>
                <div>
                  <div className="font-medium text-gray-900">{stage.stage}</div>
                  <div className="text-sm text-gray-500">{stage.count} opportunités</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${stage.color}`}
                    style={{ width: `${stage.percentage}%` }}
                  ></div>
                </div>
                <div className="text-right min-w-[120px]">
                  <div className="font-semibold text-gray-900">
                    {stage.value.toLocaleString()} DH
                  </div>
                  <div className="text-xs text-gray-500">
                    {stage.percentage}% du total
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sources d'Opportunités */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-900 mb-4">Sources d'Opportunités</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {sources.map((source, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 rounded-full ${source.color} mx-auto mb-2`}></div>
              <div className="font-medium text-gray-900">{source.name}</div>
              <div className="text-sm text-gray-600">{source.percentage}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights et Recommandations */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Insights & Recommandations</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg border ${insight.bgColor} border-gray-200`}>
              <div className="flex items-start">
                <insight.icon className={`w-5 h-5 ${insight.color} mr-3 mt-0.5`} />
                <div>
                  <div className="font-medium text-gray-900">{insight.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{insight.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions Prioritaires */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h5 className="font-medium text-blue-900 mb-3">Actions Prioritaires</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <strong>Court terme :</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Améliorer la qualification des prospects "Nouveau"</li>
              <li>Formation équipe sur l'upselling</li>
              <li>Optimiser les sources "Indéfini"</li>
            </ul>
          </div>
          <div>
            <strong>Moyen terme :</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Développer le marketing digital</li>
              <li>Créer un programme de recommandation</li>
              <li>Segmenter les clients par valeur</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
