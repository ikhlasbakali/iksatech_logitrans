import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { appApi } from '@/api/appApi';
import {
  predictOperationDelays,
  detectFleetAnomalies,
  recommendActionsForOperation,
} from '@/services/ai/aiInsightsService';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  AlertTriangle,
  TrendingUp,
  Clock,
  MapPin,
  FileText,
  Loader2,
  RefreshCw,
  Bot,
  User,
  Zap
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_NAME } from "@/config/branding";
import { buildOperationalSuggestions } from "@/services/ai/buildOperationalSuggestions";

export default function AIAssistant() {
  const { data: delayPreds = [], refetch: refetchPreds, isFetching: predsLoading } = useQuery({
    queryKey: ['aiDelayPredictions'],
    queryFn: predictOperationDelays,
  });
  const { data: anomalies = [], refetch: refetchAnom } = useQuery({
    queryKey: ['aiFleetAnomalies'],
    queryFn: detectFleetAnomalies,
  });

  const { data: vehiclesForSuggestions = [] } = useQuery({
    queryKey: ['vehicles', 'aiSuggestions'],
    queryFn: () => appApi.entities.Vehicle.list(),
  });

  const { data: operationsForSuggestions = [] } = useQuery({
    queryKey: ['operations', 'aiSuggestions'],
    queryFn: () => appApi.entities.Operation.list('-created_date', 400),
  });

  const operationalSuggestions = useMemo(
    () =>
      buildOperationalSuggestions({
        vehicles: vehiclesForSuggestions,
        operations: operationsForSuggestions,
        anomalies,
      }),
    [vehiclesForSuggestions, operationsForSuggestions, anomalies]
  );
  const firstOperationId = operationsForSuggestions.find((o) => o?.id)?.id;
  const { data: routeRec } = useQuery({
    queryKey: ['aiRouteRec', firstOperationId ?? 'none'],
    queryFn: () => recommendActionsForOperation(firstOperationId),
    enabled: Boolean(firstOperationId),
  });

  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: `Bonjour ! Je suis votre assistant IA ${APP_NAME}. Je peux vous aider à analyser vos opérations, prédire les risques et optimiser vos tournées. Que souhaitez-vous savoir ?` }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const buildFleetAnswer = async (question) => {
    const [vehicles, drivers, operations, incidents] = await Promise.all([
      appApi.entities.Vehicle.list(),
      appApi.entities.Driver.list(),
      appApi.entities.Operation.list(),
      appApi.entities.Incident.list(),
    ]);

    const q = question.toLowerCase();
    const wantsVehicles = /vehicule|véhicule|flotte|parc/.test(q);
    const wantsDrivers = /chauffeur|driver|conducteur/.test(q);
    const wantsOperations = /operation|opération|mission|livraison/.test(q);
    const wantsIncidents = /incident|retard|retards|anomalie/.test(q);

    const vehicleStatus = vehicles.reduce((acc, v) => {
      const key = v.status || "inconnu";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const driverStatus = drivers.reduce((acc, d) => {
      const key = d.status || "inconnu";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const operationStatus = operations.reduce((acc, o) => {
      const key = o.status || "inconnu";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const delays = operations
      .map((o) => Number(o.delay_minutes))
      .filter((value) => !Number.isNaN(value));
    const avgDelay = delays.length
      ? Math.round(delays.reduce((sum, value) => sum + value, 0) / delays.length)
      : 0;

    const maintenanceSoon = vehicles.filter((v) => {
      if (!v.next_maintenance) return false;
      const date = new Date(v.next_maintenance);
      return date.getTime() <= Date.now() + 7 * 24 * 60 * 60 * 1000;
    });

    const lines = ["Voici ce que je vois dans vos données locales :"];

    const showVehicles = wantsVehicles || (!wantsDrivers && !wantsOperations && !wantsIncidents);
    const showDrivers = wantsDrivers || (!wantsVehicles && !wantsOperations && !wantsIncidents);
    const showOperations = wantsOperations || (!wantsVehicles && !wantsDrivers && !wantsIncidents);
    const showIncidents = wantsIncidents || (!wantsVehicles && !wantsDrivers && !wantsOperations);

    if (showVehicles) {
      lines.push(
        `- Flotte: ${vehicles.length} véhicules (disponibles: ${vehicleStatus.available || 0}, en service: ${vehicleStatus.in_use || vehicleStatus.in_transit || 0}, maintenance: ${vehicleStatus.maintenance || 0}).`
      );
      if (maintenanceSoon.length > 0) {
        const list = maintenanceSoon
          .slice(0, 3)
          .map((v) => v.plate_number)
          .filter(Boolean)
          .join(", ");
        lines.push(`- Maintenance à prévoir sous 7 jours: ${list || "véhicules à vérifier"}.`);
      }
    }

    if (showDrivers) {
      lines.push(
        `- Chauffeurs: ${drivers.length} (disponibles: ${driverStatus.available || 0}, en mission: ${(driverStatus.on_mission || 0) + (driverStatus.loading || 0)}, repos: ${driverStatus.off_duty || 0}).`
      );
    }

    if (showOperations) {
      lines.push(
        `- Opérations: ${operations.length} (en transit: ${operationStatus.in_transit || 0}, livrées: ${operationStatus.delivered || 0}, incidents: ${operationStatus.incident || 0}).`
      );
      if (avgDelay > 0) {
        lines.push(`- Retard moyen estimé: ${avgDelay} min.`);
      }
    }

    if (showIncidents) {
      lines.push(`- Incidents ouverts: ${incidents.length}.`);
    }

    lines.push("Posez une question précise si vous voulez un détail par véhicule, chauffeur ou opération.");
    return lines.join("\n");
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;
    
    const newMessage = { role: 'user', content: userInput };
    setChatMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await buildFleetAnswer(userInput);
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Je suis désolé, je rencontre un problème technique. Veuillez réessayer.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Résumé des opérations d'aujourd'hui",
    "Quels sont les risques de retard ?",
    "Comment optimiser mes tournées ?",
    "Analyse des performances chauffeurs"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl lg:text-3xl font-bold text-slate-900"
            >
              Assistant IA
            </motion.h1>
            <p className="text-slate-500">Intelligence artificielle au service de vos opérations</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList>
          <TabsTrigger value="chat">
            <Bot className="w-4 h-4 mr-2" />
            Chat Assistant
          </TabsTrigger>
          <TabsTrigger value="predictions">
            <TrendingUp className="w-4 h-4 mr-2" />
            Prédictions
          </TabsTrigger>
          <TabsTrigger value="suggestions">
            <Zap className="w-4 h-4 mr-2" />
            Suggestions
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-600" />
                Assistant Opérationnel
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`max-w-[70%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`px-4 py-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-slate-100 text-slate-900 rounded-bl-md'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="px-4 py-3 bg-slate-100 rounded-2xl rounded-bl-md">
                      <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick prompts */}
              <div className="px-6 pb-4">
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        setUserInput(prompt);
                      }}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-slate-50">
                <div className="flex gap-2">
                  <Input
                    placeholder="Posez votre question..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions">
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Analyse prédictive des risques</h3>
                    <p className="text-slate-600">L'IA analyse vos opérations et prédit les risques potentiels</p>
                  </div>
                  <Button
                    variant="outline"
                    className="ml-auto"
                    onClick={() => {
                      refetchPreds();
                      refetchAnom();
                    }}
                    disabled={predsLoading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${predsLoading ? 'animate-spin' : ''}`} />
                    Actualiser
                  </Button>
                </div>
              </CardContent>
            </Card>

            {anomalies.length > 0 && (
              <Card className="border-amber-200 bg-amber-50/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    Anomalies détectées (heuristiques)
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-700 space-y-2">
                  {anomalies.map((a) => (
                    <p key={a.plate_number + a.type}>
                      <strong>{a.plate_number}</strong> — {a.detail}
                    </p>
                  ))}
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {delayPreds.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-8">Aucune opération à analyser.</p>
              )}
              {delayPreds.map((pred, index) => (
                <motion.div
                  key={pred.operation_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={pred.risk_score > 70 ? 'border-red-200' : pred.risk_score > 50 ? 'border-amber-200' : ''}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="font-mono font-semibold text-slate-900">{pred.reference}</span>
                          {pred.eta_minutes_remaining != null && (
                            <p className="text-xs text-slate-500 mt-1">
                              ETA restante estimée ~ {pred.eta_minutes_remaining} min
                            </p>
                          )}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          pred.risk_score > 70 ? 'bg-red-100 text-red-700' :
                          pred.risk_score > 50 ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          Score de risque: {pred.risk_score}/100
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-slate-700 mb-2">Facteurs de risque:</p>
                        <ul className="space-y-1">
                          {(pred.factors?.length ? pred.factors : ['Analyse heuristique locale']).map((factor, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                        {pred.predicted_delay_min > 0 && (
                          <p className="text-xs text-slate-500 mt-2">
                            Retard estimé (heuristique locale) : ~{pred.predicted_delay_min} min
                          </p>
                        )}
                      </div>

                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <Sparkles className="w-4 h-4 inline mr-1" />
                          <strong>Recommandation IA:</strong> {pred.recommendation}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Suggestions Tab */}
        <TabsContent value="suggestions">
          <div className="space-y-6">
            {routeRec && (
              <Card className="border-indigo-200 bg-indigo-50/50">
                <CardContent className="p-5 space-y-2 text-sm text-slate-800">
                  <p className="font-semibold text-indigo-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Itinéraire &amp; action (ex. dossier principal)
                  </p>
                  <p>{routeRec.route_hint}</p>
                  <p className="text-slate-600">{routeRec.action}</p>
                  <p className="text-xs text-slate-500">{routeRec.capacity_hint}</p>
                </CardContent>
              </Card>
            )}
            <Card className="bg-gradient-to-br from-emerald-50 to-cyan-50 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white rounded-xl shadow-sm">
                    <Zap className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Suggestions d'optimisation</h3>
                    <p className="text-slate-600">
                      Recommandations dérivées des anomalies, retards et charge planifiée enregistrés dans l&apos;application
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {operationalSuggestions.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-8 px-4">
                  Aucune suggestion automatique pour le moment. Les éléments apparaissent lorsque des anomalies flotte,
                  des retards significatifs ou une charge élevée sur une journée sont détectés dans vos données.
                </p>
              )}
              {operationalSuggestions.map((suggestion, index) => (
                <motion.div
                  key={`${suggestion.title}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={suggestion.priority === 'high' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-blue-500'}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {suggestion.type === 'optimization' && <TrendingUp className="w-5 h-5 text-blue-600" />}
                          {suggestion.type === 'alert' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                          {suggestion.type === 'capacity' && <Clock className="w-5 h-5 text-purple-600" />}
                          <h3 className="font-semibold text-slate-900">{suggestion.title}</h3>
                        </div>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          suggestion.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {suggestion.priority === 'high' ? 'Priorité haute' : 'Priorité moyenne'}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-3">{suggestion.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-emerald-600 font-medium">
                          ✓ {suggestion.impact}
                        </span>
                        <Button size="sm" variant="outline">
                          Traiter
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}