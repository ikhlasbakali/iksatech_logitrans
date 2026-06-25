import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { appApi } from '@/api/appApi';
import { buildClientDirectoryFromStore } from '@/services/analytics/buildClientDirectory';
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  Phone,
  Mail,
  Calendar,
  BarChart3,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface Client {
  id: string;
  rank: number;
  name: string;
  revenue: number;
  growth: number;
  sector: string;
  location: string;
  isPremium: boolean;
  lastOrder: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

export const ClientsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [sortBy, setSortBy] = useState('revenue');

  const { data: operations = [] } = useQuery({
    queryKey: ['operations', 'crmClientsPage'],
    queryFn: () => appApi.entities.Operation.list('-created_date', 500),
  });

  const { data: quotes = [] } = useQuery({
    queryKey: ['salesQuotes', 'crmClientsPage'],
    queryFn: () => appApi.entities.SalesQuote.list('-created_date', 300),
  });

  const clients: Client[] = useMemo(
    () => buildClientDirectoryFromStore(operations, quotes) as Client[],
    [operations, quotes]
  );

  const sectors = useMemo(() => {
    const set = new Set(clients.map((c) => c.sector).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [clients]);

  const premiumClient = useMemo(() => {
    if (!clients.length) return null;
    return [...clients].sort((a, b) => b.revenue - a.revenue)[0];
  }, [clients]);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'all' || client.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (sortBy) {
      case 'revenue':
        return b.revenue - a.revenue;
      case 'growth':
        return b.growth - a.growth;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return a.rank - b.rank;
    }
  });

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-yellow-500';
      case 2: return 'bg-blue-400';
      case 3: return 'bg-orange-500';
      case 4: return 'bg-blue-600';
      case 5: return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getSectorColor = (sector: string) => {
    switch (sector) {
      case 'Automotive': return 'bg-blue-100 text-blue-800';
      case 'Retail': return 'bg-green-100 text-green-800';
      case 'Mining': return 'bg-purple-100 text-purple-800';
      case 'Industrial': return 'bg-orange-100 text-orange-800';
      case 'Logistics & transport': return 'bg-slate-100 text-slate-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
            <p className="text-gray-600 mt-2">
              Annuaire calculé à partir des opérations et des devis. Pour créer le{' '}
              <strong>fichier maître clients</strong> (CSV / JSON), utilisez l&apos;import dédié.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to={createPageUrl('ClientsFile')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Fichier clients (import)
            </Link>
          </div>
        </div>

        {/* Client Premium */}
        {premiumClient && premiumClient.revenue > 0 && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Client principal (CA devis)</p>
                  <h2 className="text-2xl font-bold">{premiumClient.name}</h2>
                  <div className="flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{premiumClient.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-3xl font-bold">{formatCurrency(premiumClient.revenue)}</p>
                {premiumClient.growth ? (
                  <div className="flex items-center justify-end mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm">+{formatPercentage(premiumClient.growth)} (historique)</span>
                  </div>
                ) : (
                  <p className="text-sm opacity-90 mt-1">CA devis gagnés agrégé</p>
                )}
              </div>
              
              <div className="text-right">
                <p className="text-lg font-semibold">{premiumClient.sector}</p>
                <p className="text-sm opacity-90">Secteur d'activité</p>
              </div>
            </div>
          </div>
        )}

        {/* Filtres et Recherche */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Clients</h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les secteurs</option>
                {sectors.slice(1).map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="rank">Trier par rang</option>
                <option value="revenue">Trier par CA</option>
                <option value="growth">Trier par croissance</option>
                <option value="name">Trier par nom</option>
              </select>
            </div>
          </div>

          {/* Tableau des clients */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase tracking-wider">RANG</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase tracking-wider">CLIENT</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase tracking-wider">CA GÉNÉRÉ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase tracking-wider">ÉVOLUTION</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase tracking-wider">SECTEUR</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase tracking-wider">LOCALISATION</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase tracking-wider">CROISSANCE</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedClients.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 px-4 text-center text-gray-500">
                      Aucun client consolidé pour le moment. Créez des opérations avec un nom client ou des devis avec une société cliente pour alimenter cette vue.
                    </td>
                  </tr>
                )}
                {sortedClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold ${getRankColor(client.rank)}`}>
                        #{client.rank}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-500">{client.contact.name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900">{formatCurrency(client.revenue)}</p>
                    </td>
                    <td className="py-4 px-4">
                      {client.growth ? (
                        <div className="flex items-center">
                          {client.growth >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                          )}
                          <span className={`text-sm font-medium ${client.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {client.growth >= 0 ? '+' : ''}{formatPercentage(client.growth)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSectorColor(client.sector)}`}>
                        {client.sector}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{client.location}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-16 h-8 flex items-center">
                        <svg className="w-full h-full" viewBox="0 0 64 32">
                          <polyline
                            points="4,28 16,20 28,24 40,12 52,16 60,8"
                            fill="none"
                            stroke={client.growth >= 0 ? "#10b981" : "#ef4444"}
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Statistiques */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Clients</p>
                  <p className="text-2xl font-bold text-blue-900">{clients.length}</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">CA Total</p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(clients.reduce((sum, client) => sum + client.revenue, 0))}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Croissance Moy.</p>
                  <p className="text-2xl font-bold text-purple-900">
                    +{formatPercentage(clients.reduce((sum, client) => sum + client.growth, 0) / clients.length)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Clients Premium</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {clients.filter(client => client.isPremium).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
