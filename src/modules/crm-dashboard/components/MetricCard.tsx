import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercentage, getGrowthColor } from '../utils/formatters';

interface MetricCardProps {
  title: string;
  value: string | number;
  growth?: number;
  subtitle?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  growth,
  subtitle,
  icon,
  onClick,
  className = ''
}) => {
  const isClickable = !!onClick;

  return (
    <div
      className={`
        bg-white rounded-xl p-6 shadow-sm border border-slate-100
        transition-all duration-200 hover:shadow-md
        ${isClickable ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mb-1">
            {typeof value === 'number' ? formatCurrency(value) : value}
          </p>
          {subtitle && (
            <p className="text-sm text-slate-500">{subtitle}</p>
          )}
          {growth !== undefined && (
            <div className={`flex items-center mt-2 ${getGrowthColor(growth)}`}>
              {growth > 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : growth < 0 ? (
                <TrendingDown className="w-4 h-4 mr-1" />
              ) : null}
              <span className="text-sm font-medium">
                {growth > 0 ? '+' : ''}{formatPercentage(growth)}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-teal-600 opacity-90">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};