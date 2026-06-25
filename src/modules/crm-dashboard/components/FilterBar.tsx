import React, { useState } from 'react';
import { Calendar, Filter, Download, RefreshCw, FileText, FileSpreadsheet, MessageCircle, Mail, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  onRefresh?: () => void;
  onExport?: (format: 'pdf' | 'excel' | 'whatsapp' | 'email') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onRefresh, onExport }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExport = (format: 'pdf' | 'excel' | 'whatsapp' | 'email') => {
    setShowExportMenu(false);
    onExport?.(format);
  };

  const exportOptions = [
    { id: 'pdf', label: 'Exporter en PDF', icon: FileText, color: 'text-red-600' },
    { id: 'excel', label: 'Exporter en Excel', icon: FileSpreadsheet, color: 'text-green-600' },
    { id: 'whatsapp', label: 'Envoyer par WhatsApp', icon: MessageCircle, color: 'text-green-500' },
    { id: 'email', label: 'Envoyer par Email', icon: Mail, color: 'text-blue-600' }
  ];

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" defaultValue="month">
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
              <option value="custom">Période personnalisée</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">Tous les commerciaux</option>
              <option value="nadia">Nadia El Mansouri</option>
              <option value="chaimae">Chaimae Chekrouni</option>
              <option value="fatiha">Fatiha El Hassany</option>
              <option value="ferdaous">Ferdaous Akdi</option>
              <option value="jaouhara">Jaouhara Baha</option>
              <option value="maha">Maha El Amri</option>
              <option value="yousra">Yousra Es-Selasy</option>
            </select>
          </div>
          
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">Toutes les régions</option>
            <option value="france">France</option>
            <option value="europe">Europe</option>
            <option value="international">International</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onRefresh}
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Actualiser
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {exportOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleExport(option.id as 'pdf' | 'excel' | 'whatsapp' | 'email')}
                      className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150"
                    >
                      <Icon className={`w-5 h-5 mr-3 ${option.color}`} />
                      <span className="text-sm font-medium text-gray-700">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};