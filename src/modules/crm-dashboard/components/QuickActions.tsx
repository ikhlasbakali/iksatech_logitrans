import React, { useState } from 'react';
import { 
  Download, 
  RefreshCw, 
  Settings, 
  Filter,
  Search,
  Bell,
  FileText,
  FileSpreadsheet,
  MessageCircle,
  Mail,
  ChevronDown,
  X
} from 'lucide-react';

interface QuickActionsProps {
  onExport: (format: 'pdf' | 'excel' | 'whatsapp' | 'email') => void;
  onRefresh: () => void;
  onFilter: (filters: any) => void;
  onSearch: (query: string) => void;
  onSettings: () => void;
  onNotifications: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onExport,
  onRefresh,
  onFilter,
  onSearch,
  onSettings,
  onNotifications
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [filters, setFilters] = useState({
    period: 'month',
    salesperson: 'all',
    region: 'all',
    category: 'all'
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setShowSearch(false);
    }
  };

  const handleFilter = () => {
    onFilter(filters);
    setShowFilter(false);
  };

  const handleExport = (format: 'pdf' | 'excel' | 'whatsapp' | 'email') => {
    setShowExportMenu(false);
    onExport(format);
  };

  const exportOptions = [
    { id: 'pdf', label: 'Exporter en PDF', icon: FileText, color: 'text-red-600' },
    { id: 'excel', label: 'Exporter en Excel', icon: FileSpreadsheet, color: 'text-green-600' },
    { id: 'whatsapp', label: 'Envoyer par WhatsApp', icon: MessageCircle, color: 'text-green-500' },
    { id: 'email', label: 'Envoyer par Email', icon: Mail, color: 'text-blue-600' }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm border-b border-blue-200/30 px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-bold text-slate-900">Actions Rapides</h2>
          <span className="text-sm text-slate-600 font-medium">Accès direct aux fonctions principales</span>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Recherche */}
          <div className="relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-semibold hover:bg-blue-200 transition-all duration-200 hover:scale-105"
            >
              <Search className="w-4 h-4 mr-2" />
              Rechercher
            </button>
            
            {showSearch && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-blue-200/50 p-4 z-50">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher clients, commandes, commerciaux..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    autoFocus
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowSearch(false)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Filtres */}
          <div className="relative">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold hover:bg-green-200 transition-all duration-200 hover:scale-105"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </button>
            
            {showFilter && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-green-200/50 p-6 z-50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Filtres Avancés</h3>
                    <button
                      onClick={() => setShowFilter(false)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
                      <select
                        value={filters.period}
                        onChange={(e) => setFilters({...filters, period: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="today">Aujourd'hui</option>
                        <option value="week">Cette semaine</option>
                        <option value="month">Ce mois</option>
                        <option value="quarter">Ce trimestre</option>
                        <option value="year">Cette année</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Commercial</label>
                      <select
                        value={filters.salesperson}
                        onChange={(e) => setFilters({...filters, salesperson: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
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
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Région</label>
                      <select
                        value={filters.region}
                        onChange={(e) => setFilters({...filters, region: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="all">Toutes les régions</option>
                        <option value="france">France</option>
                        <option value="europe">Europe</option>
                        <option value="international">International</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                      <select
                        value={filters.category}
                        onChange={(e) => setFilters({...filters, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="all">Toutes les catégories</option>
                        <option value="automobile">Automobile</option>
                        <option value="logistique">Logistique</option>
                        <option value="ceramique">Céramique</option>
                        <option value="transport">Transport</option>
                        <option value="sanitaire">Sanitaire</option>
                        <option value="design">Design</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowFilter(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleFilter}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      Appliquer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Export */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-xl font-semibold hover:bg-orange-200 transition-all duration-200 hover:scale-105"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-orange-200/50 py-2 z-50">
                {exportOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleExport(option.id as 'pdf' | 'excel' | 'whatsapp' | 'email')}
                      className="w-full flex items-center px-4 py-3 text-left hover:bg-orange-50 transition-colors duration-150"
                    >
                      <Icon className={`w-5 h-5 mr-3 ${option.color}`} />
                      <span className="text-sm font-medium text-gray-700">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actualiser */}
          <button
            onClick={onRefresh}
            className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-200 transition-all duration-200 hover:scale-105"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </button>

          {/* Notifications */}
          <button
            onClick={onNotifications}
            className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition-all duration-200 hover:scale-105"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </button>

          {/* Paramètres */}
          <button
            onClick={onSettings}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 hover:scale-105"
          >
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </button>
        </div>
      </div>
    </div>
  );
};
