import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Users, TrendingUp, Target, Calendar, Award, BarChart3 } from "lucide-react";
import { appApi } from "@/api/appApi";
import { buildTopCommercialDetail } from "@/services/analytics/buildTopCommercialDetail";
import { formatCurrency, formatPercentage } from "../utils/formatters";

interface TopCommercialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TopCommercialModal: React.FC<TopCommercialModalProps> = ({ isOpen, onClose }) => {
  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ["salesQuotes", "topCommercialModal"],
    queryFn: () => appApi.entities.SalesQuote.list("-created_date", 500),
    enabled: isOpen,
  });

  const { commercialData, monthlyPerformance, topClients } = useMemo(
    () => buildTopCommercialDetail(quotes),
    [quotes]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Top commercial</h2>
                <p className="text-gray-600">
                  {isLoading
                    ? "Chargement des devis…"
                    : commercialData
                      ? `Performance agrégée — ${commercialData.name} (devis enregistrés)`
                      : "Aucun devis avec responsable identifié"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {!commercialData ? (
          <div className="p-12 text-center text-gray-600">
            <p>Créez des devis avec le champ « Commercial / responsable » pour alimenter ce rapport.</p>
          </div>
        ) : (
          <div className="p-6 space-y-8">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Award className="w-6 h-6 mr-3 text-blue-600" />
                Résumé
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200/50 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-blue-700">CA (devis gagnés)</p>
                      <p className="text-3xl font-bold text-blue-900 mt-2">
                        {formatCurrency(commercialData.revenue)}
                      </p>
                      <p className="text-sm text-blue-600 mt-2">HT acceptés / facturés</p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-blue-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200/50 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-green-700">Croissance</p>
                      <p className="text-3xl font-bold text-green-900 mt-2">
                        {commercialData.growth
                          ? `+${formatPercentage(commercialData.growth)}`
                          : "—"}
                      </p>
                      <p className="text-sm text-green-600 mt-2">Nécessite historique multi-mois</p>
                    </div>
                    <Target className="w-10 h-10 text-green-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200/50 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-purple-700">Clients (devis)</p>
                      <p className="text-3xl font-bold text-purple-900 mt-2">{commercialData.clients}</p>
                      <p className="text-sm text-purple-600 mt-2">Sociétés distinctes</p>
                    </div>
                    <Users className="w-10 h-10 text-purple-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200/50 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-orange-700">Panier moyen</p>
                      <p className="text-3xl font-bold text-orange-900 mt-2">
                        {formatCurrency(commercialData.averageTicket)}
                      </p>
                      <p className="text-sm text-orange-600 mt-2">Par devis gagné</p>
                    </div>
                    <BarChart3 className="w-10 h-10 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-green-600" />
                Performance mensuelle (HT gagné)
              </h3>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mois
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Objectif
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Écart
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Réalisation
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {monthlyPerformance.map((month, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {month.month}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(month.revenue)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(month.target)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(month.revenue - month.target)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    month.achievement >= 100 ? "bg-green-500" : "bg-yellow-500"
                                  }`}
                                  style={{ width: `${Math.min(month.achievement, 100)}%` }}
                                ></div>
                              </div>
                              <span
                                className={`text-xs font-semibold ${
                                  month.achievement >= 100 ? "text-green-600" : "text-yellow-600"
                                }`}
                              >
                                {formatPercentage(month.achievement)}
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

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Target className="w-6 h-6 mr-3 text-purple-600" />
                Clients associés à ce commercial
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topClients.length === 0 ? (
                  <p className="text-gray-600 col-span-full">Aucun client sur la période.</p>
                ) : (
                  topClients.map((client, index) => {
                    const maxRev = Math.max(...topClients.map((c) => c.revenue), 1);
                    return (
                      <div
                        key={client.client}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200/50 shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-sm font-bold">#{index + 1}</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-700">{client.client}</p>
                              <p className="text-xs text-gray-500">{client.transactions} devis</p>
                            </div>
                          </div>
                          <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-semibold rounded-full">
                            {client.status}
                          </span>
                        </div>
                        <div className="mb-4">
                          <p className="text-xl font-bold text-gray-900">{formatCurrency(client.revenue)}</p>
                          <p className="text-sm text-gray-600">Montant HT (tous statuts)</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                            style={{ width: `${(client.revenue / maxRev) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-gray-600" />
                Indicateurs
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPercentage(commercialData.conversionRate)}
                  </p>
                  <p className="text-sm text-gray-600">Taux conversion (devis)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {formatPercentage(commercialData.targetAchievement)}
                  </p>
                  <p className="text-sm text-gray-600">Objectif mois en cours</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(commercialData.yearToDate)}
                  </p>
                  <p className="text-sm text-gray-600">CA gagné (agrégat)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(commercialData.transactions * commercialData.averageTicket)}
                  </p>
                  <p className="text-sm text-gray-600">Potentiel (transactions × panier)</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
