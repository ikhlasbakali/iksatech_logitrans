import React from 'react';
import { ChevronRight, Home, BarChart3, Euro, Users, Award, Target } from 'lucide-react';

interface BreadcrumbNavigationProps {
  activeView: string;
  currentSection?: string;
  onNavigate: (view: string) => void;
}

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  activeView,
  currentSection,
  onNavigate
}) => {
  const getViewIcon = (view: string) => {
    switch (view) {
      case 'overview': return BarChart3;
      case 'sales': return Euro;
      case 'crm': return Users;
      case 'products': return Award;
      case 'customers': return Target;
      default: return BarChart3;
    }
  };

  const getViewLabel = (view: string) => {
    switch (view) {
      case 'overview': return 'Vue d\'ensemble';
      case 'sales': return 'Ventes';
      case 'crm': return 'CRM';
      case 'products': return 'Produits';
      case 'customers': return 'Clients';
      default: return 'Dashboard';
    }
  };

  const ViewIcon = getViewIcon(activeView);

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
      <nav className="flex items-center space-x-2 text-sm">
        <button
          onClick={() => onNavigate('overview')}
          className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
        >
          <Home className="w-4 h-4 mr-1" />
          Dashboard
        </button>
        
        <ChevronRight className="w-4 h-4 text-gray-400" />
        
        <div className="flex items-center text-blue-600 font-medium">
          <ViewIcon className="w-4 h-4 mr-2" />
          {getViewLabel(activeView)}
        </div>
        
        {currentSection && (
          <>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 font-medium">{currentSection}</span>
          </>
        )}
      </nav>
    </div>
  );
};
