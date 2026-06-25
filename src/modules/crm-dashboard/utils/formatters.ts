export const formatCurrency = (amount: number, currency = '€'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency === '€' ? 'EUR' : 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('fr-FR').format(value);
};

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(dateString));
};

export const getGrowthColor = (growth: number): string => {
  if (growth > 0) return 'text-teal-600';
  if (growth < 0) return 'text-rose-600';
  return 'text-slate-500';
};

export const getPerformanceColor = (achieved: number, target: number): string => {
  const ratio = achieved / target;
  if (ratio >= 1.1) return 'text-emerald-600';
  if (ratio >= 0.9) return 'text-cyan-700';
  if (ratio >= 0.7) return 'text-amber-600';
  return 'text-rose-600';
};