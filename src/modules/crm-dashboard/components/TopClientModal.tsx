import React from 'react';
import { X, Target, TrendingUp, Users, Calendar, Award, BarChart3, MapPin } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface TopClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TopClientModal: React.FC<TopClientModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;

  // Données simulées du Top Client
  const clientData = {
    name: 'Heavy Works Casablanca — cluster Meknès',
    location: 'MOROCCO, Atlas Heavy Works SA',
    city: 'MEKNES',
    revenue: 400000,
    growth: 15.2,
    rank: 1,
    transactions: 25,
    averageTicket: 16000,
    satisfaction: 4.8,
    contractValue: 2500000,
    startDate: '2020-03-15',
    lastOrder: '2025-01-15',
    paymentTerms: '30 jours',
    category: 'Automobile',
    country: 'Maroc',
    previousYearRevenue: 347000,
    totalTrips: 25,
    importTrips: 15,
    exportTrips: 10,
    importRate: 60.0
  };

  const monthlyRevenue = [
    { month: 'Janvier', revenue: 320000, orders: 8, status: 'Payé' },
    { month: 'Février', revenue: 380000, orders: 10, status: 'Payé' },
    { month: 'Mars', revenue: 350000, orders: 9, status: 'Payé' },
    { month: 'Avril', revenue: 420000, orders: 11, status: 'Payé' },
    { month: 'Mai', revenue: 390000, orders: 10, status: 'Payé' },
    { month: 'Juin', revenue: 450000, orders: 12, status: 'Payé' },
    { month: 'Juillet', revenue: 410000, orders: 11, status: 'Payé' },
    { month: 'Août', revenue: 430000, orders: 11, status: 'Payé' },
    { month: 'Septembre', revenue: 400000, orders: 10, status: 'En cours' }
  ];

  const services = [
    { service: 'Transport International', revenue: 180000, percentage: 45.0, status: 'Actif' },
    { service: 'Transport National', revenue: 120000, percentage: 30.0, status: 'Actif' },
    { service: 'Stockage', revenue: 80000, percentage: 20.0, status: 'Actif' },
    { service: 'Parking', revenue: 20000, percentage: 5.0, status: 'Actif' }
  ];

  const orderHistory = [
    { id: 'CMD-2025-001', date: '2025-01-15', type: 'Transport International', amount: 25000, status: 'Livré', destination: 'France' },
    { id: 'CMD-2025-002', date: '2025-01-12', type: 'Transport National', amount: 18000, status: 'En cours', destination: 'Casablanca' },
    { id: 'CMD-2025-003', date: '2025-01-10', type: 'Stockage', amount: 12000, status: 'Livré', destination: 'MEKNES' },
    { id: 'CMD-2025-004', date: '2025-01-08', type: 'Transport International', amount: 22000, status: 'Livré', destination: 'Allemagne' },
    { id: 'CMD-2025-005', date: '2025-01-05', type: 'Parking', amount: 5000, status: 'Livré', destination: 'MEKNES' },
    { id: 'CMD-2025-006', date: '2025-01-03', type: 'Transport National', amount: 15000, status: 'En cours', destination: 'Rabat' },
    { id: 'CMD-2025-007', date: '2025-01-01', type: 'Transport International', amount: 28000, status: 'Livré', destination: 'Espagne' },
    { id: 'CMD-2024-125', date: '2024-12-28', type: 'Stockage', amount: 10000, status: 'Livré', destination: 'MEKNES' },
    { id: 'CMD-2024-124', date: '2024-12-25', type: 'Transport National', amount: 16000, status: 'Livré', destination: 'Fès' },
    { id: 'CMD-2024-123', date: '2024-12-22', type: 'Transport International', amount: 24000, status: 'Livré', destination: 'Italie' }
  ];

  const contacts = [
    { name: 'Ahmed BENALI', role: 'Directeur Général', email: 'a.benali@lear.ma', phone: '+212 5 35 55 12 34' },
    { name: 'Fatima EL FASSI', role: 'Responsable Logistique', email: 'f.elfassi@lear.ma', phone: '+212 5 35 55 12 35' },
    { name: 'Youssef AMRANI', role: 'Chef de Projet', email: 'y.amrani@lear.ma', phone: '+212 5 35 55 12 36' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Détails Top Client</h2>
                <p className="text-gray-600">Informations complètes sur {clientData.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Informations générales */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Award className="w-6 h-6 mr-3 text-green-600" />
              Informations Générales
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-700">Revenu Total</p>
                    <p className="text-3xl font-bold text-green-900 mt-2">
                      {formatCurrency(clientData.revenue)}
                    </p>
                    <p className="text-sm text-green-600 mt-2">Ce mois</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-green-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-700">Croissance</p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">
                      +{formatPercentage(clientData.growth)}
                    </p>
                    <p className="text-sm text-blue-600 mt-2">vs mois dernier</p>
                  </div>
                  <Target className="w-10 h-10 text-blue-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-700">Transactions</p>
                    <p className="text-3xl font-bold text-purple-900 mt-2">
                      {clientData.transactions}
                    </p>
                    <p className="text-sm text-purple-600 mt-2">Ce mois</p>
                  </div>
                  <Users className="w-10 h-10 text-purple-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-orange-700">Satisfaction</p>
                    <p className="text-3xl font-bold text-orange-900 mt-2">
                      {clientData.satisfaction}/5
                    </p>
                    <p className="text-sm text-orange-600 mt-2">Note moyenne</p>
                  </div>
                  <Award className="w-10 h-10 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Détails de l'entreprise */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="w-6 h-6 mr-3 text-blue-600" />
              Détails de l'Entreprise
            </h3>
            
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Informations Générales</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Nom de l'entreprise</span>
                      <span className="text-sm font-medium text-gray-900">{clientData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Catégorie</span>
                      <span className="text-sm font-medium text-gray-900">{clientData.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pays</span>
                      <span className="text-sm font-medium text-gray-900">{clientData.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Dernière commande</span>
                      <span className="text-sm font-medium text-gray-900">{new Date(clientData.lastOrder).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Performance Financière</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">CA Total (EUR)</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(clientData.revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">CA Total (DH)</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(clientData.revenue)} MAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Croissance</span>
                      <span className="text-sm font-medium text-green-600">+{formatPercentage(clientData.growth)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">CA Année Précédente</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(clientData.previousYearRevenue)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Commandes */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
              Commandes
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-700">Total Commandes</p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">{clientData.transactions}</p>
                  </div>
                  <BarChart3 className="w-10 h-10 text-blue-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-700">Panier Moyen</p>
                    <p className="text-3xl font-bold text-green-900 mt-2">{formatCurrency(clientData.averageTicket)}</p>
                  </div>
                  <Target className="w-10 h-10 text-green-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-700">Total Voyages</p>
                    <p className="text-3xl font-bold text-purple-900 mt-2">{clientData.totalTrips}</p>
                  </div>
                  <Users className="w-10 h-10 text-purple-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-orange-700">Taux Import</p>
                    <p className="text-3xl font-bold text-orange-900 mt-2">{formatPercentage(clientData.importRate)}</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Répartition Voyages */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Répartition Voyages</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-blue-600">{clientData.importTrips}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Import</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-green-600">{clientData.exportTrips}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Export</p>
                </div>
              </div>
            </div>
          </div>

          {/* Revenus mensuels */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-purple-600" />
              Revenus Mensuels
            </h3>
            
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mois</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commandes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {monthlyRevenue.map((month, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {month.month}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(month.revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {month.orders}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            month.status === 'Payé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {month.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                                style={{ width: `${(month.revenue / Math.max(...monthlyRevenue.map(m => m.revenue))) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">
                              {formatPercentage((month.revenue / clientData.revenue) * 100)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Services utilisés */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-orange-600" />
              Services Utilisés
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200/50 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{service.service}</p>
                        <p className="text-xs text-gray-500">{formatPercentage(service.percentage)} du total</p>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-semibold rounded-full">
                      {service.status}
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(service.revenue)}</p>
                    <p className="text-sm text-gray-600">Revenu généré</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                      style={{ width: `${service.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historique de commande */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-indigo-600" />
              Historique de commande
            </h3>
            
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orderHistory.map((order, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(order.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(order.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.destination}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'Livré' ? 'bg-green-100 text-green-800' : 
                            order.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Évaluation et Performance */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Award className="w-6 h-6 mr-3 text-yellow-600" />
              Évaluation et Performance
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl border border-yellow-200/50 shadow-lg text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-yellow-900 mb-2">{clientData.satisfaction}/5</p>
                <p className="text-sm font-medium text-yellow-700">Note Client</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200/50 shadow-lg text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-green-900 mb-2">+{formatPercentage(clientData.growth)}</p>
                <p className="text-sm font-medium text-green-700">Croissance Annuelle</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200/50 shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-blue-900 mb-2">{clientData.transactions}</p>
                <p className="text-sm font-medium text-blue-700">Commandes Actives</p>
              </div>
            </div>
          </div>

          {/* Évolution des Performances */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-purple-600" />
              Évolution des Performances
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">CA 2024</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(clientData.previousYearRevenue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-gray-500 to-gray-600 h-2 rounded-full"
                    style={{ width: '70%' }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200/50 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-green-700">CA 2025</p>
                    <p className="text-2xl font-bold text-green-900">{formatCurrency(clientData.revenue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Contacts */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="w-6 h-6 mr-3 text-indigo-600" />
              Contacts
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contacts.map((contact, index) => (
                <div key={index} className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border border-indigo-200/50 shadow-lg">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-lg font-bold">{contact.name.charAt(0)}</span>
                    </div>
                    <h4 className="font-semibold text-indigo-900 mb-1">{contact.name}</h4>
                    <p className="text-sm text-indigo-700 mb-3">{contact.role}</p>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600">{contact.email}</p>
                      <p className="text-xs text-gray-600">{contact.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
