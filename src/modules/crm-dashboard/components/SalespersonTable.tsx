import React from 'react';
import { User, Target, TrendingUp, Award } from 'lucide-react';
import { formatCurrency, formatPercentage, getPerformanceColor } from '../utils/formatters';
import type { SalespersonPerformance } from '../types/crm';

interface SalespersonTableProps {
  salespeople: SalespersonPerformance[];
  onSalespersonClick?: (salesperson: SalespersonPerformance) => void;
  onTeamClick?: () => void;
}

export const SalespersonTable: React.FC<SalespersonTableProps> = ({
  salespeople,
  onSalespersonClick,
  onTeamClick
}) => {
  // Fonction pour déterminer le niveau de performance
  const getPerformanceLevel = (achieved: number, target: number) => {
    const ratio = achieved / target;
    if (ratio >= 1.1) return 'Excellent';
    if (ratio >= 0.9) return 'Bon';
    if (ratio >= 0.7) return 'Moyen';
    return 'À améliorer';
  };

  // Fonction pour obtenir la couleur du niveau de performance
  const getPerformanceLevelColor = (achieved: number, target: number) => {
    const ratio = achieved / target;
    if (ratio >= 1.1) return 'text-green-600';
    if (ratio >= 0.9) return 'text-blue-600';
    if (ratio >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 
          className={`text-lg font-semibold text-gray-900 flex items-center ${onTeamClick ? 'cursor-pointer hover:text-blue-600 transition-colors' : ''}`}
          onClick={onTeamClick}
        >
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Classement Détaillé de l'Équipe
          {onTeamClick && (
            <span className="ml-2 text-sm text-gray-500 hover:text-blue-600">
              (Cliquez pour voir les détails)
            </span>
          )}
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rang
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commercial
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CA Réalisé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Objectif
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Affaires
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Conversion
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {salespeople
              .sort((a, b) => b.revenue_achieved - a.revenue_achieved)
              .map((person, index) => {
                const performanceRatio = (person.revenue_achieved / person.revenue_target) * 100;
                const isClickable = !!onSalespersonClick;
                const performanceLevel = getPerformanceLevel(person.revenue_achieved, person.revenue_target);
                const performanceLevelColor = getPerformanceLevelColor(person.revenue_achieved, person.revenue_target);
                
                return (
                  <tr
                    key={person.id}
                    className={`
                      transition-colors duration-150
                      ${isClickable ? 'hover:bg-blue-50 cursor-pointer' : ''}
                    `}
                    onClick={() => onSalespersonClick?.(person)}
                  >
                    {/* Rang */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index === 0 && <Award className="w-4 h-4 text-yellow-500 mr-2" />}
                        <span className={`text-sm font-bold ${
                          index === 0 ? 'text-yellow-600' : 
                          index === 1 ? 'text-gray-600' : 
                          index === 2 ? 'text-orange-600' : 'text-gray-500'
                        }`}>
                          #{index + 1}
                        </span>
                      </div>
                    </td>
                    
                    {/* Commercial */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-medium text-sm">
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{person.name}</div>
                          <div className={`text-sm font-medium ${performanceLevelColor}`}>
                            {performanceLevel}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* CA Réalisé */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(person.revenue_achieved)}
                      </div>
                    </td>
                    
                    {/* Objectif */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatCurrency(person.revenue_target)}
                      </div>
                    </td>
                    
                    {/* Performance */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              performanceRatio >= 100 ? 'bg-green-500' :
                              performanceRatio >= 80 ? 'bg-blue-500' :
                              performanceRatio >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(performanceRatio, 100)}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${getPerformanceColor(person.revenue_achieved, person.revenue_target)}`}>
                          {formatPercentage(performanceRatio)}
                        </span>
                      </div>
                    </td>
                    
                    {/* Affaires */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.deals_closed}/{person.deals_total}
                    </td>
                    
                    {/* Conversion */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {formatPercentage(person.conversion_rate)}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};