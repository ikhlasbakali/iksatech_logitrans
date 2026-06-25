import React, { useState } from 'react';
import { Building2, Calendar, TrendingUp, TrendingDown, Plane, Ship, Star } from 'lucide-react';
import { formatCurrency, formatDate, formatPercentage, getGrowthColor } from '../utils/formatters';
import { CustomerDetailsModal } from './CustomerDetailsModal';
import type { CustomerMetrics } from '../types/crm';

interface TopCustomersProps {
  customers: CustomerMetrics[];
  onCustomerClick?: (customer: CustomerMetrics) => void;
}

export const TopCustomers: React.FC<TopCustomersProps> = ({ 
  customers, 
  onCustomerClick 
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerMetrics | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const topCustomers = customers.slice(0, 10);

  const handleCustomerClick = (customer: CustomerMetrics) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
    onCustomerClick?.(customer);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-blue-100/50">
      <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
        <Building2 className="w-7 h-7 mr-4 text-blue-600" />
        Top 10 Clients par Valeur
      </h3>
      
      <div className="space-y-4">
        {topCustomers.map((customer, index) => {
          const isClickable = !!onCustomerClick;
          const categoryColors = {
            Enterprise: 'bg-purple-100 text-purple-800',
            SMB: 'bg-blue-100 text-blue-800',
            Startup: 'bg-green-100 text-green-800'
          };
          
          return (
            <div
              key={customer.id}
              className={`
                flex items-center justify-between p-6 rounded-2xl
                transition-all duration-300 border border-slate-200/50
                ${isClickable ? 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer hover:border-blue-300 hover:shadow-xl hover:-translate-y-1' : ''}
                bg-white/80 backdrop-blur-sm
              `}
              onClick={() => handleCustomerClick(customer)}
            >
              <div className="flex items-center flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-lg">{customer.name}</div>
                  <div className="flex items-center space-x-3 mt-2">
                    <span 
                      className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                        categoryColors[customer.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800 border-gray-200'
                      }`}
                    >
                      {customer.category}
                    </span>
                    <span className="text-sm text-slate-500 font-medium">• {customer.country}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900 mb-2">
                  {formatCurrency(customer.revenue)}
                </div>
                <div className="flex items-center justify-end text-sm text-slate-600 mb-2">
                  <span className="mr-3 font-semibold">{customer.orders_count} commandes</span>
                  <div className={`flex items-center ${getGrowthColor(customer.revenue_growth)}`}>
                    {customer.revenue_growth > 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    <span className="text-sm font-bold">
                      +{formatPercentage(customer.revenue_growth)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-4 text-sm text-slate-500 mb-2">
                  <div className="flex items-center">
                    <Plane className="w-4 h-4 mr-1 text-blue-600" />
                    <span className="font-semibold">{customer.import_trips} import</span>
                  </div>
                  <div className="flex items-center">
                    <Ship className="w-4 h-4 mr-1 text-green-600" />
                    <span className="font-semibold">{customer.export_trips} export</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    <span className="font-semibold">{customer.evaluation_score}/5</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-slate-500 justify-end">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="font-medium">{formatDate(customer.last_order_date)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de détails */}
      <CustomerDetailsModal
        customer={selectedCustomer}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};