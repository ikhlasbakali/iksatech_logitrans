import React, { useMemo } from 'react';

interface ChartProps {
  data: Array<{
    date: string;
    revenue: number;
    forecast?: number;
  }>;
  height?: number;
}

export const Chart: React.FC<ChartProps> = ({ data, height = 300 }) => {
  const { maxValue, points, forecastPoints } = useMemo(() => {
    if (!data.length) return { maxValue: 0, points: [], forecastPoints: [] };

    const allValues = data.flatMap(d => [d.revenue, d.forecast || 0]);
    const maxValue = Math.max(...allValues);
    const width = 600;
    const chartHeight = height - 60;

    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = chartHeight - (d.revenue / maxValue) * chartHeight;
      return `${x},${y}`;
    }).join(' ');

    const forecastPoints = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = chartHeight - ((d.forecast || 0) / maxValue) * chartHeight;
      return `${x},${y}`;
    }).join(' ');

    return { maxValue, points, forecastPoints };
  }, [data, height]);

  if (!data.length) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="h-64 flex items-center justify-center text-gray-500">
          Aucune donnée disponible
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Évolution du Chiffre d'Affaires
      </h3>
      <div className="relative">
        <svg width="100%" height={height} viewBox={`0 0 600 ${height}`} className="overflow-visible">
          {/* Grille de fond */}
          <defs>
            <pattern id="grid" width="60" height="30" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 30" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="600" height={height - 60} fill="url(#grid)" />
          
          {/* Ligne de prévision */}
          <polyline
            points={forecastPoints}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeDasharray="5,5"
            className="opacity-70"
          />
          
          {/* Ligne de revenus */}
          <polyline
            points={points}
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="3"
          />
          
          {/* Points de données */}
          {data.map((_, i) => {
            const x = (i / (data.length - 1)) * 600;
            const y = (height - 60) - (data[i].revenue / maxValue) * (height - 60);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="#1e3a8a"
                className="hover:r-6 transition-all duration-200"
              />
            );
          })}
        </svg>
        
        {/* Légende */}
        <div className="flex items-center justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-blue-800 mr-2"></div>
            <span className="text-sm text-gray-600">Revenus réels</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-gray-400 border-dashed mr-2"></div>
            <span className="text-sm text-gray-600">Prévisions</span>
          </div>
        </div>
      </div>
    </div>
  );
};