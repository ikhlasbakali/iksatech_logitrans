import React, { useMemo, useState } from 'react';
import { appApi } from '@/api/appApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  User,
  Truck,
  Clock,
  FileText,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Edit,
  MoreVertical,
  Navigation,
  Thermometer,
  Scale,
  Layers,
  Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import {
  getMissingRequiredDocuments,
  isOperationMandatoryDocumentSetComplete,
} from "@/config/requiredOperationDocuments";
import StatusBadge from "@/components/ui/StatusBadge";
import OperationTimeline from "@/components/operation/OperationTimeline";
import OperationDocuments from "@/components/operation/OperationDocuments";
import OperationMessages from "@/components/operation/OperationMessages";
import OperationCustomsCheckpoints from "@/components/operation/OperationCustomsCheckpoints";

export default function OperationDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const operationId = urlParams.get('id');
  const queryClient = useQueryClient();
  const [detailTab, setDetailTab] = useState('timeline');
  
  const { data: operation, isLoading } = useQuery({
    queryKey: ['operation', operationId],
    queryFn: () => appApi.entities.Operation.filter({ id: operationId }),
    select: (data) => data[0],
    enabled: !!operationId,
  });

  const { data: operationDocuments = [] } = useQuery({
    queryKey: ['operationDocuments', operationId],
    queryFn: () => appApi.entities.Document.filter({ operation_id: operationId }),
    enabled: !!operationId,
  });

  const missingMandatoryDocs = useMemo(
    () => getMissingRequiredDocuments(operationDocuments),
    [operationDocuments]
  );
  const mandatoryDocsComplete = useMemo(
    () => isOperationMandatoryDocumentSetComplete(operationDocuments),
    [operationDocuments]
  );

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => appApi.entities.Operation.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operation', operationId] });
      queryClient.invalidateQueries({ queryKey: ['operationEvents', operationId] });
    },
  });

  const handleStatusChange = (newStatus) => {
    if (newStatus === "delivered" && !mandatoryDocsComplete) {
      toast.error(
        "Dossier incomplet : les 9 pièces obligatoires (Nota, facture, CMR, fiche chargement, MRN, T1, Salida, EUR1, MLV) doivent être jointes dans l’onglet Documents avant passage à « livré »."
      );
      return;
    }
    updateMutation.mutate({
      id: operationId,
      data: {
        status: newStatus,
        ...(newStatus === "delivered" ? { actual_delivery: new Date().toISOString() } : {}),
        ...(newStatus === "in_transit" ? { actual_pickup: new Date().toISOString() } : {}),
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!operation) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Opération non trouvée</h2>
        <p className="text-slate-500 mb-6">Cette opération n'existe pas ou a été supprimée.</p>
        <Button onClick={() => window.location.href = createPageUrl('Operations')}>
          Retour aux opérations
        </Button>
      </div>
    );
  }

  const statusActions = {
    draft: ['confirmed'],
    confirmed: ['assigned', 'cancelled'],
    assigned: ['in_transit', 'cancelled'],
    in_transit: ['loading', 'unloading', 'delivered', 'incident'],
    loading: ['in_transit'],
    unloading: ['delivered'],
    delivered: ['completed'],
    incident: ['in_transit', 'cancelled'],
  };

  const nextStatuses = statusActions[operation.status] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => window.location.href = createPageUrl('Operations')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-slate-900 font-mono"
              >
                {operation.reference}
              </motion.h1>
              <StatusBadge status={operation.status} showDot size="lg" />
              <StatusBadge status={operation.priority} size="sm" />
            </div>
            <p className="text-slate-500 mt-1">
              {operation.client_name} • {operation.type_operation?.replace('_', ' ')}
              {operation.incoterm && (
                <span className="ml-2 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                  Incoterms® {operation.incoterm}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => window.location.href = createPageUrl('AIAssistant') + '?operation=' + operationId}>
            <Sparkles className="w-4 h-4 mr-2" />
            Résumé IA
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                Actions
                <MoreVertical className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {nextStatuses.map((status) => (
                <DropdownMenuItem key={status} onClick={() => handleStatusChange(status)}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Passer à "{status.replace('_', ' ')}"
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setDetailTab('documents');
                  toast.info('Onglet Documents : complétez ou mettez à jour les pièces du dossier.');
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier (documents)
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  window.location.href = createPageUrl('Incidents');
                }}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Déclarer un incident
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {!mandatoryDocsComplete && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 flex gap-3 items-start">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Dossier documentaire obligatoire incomplet</p>
            <p className="mt-1 text-amber-900/90">
              Il manque encore {missingMandatoryDocs.length} type(s) de pièce sur ce trajet. Complétez l’onglet{" "}
              <strong>Documents</strong> — le statut <strong>livré</strong> est bloqué jusqu’à présence des neuf
              documents requis.
            </p>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Route card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Trajet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                {/* Pickup */}
                <div className="flex-1 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <p className="font-medium text-green-800">Enlèvement</p>
                  </div>
                  <p className="text-slate-700">{operation.pickup_address}</p>
                  <p className="text-slate-600 font-medium">
                    {[operation.pickup_city, operation.pickup_country].filter(Boolean).join(", ") || "—"}
                  </p>
                  {operation.scheduled_pickup && (
                    <p className="text-sm text-slate-500 mt-2">
                      <Clock className="w-3.5 h-3.5 inline mr-1" />
                      {format(new Date(operation.scheduled_pickup), "dd/MM/yyyy HH:mm", { locale: fr })}
                    </p>
                  )}
                  {operation.actual_pickup && (
                    <p className="text-sm text-green-600 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                      Effectué: {format(new Date(operation.actual_pickup), "dd/MM/yyyy HH:mm", { locale: fr })}
                    </p>
                  )}
                </div>

                <div className="flex items-center pt-6">
                  <Navigation className="w-6 h-6 text-slate-400" />
                </div>

                {/* Delivery */}
                <div className="flex-1 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <p className="font-medium text-blue-800">Livraison</p>
                  </div>
                  <p className="text-slate-700">{operation.delivery_address}</p>
                  <p className="text-slate-600 font-medium">
                    {[operation.delivery_city, operation.delivery_country].filter(Boolean).join(", ") || "—"}
                  </p>
                  {operation.scheduled_delivery && (
                    <p className="text-sm text-slate-500 mt-2">
                      <Clock className="w-3.5 h-3.5 inline mr-1" />
                      {format(new Date(operation.scheduled_delivery), "dd/MM/yyyy HH:mm", { locale: fr })}
                    </p>
                  )}
                  {operation.eta && !operation.actual_delivery && (
                    <p className="text-sm text-amber-600 mt-1">
                      <Clock className="w-3.5 h-3.5 inline mr-1" />
                      ETA: {format(new Date(operation.eta), "dd/MM/yyyy HH:mm", { locale: fr })}
                    </p>
                  )}
                  {operation.actual_delivery && (
                    <p className="text-sm text-green-600 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                      Livré: {format(new Date(operation.actual_delivery), "dd/MM/yyyy HH:mm", { locale: fr })}
                    </p>
                  )}
                </div>
              </div>

              {operation.delay_minutes > 0 && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-700 font-medium">
                    Retard estimé: {operation.delay_minutes} minutes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cargo info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Marchandise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-4">{operation.cargo_description || 'Aucune description'}</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                    <Scale className="w-4 h-4" />
                    Poids
                  </div>
                  <p className="font-semibold text-slate-900">
                    {operation.cargo_weight ? `${operation.cargo_weight} kg` : '-'}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                    <Layers className="w-4 h-4" />
                    Palettes
                  </div>
                  <p className="font-semibold text-slate-900">
                    {operation.cargo_pallets || '-'}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                    <Thermometer className="w-4 h-4" />
                    Température
                  </div>
                  <p className="font-semibold text-slate-900">
                    {operation.temperature_controlled ? 'Oui' : 'Non'}
                  </p>
                </div>
              </div>
              {operation.special_instructions && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Instructions:</strong> {operation.special_instructions}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tabs for documents, messages, timeline */}
          <OperationCustomsCheckpoints operation={operation} />

          <Tabs
            value={detailTab}
            onValueChange={setDetailTab}
            className="bg-white rounded-2xl border border-slate-200/60"
          >
            <TabsList className="w-full justify-start flex-wrap border-b rounded-none px-4 pt-2 gap-1">
              <TabsTrigger value="timeline">Historique</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline" className="p-6">
              <OperationTimeline operationId={operationId} />
            </TabsContent>
            <TabsContent value="documents" className="p-6">
              <OperationDocuments operationId={operationId} dossierReference={operation.reference} />
            </TabsContent>
            <TabsContent value="messages" className="p-6">
              <OperationMessages operationId={operationId} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column - Sidebar */}
        <div className="space-y-6">
          {/* Driver info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Chauffeur{operation.driver2_name ? 's' : ''}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {operation.driver_name ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-semibold">
                      {operation.driver_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{operation.driver_name}</p>
                      <p className="text-sm text-slate-500">Chauffeur principal</p>
                      <Button variant="link" size="sm" className="px-0 text-blue-600">
                        Voir profil
                      </Button>
                    </div>
                  </div>
                  
                  {operation.driver2_name && (
                    <div className="flex items-center gap-4 pt-4 border-t">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-xl font-semibold">
                        {operation.driver2_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{operation.driver2_name}</p>
                        <p className="text-sm text-slate-500">2ème chauffeur</p>
                        <Button
                          variant="link"
                          size="sm"
                          className="px-0 text-blue-600"
                          type="button"
                          onClick={() => {
                            window.location.href = createPageUrl('Drivers');
                          }}
                        >
                          Liste chauffeurs
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6 text-slate-500">
                  <User className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Aucun chauffeur assigné</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    type="button"
                    onClick={() => {
                      window.location.href = createPageUrl('Operations');
                    }}
                  >
                    Voir les opérations
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vehicle info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Véhicule
              </CardTitle>
            </CardHeader>
            <CardContent>
              {operation.vehicle_plate ? (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                    <span className="text-slate-500">Immatriculation</span>
                    <span className="font-mono font-semibold">{operation.vehicle_plate}</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    <MapPin className="w-4 h-4 mr-2" />
                    Localiser
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500">
                  <Truck className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Aucun véhicule assigné</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Summary */}
          {operation.ai_summary && (
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Sparkles className="w-5 h-5" />
                  Résumé IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-900">{operation.ai_summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Risk score */}
          {operation.risk_score !== undefined && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Score de risque
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600">Niveau de risque</span>
                    <span className={`text-lg font-bold ${
                      operation.risk_score < 30 ? 'text-green-600' :
                      operation.risk_score < 60 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {operation.risk_score}/100
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        operation.risk_score < 30 ? 'bg-green-500' :
                        operation.risk_score < 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${operation.risk_score}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}