import React from 'react';
import { BarChart3, Euro, Users, Award, Target } from 'lucide-react';

interface NavigationIndicatorProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const NavigationIndicator: React.FC<NavigationIndicatorProps> = ({
  activeView,
  onViewChange
}) => {
  const navigationItems = [
    { 
      key: 'overview', 
      label: 'Vue d\'ensemble', 
      icon: BarChart3, 
      description: 'Dashboard global avec tous les KPIs principaux',
      color: 'blue'
    },
    { 
      key: 'sales', 
      label: 'Ventes', 
      icon: Euro, 
      description: 'KPIs avancés, commandes et performance commerciale',
      color: 'green'
    },
    { 
      key: 'crm', 
      label: 'CRM', 
      icon: Users, 
      description: 'Pipeline, opportunités et activités',
      color: 'purple'
    },
    { 
      key: 'products', 
      label: 'Produits', 
      icon: Award, 
      description: 'Performance produits et analyse des ventes',
      color: 'orange'
    },
    { 
      key: 'customers', 
      label: 'Clients', 
      icon: Target, 
      description: 'Base clients et analyse géographique',
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const baseClasses = "flex items-center py-4 px-6 border-b-2 font-medium text-sm transition-all duration-300 hover:bg-gray-50";
    const activeClasses = isActive ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700';
    
    return `${baseClasses} ${activeClasses}`;
  };

  const getIconColor = (color: string, isActive: boolean) => {
    if (isActive) return 'text-blue-600';
    
    switch (color) {
      case 'green': return 'text-green-500';
      case 'purple': return 'text-purple-500';
      case 'orange': return 'text-orange-500';
      case 'indigo': return 'text-indigo-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-1">
          {navigationItems.map(({ key, label, icon: Icon, description, color }) => {
            const isActive = activeView === key;
            
            return (
              <button
                key={key}
                onClick={() => onViewChange(key)}
                className={getColorClasses(color, isActive)}
                title={description}
              >
                <Icon className={`w-5 h-5 mr-3 ${getIconColor(color, isActive)}`} />
                <div className="text-left">
                  <div className="font-semibold">{label}</div>
                  {isActive && (
                    <div className="text-xs text-blue-600 mt-1 animate-fadeIn">
                      {description}
                    </div>
                  )}
                </div>
                {isActive && (
                  <div className="ml-2 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
