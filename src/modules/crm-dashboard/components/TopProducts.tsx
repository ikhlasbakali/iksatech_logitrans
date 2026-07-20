import React from 'react';
import { Package, TrendingUp } from 'lucide-react';
import { formatCurrency, formatPercentage, getGrowthColor } from '../utils/formatters';
import type { ProductPerformance } from '../types/crm';

interface TopProductsProps {
  products: ProductPerformance[];
  onProductClick?: (product: ProductPerformance) => void;
}

export const TopProducts: React.FC<TopProductsProps> = ({ 
  products, 
  onProductClick 
}) => {
  const topProducts = products.slice(0, 10);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Package className="w-5 h-5 mr-2 text-blue-600" />
        Services: Transport, Stockage & Parking
      </h3>
      
      <div className="space-y-4">
        {topProducts.map((product, index) => {
          const isClickable = !!onProductClick;
          
          return (
            <div
              key={product.id}
              className={`
                flex items-center justify-between p-4 rounded-lg
                transition-all duration-200 border border-gray-100
                ${isClickable ? 'hover:bg-blue-50 cursor-pointer hover:border-blue-200' : ''}
              `}
              onClick={() => onProductClick?.(product)}
            >
              <div className="flex items-center flex-1">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold text-sm">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">
                    {product.category} • {product.quantity_sold} vendus
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatCurrency(product.revenue)}
                </div>
                <div className={`text-sm flex items-center justify-end ${getGrowthColor(product.growth_rate)}`}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {formatPercentage(product.growth_rate)}
                </div>
                <div className="text-xs text-gray-500">
                  Marge: {formatPercentage(product.margin)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};