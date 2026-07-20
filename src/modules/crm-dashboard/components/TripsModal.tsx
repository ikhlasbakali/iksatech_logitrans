import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Ship, Plane, Building2, MapPin, Calendar, Clock } from "lucide-react";
import { appApi } from "@/api/appApi";
import { buildTripsOfDay } from "@/services/analytics/buildTripsOfDay";

interface TripsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TripsModal: React.FC<TripsModalProps> = ({ isOpen, onClose }) => {
  const { data: operations = [], isLoading } = useQuery({
    queryKey: ["operations", "tripsModal"],
    queryFn: () => appApi.entities.Operation.list("-created_date", 500),
    enabled: isOpen,
  });

  const trips = useMemo(() => buildTripsOfDay(operations), [operations]);

  const companyCount = useMemo(() => {
    const s = new Set<string>();
    trips.importTrips.forEach((t) => s.add(t.company));
    trips.exportTrips.forEach((t) => s.add(t.company));
    return s.size;
  }, [trips]);

  if (!isOpen) return null;

  const pct = (n: number, d: number) => (d > 0 ? Math.round((100 * n) / d) : 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Ship className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Voyages du jour</h2>
                <p className="text-gray-600">
                  Données issues des opérations (création ou échéance aujourd&apos;hui) — national vs
                  international.
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

        <div className="p-6">
          {isLoading ? (
            <p className="text-center text-gray-600 py-12">Chargement des opérations…</p>
          ) : (
            <>
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200/50 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-purple-700">Total</p>
                        <p className="text-3xl font-bold text-purple-900 mt-2">{trips.total}</p>
                        <p className="text-sm text-purple-600 mt-2">Missions du jour</p>
                      </div>
                      <Ship className="w-10 h-10 text-purple-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200/50 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-green-700">International</p>
                        <p className="text-3xl font-bold text-green-900 mt-2">{trips.importCount}</p>
                        <p className="text-sm text-green-600 mt-2">
                          {pct(trips.importCount, trips.total)}% du total
                        </p>
                      </div>
                      <Ship className="w-10 h-10 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200/50 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-blue-700">National</p>
                        <p className="text-3xl font-bold text-blue-900 mt-2">{trips.exportCount}</p>
                        <p className="text-sm text-blue-600 mt-2">
                          {pct(trips.exportCount, trips.total)}% du total
                        </p>
                      </div>
                      <Plane className="w-10 h-10 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Ship className="w-6 h-6 mr-3 text-green-600" />
                  International ({trips.importTrips.length} ligne{trips.importTrips.length > 1 ? "s" : ""})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.importTrips.length === 0 ? (
                    <p className="text-gray-600 col-span-full">Aucune mission internationale à cette date.</p>
                  ) : (
                    trips.importTrips.map((trip, index) => (
                      <div
                        key={`i-${index}`}
                        className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200/50 shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                              <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-lg font-bold text-green-900">{trip.count}</p>
                              <p className="text-sm text-green-600">mission{trip.count > 1 ? "s" : ""}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-green-600 mb-1">
                              <Clock className="w-4 h-4 mr-1" />
                              <span className="text-sm font-semibold">{trip.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Building2 className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-sm font-semibold text-green-800">{trip.company}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-sm text-green-700">{trip.destination}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Plane className="w-6 h-6 mr-3 text-blue-600" />
                  National ({trips.exportTrips.length} ligne{trips.exportTrips.length > 1 ? "s" : ""})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trips.exportTrips.length === 0 ? (
                    <p className="text-gray-600 col-span-full">Aucune mission nationale à cette date.</p>
                  ) : (
                    trips.exportTrips.map((trip, index) => (
                      <div
                        key={`e-${index}`}
                        className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200/50 shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                              <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-lg font-bold text-blue-900">{trip.count}</p>
                              <p className="text-sm text-blue-600">mission{trip.count > 1 ? "s" : ""}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-blue-600 mb-1">
                              <Clock className="w-4 h-4 mr-1" />
                              <span className="text-sm font-semibold">{trip.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Building2 className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-sm font-semibold text-blue-800">{trip.company}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-sm text-blue-700">{trip.destination}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                  Synthèse
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{trips.importCount}</p>
                    <p className="text-sm text-gray-600">International</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{trips.exportCount}</p>
                    <p className="text-sm text-gray-600">National</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{companyCount}</p>
                    <p className="text-sm text-gray-600">Clients distincts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{trips.total}</p>
                    <p className="text-sm text-gray-600">Total missions</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
