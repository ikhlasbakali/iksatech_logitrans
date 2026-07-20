import React from 'react';
import { MapPin, Globe } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import type { GeographicData } from '../types/crm';

interface GeographicMapProps {
  data: GeographicData[];
  onCountryClick?: (country: GeographicData) => void;
}

export const GeographicMap: React.FC<GeographicMapProps> = ({ 
  data, 
  onCountryClick 
}) => {
  const maxRevenue = Math.max(...data.map(d => d.revenue));

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Globe className="w-5 h-5 mr-2 text-blue-600" />
        Répartition Géographique des Ventes
      </h3>
      
      {/* Vue en liste pour la démonstration */}
      <div className="grid gap-4">
        {data.map((country, index) => {
          const revenuePercentage = (country.revenue / maxRevenue) * 100;
          const isClickable = !!onCountryClick;
          
          return (
            <div
              key={country.country}
              className={`
                flex items-center justify-between p-4 rounded-lg bg-gray-50
                transition-all duration-200
                ${isClickable ? 'hover:bg-blue-50 cursor-pointer hover:scale-[1.01]' : ''}
              `}
              onClick={() => onCountryClick?.(country)}
            >
              <div className="flex items-center flex-1">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{country.country}</div>
                  <div className="text-sm text-gray-500">{country.deals} affaires</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${revenuePercentage}%` }}
                  ></div>
                </div>
                <div className="text-right min-w-[100px]">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(country.revenue)}
                  </div>
                  <div className="text-xs text-gray-500">
                    #{index + 1}
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