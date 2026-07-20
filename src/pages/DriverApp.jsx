import React, { useState, useMemo } from 'react';
import { appApi } from '@/api/appApi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { 
  MapPin, 
  Clock, 
  Package, 
  Camera, 
  MessageSquare,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Upload,
  Menu,
  X,
  User,
  LogOut,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@/auth/AuthContext";
import { APP_LOGO_URL, APP_NAME } from "@/config/branding";
import TripChecklist from "@/components/driver/TripChecklist";
import DeliveryConfirmation from "@/components/driver/DeliveryConfirmation";
import {
  operationToMission,
  filterOperationsForDriver,
  resolveDriverId,
  getNextOperationStatus,
} from "@/utils/driverMissions";

const statusSteps = ['assigned', 'loading', 'in_transit', 'unloading', 'delivered'];
const statusLabels = {
  assigned: 'Assigné',
  loading: 'Chargement',
  in_transit: 'En route',
  unloading: 'Déchargement',
  delivered: 'Livré'
};

const operationStatusLabels = {
  draft: 'Brouillon',
  confirmed: 'Confirmé',
  assigned: 'Assigné',
  loading: 'Chargement',
  in_transit: 'En route',
  unloading: 'Déchargement',
  delivered: 'Livré',
  completed: 'Clôturé',
  cancelled: 'Annulé',
  incident: 'Incident',
};

/** Libellé du prochain statut opération (action chauffeur). */
const nextActionLabels = {
  confirmed: 'Confirmer la prise en charge',
  assigned: 'Je pars vers le lieu de chargement',
  loading: 'Je suis sur le lieu de chargement',
  in_transit: 'Chargement terminé — je pars',
  unloading: "J'arrive au lieu de livraison",
  delivered: 'Livraison terminée',
};

export default function DriverApp() {
  const queryClient = useQueryClient();
  const { logout, user } = useAuth();
  /** null = mission « principale » auto (en route / chargement) */
  const [selectedMissionId, setSelectedMissionId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [incidentDialogOpen, setIncidentDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');

  const { data: operations = [], isLoading: opsLoading } = useQuery({
    queryKey: ['operations'],
    queryFn: () => appApi.entities.Operation.list('-created_date', 200),
  });

  const { data: drivers = [] } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => appApi.entities.Driver.list(),
  });

  const driverId = useMemo(() => resolveDriverId(user, drivers), [user, drivers]);

  const myOperations = useMemo(
    () => filterOperationsForDriver(operations, driverId, user?.full_name),
    [operations, driverId, user?.full_name]
  );

  const missions = useMemo(() => myOperations.map(operationToMission), [myOperations]);

  const myDriverRecord = useMemo(
    () => (driverId ? drivers.find((d) => d.id === driverId) : null),
    [drivers, driverId]
  );

  const currentMission = useMemo(() => {
    if (!missions.length) return null;
    if (selectedMissionId != null) {
      const picked = missions.find((m) => m.id === selectedMissionId);
      if (picked) return picked;
    }
    return (
      missions.find((m) => m.status === 'in_transit' || m.status === 'loading') || missions[0]
    );
  }, [missions, selectedMissionId]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => appApi.entities.Operation.update(id, { status }),
    onSuccess: (_, { id, status }) => {
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      queryClient.invalidateQueries({ queryKey: ['operationEvents', id] });
      toast.success(`Statut : ${operationStatusLabels[status] || statusLabels[status] || status}`);
    },
    onError: () => {
      toast.error('Impossible de mettre à jour le statut');
    },
  });

  const handleStatusUpdate = () => {
    if (!currentMission?.operationId) return;
    const next = getNextOperationStatus(currentMission.operationStatus);
    if (!next) return;
    updateStatusMutation.mutate({ id: currentMission.operationId, status: next });
  };

  const nextOpStatus = currentMission
    ? getNextOperationStatus(currentMission.operationStatus)
    : null;

  const openIncidentFromMenu = () => {
    setMenuOpen(false);
    setIncidentDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200/80">
      {/* En-tête — lisible, zone tactile menu 44px min */}
      <header className="sticky top-0 z-50 text-white shadow-md shadow-blue-900/10">
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-11 px-2 bg-white/95 rounded-xl flex items-center justify-center overflow-hidden shadow-md shrink-0">
                <img
                  src={APP_LOGO_URL}
                  alt={`Logo ${APP_NAME}`}
                  className="h-8 w-auto max-w-[7.5rem] object-contain"
                />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-base sm:text-lg leading-tight truncate">{APP_NAME}</h1>
                <p className="text-xs text-blue-100/90">Espace chauffeur</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-xl text-white hover:bg-white/15 active:bg-white/25"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Slide-out menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed top-0 right-0 h-full w-[min(100vw-2rem,20rem)] bg-white z-50 shadow-2xl flex flex-col border-l border-slate-200/80"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-lg text-slate-900">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-4 flex items-center gap-3 bg-slate-50/90 mx-3 mt-3 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{user?.full_name || 'Chauffeur'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || '—'}</p>
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 mt-2">
                <Button
                  variant="ghost"
                  className="w-full h-12 justify-start gap-3 rounded-xl text-slate-800 hover:bg-blue-50 hover:text-blue-900 font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                    <Package className="w-5 h-5" />
                  </span>
                  Mes missions
                </Button>
                <Button
                  variant="ghost"
                  className="w-full h-12 justify-start gap-3 rounded-xl text-slate-800 hover:bg-slate-100 font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-200 text-slate-700">
                    <FileText className="w-5 h-5" />
                  </span>
                  Documents
                </Button>
                <Button
                  variant="ghost"
                  className="w-full h-12 justify-start gap-3 rounded-xl text-slate-800 hover:bg-slate-100 font-medium"
                  onClick={() => {
                    setMenuOpen(false);
                    setMessageDialogOpen(true);
                  }}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                    <MessageSquare className="w-5 h-5" />
                  </span>
                  Message exploitation
                </Button>
                <Button
                  variant="ghost"
                  className="w-full h-12 justify-start gap-3 rounded-xl text-red-700 hover:bg-red-50 font-medium"
                  onClick={openIncidentFromMenu}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-700">
                    <AlertTriangle className="w-5 h-5" />
                  </span>
                  Signaler un incident
                </Button>
              </nav>

              <div className="p-4 border-t border-slate-100 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl border-2 border-red-200 text-red-700 hover:bg-red-50 font-semibold"
                  onClick={() => logout()}
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Contenu — marge basse pour la barre fixe + encoche iOS */}
      <main className="p-4 pb-[max(10rem,env(safe-area-inset-bottom)+9rem)] space-y-5 max-w-lg mx-auto w-full">
        {opsLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-600">
            <div className="animate-spin w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full mb-4" />
            <p className="text-sm font-medium">Chargement de vos missions…</p>
          </div>
        )}

        {!opsLoading && !driverId && (
          <Card className="rounded-2xl border-amber-200 bg-amber-50">
            <CardContent className="p-5 text-sm text-amber-900">
              <p className="font-semibold mb-1">Compte non relié à une fiche chauffeur</p>
              <p className="text-amber-800/90">
                Un administrateur doit associer votre compte à une fiche « Chauffeur » (Administration →
                Utilisateurs). En démo, connectez-vous avec{' '}
                <span className="font-mono font-medium">viktor.rostov@fleet.demo</span> /{' '}
                <span className="font-mono">12345</span>.
              </p>
            </CardContent>
          </Card>
        )}

        {!opsLoading && driverId && missions.length === 0 && (
          <Card className="rounded-2xl border-slate-200">
            <CardContent className="p-8 text-center text-slate-600">
              <Package className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <p className="font-semibold text-slate-800">Aucune mission assignée</p>
              <p className="text-sm mt-1">Les dossiers qui vous sont affectés apparaîtront ici.</p>
            </CardContent>
          </Card>
        )}

        {!opsLoading && currentMission && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="overflow-hidden rounded-2xl shadow-lg border-0 ring-1 ring-slate-200/60">
              <div
                className={cn(
                  'px-4 py-3 text-white flex flex-wrap items-center gap-2 justify-between',
                  currentMission.priority === 'high' || currentMission.priority === 'urgent'
                    ? 'bg-gradient-to-r from-red-600 to-red-500'
                    : 'bg-gradient-to-r from-blue-600 to-blue-500'
                )}
              >
                <span className="text-sm font-semibold tracking-wide">Mission active</span>
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-0 hover:bg-white/25 font-semibold"
                >
                  {currentMission.priority === 'high' || currentMission.priority === 'urgent'
                    ? 'Priorité haute'
                    : 'Standard'}
                </Badge>
              </div>
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-5">
                  <div>
                    <span className="font-mono font-bold text-xl text-slate-900 tracking-tight">
                      {currentMission.reference}
                    </span>
                    <Badge variant="outline" className="ml-2 align-middle text-xs font-medium border-blue-200 text-blue-800 bg-blue-50">
                      {operationStatusLabels[currentMission.operationStatus] ||
                        statusLabels[currentMission.status]}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-slate-600">{currentMission.client}</p>
                </div>

                <div className="mb-6">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Progression
                  </p>
                  <div className="flex justify-between gap-0.5 mb-3">
                    {statusSteps.map((step, index) => {
                      const currentIndex = statusSteps.indexOf(currentMission.status);
                      const isCompleted = index < currentIndex;
                      const isCurrent = index === currentIndex;
                      return (
                        <div
                          key={step}
                          className={cn(
                            'flex flex-col items-center min-w-0',
                            index < statusSteps.length - 1 && 'flex-1'
                          )}
                        >
                          <div
                            className={cn(
                              'w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 shadow-sm transition-colors',
                              isCompleted
                                ? 'bg-emerald-500 text-white'
                                : isCurrent
                                  ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                                  : 'bg-slate-200 text-slate-500'
                            )}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                          </div>
                          <span className="text-[10px] sm:text-xs text-slate-600 text-center leading-tight px-0.5 font-medium">
                            {statusLabels[step]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${(statusSteps.indexOf(currentMission.status) / (statusSteps.length - 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <TripChecklist missionReference={currentMission.reference} />
                  <DeliveryConfirmation
                    missionReference={currentMission.reference}
                    clientName={currentMission.client}
                  />
                </div>

                {/* Addresses */}
                <div className="space-y-4">
                  {selectedMissionId != null && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full h-10 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded-xl"
                      onClick={() => setSelectedMissionId(null)}
                    >
                      ← Retour à la mission principale
                    </Button>
                  )}
                  <div className={cn(
                    "p-4 rounded-2xl border-2",
                    currentMission.pickup.completed 
                      ? "bg-emerald-50 border-emerald-200" 
                      : "bg-slate-50 border-slate-200"
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        currentMission.pickup.completed ? "bg-green-500" : "bg-blue-500"
                      )} />
                      <span className="font-medium text-sm">
                        {currentMission.pickup.completed ? 'Enlèvement effectué' : 'Enlèvement'}
                      </span>
                    </div>
                    <p className="text-slate-700">{currentMission.pickup.address}</p>
                    <p className="text-slate-600 font-medium">{currentMission.pickup.city}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {format(currentMission.pickup.time, 'dd/MM HH:mm', { locale: fr })}
                    </p>
                  </div>

                  <div className={cn(
                    "p-4 rounded-2xl border-2",
                    currentMission.delivery.completed 
                      ? "bg-emerald-50 border-emerald-200" 
                      : "bg-amber-50 border-amber-300"
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        currentMission.delivery.completed ? "bg-green-500" : "bg-amber-500"
                      )} />
                      <span className="font-medium text-sm">
                        {currentMission.delivery.completed ? 'Livraison effectuée' : 'Livraison'}
                      </span>
                    </div>
                    <p className="text-slate-700">{currentMission.delivery.address}</p>
                    <p className="text-slate-600 font-medium">{currentMission.delivery.city}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      ETA: {format(currentMission.delivery.time, 'dd/MM HH:mm', { locale: fr })}
                    </p>
                  </div>
                </div>

                {/* Cargo info */}
                <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Package className="w-4 h-4" />
                    <span>{currentMission.cargo}</span>
                  </div>
                </div>

                {/* Instructions */}
                {currentMission.instructions && (
                  <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800">
                      <strong>Instructions:</strong> {currentMission.instructions}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className={missions.length <= 1 ? 'hidden' : ''}>
          <h3 className="font-bold text-slate-900 mb-3 text-base flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-blue-600" />
            Autres missions
          </h3>
          <div className="space-y-3">
            {missions
              .filter((m) => m.id !== currentMission?.id)
              .map((mission, index) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <button
                    type="button"
                    className="w-full text-left rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm hover:border-blue-300 hover:shadow-md active:scale-[0.99] transition-all touch-manipulation"
                    onClick={() => setSelectedMissionId(mission.id)}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono font-bold text-slate-900">{mission.reference}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="secondary" className="text-[10px] font-semibold">
                          {operationStatusLabels[mission.operationStatus] ||
                            statusLabels[mission.status]}
                        </Badge>
                        <ChevronRight className="w-5 h-5 text-blue-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>
                        {mission.pickup.city} → {mission.delivery.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Enlèvement {format(mission.pickup.time, 'EEE dd/MM à HH:mm', { locale: fr })}</span>
                    </div>
                  </button>
                </motion.div>
              ))}
          </div>
        </div>
      </main>

      {currentMission && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.2)]"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="max-w-lg mx-auto w-full px-3 pt-3 space-y-3">
            <div className="grid grid-cols-4 gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-auto py-3 px-1 flex flex-col items-center gap-1 rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 active:scale-[0.97] touch-manipulation"
                onClick={() => setPhotoDialogOpen(true)}
              >
                <Camera className="w-5 h-5 text-slate-700" />
                <span className="text-[10px] font-semibold text-slate-700 leading-none">Photo</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-auto py-3 px-1 flex flex-col items-center gap-1 rounded-xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 active:scale-[0.97] touch-manipulation"
                onClick={() => setMessageDialogOpen(true)}
              >
                <MessageSquare className="w-5 h-5 text-slate-700" />
                <span className="text-[10px] font-semibold text-slate-700 leading-none">Message</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-auto py-3 px-1 flex flex-col items-center gap-1 rounded-xl border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 active:scale-[0.97] touch-manipulation"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      `${currentMission.delivery.address}, ${currentMission.delivery.city}`
                    )}`,
                    '_blank'
                  )
                }
              >
                <Navigation className="w-5 h-5 text-slate-700" />
                <span className="text-[10px] font-semibold text-slate-700 leading-none">GPS</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-auto py-3 px-1 flex flex-col items-center gap-1 rounded-xl border-2 border-slate-200 hover:border-green-400 hover:bg-green-50 active:scale-[0.97] touch-manipulation"
                onClick={() => {
                  const raw = (myDriverRecord?.phone || '+33100000000').replace(/\s/g, '');
                  window.open(`tel:${raw}`, '_self');
                }}
              >
                <Phone className="w-5 h-5 text-slate-700" />
                <span className="text-[10px] font-semibold text-slate-700 leading-none">Appeler</span>
              </Button>
            </div>

            {currentMission.operationStatus === 'incident' ? (
              <div className="h-14 rounded-2xl bg-red-50 border-2 border-red-200 flex items-center justify-center text-red-800 font-semibold text-sm text-center px-2">
                <AlertTriangle className="w-5 h-5 mr-2 shrink-0" />
                Incident signalé — contactez l&apos;exploitation
              </div>
            ) : nextOpStatus ? (
              <Button
                type="button"
                disabled={updateStatusMutation.isPending}
                className="w-full h-14 rounded-2xl text-base font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/25 active:scale-[0.99] touch-manipulation"
                onClick={() => handleStatusUpdate()}
              >
                <CheckCircle2 className="w-6 h-6 mr-2 shrink-0" />
                <span className="text-left leading-tight">
                  {nextActionLabels[nextOpStatus] || 'Étape suivante'}
                </span>
              </Button>
            ) : (
              <div className="h-14 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Mission terminée
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 rounded-xl border-2 border-red-200 text-red-700 font-semibold hover:bg-red-50 mb-1"
              onClick={() => setIncidentDialogOpen(true)}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Signaler un problème
            </Button>
          </div>
        </div>
      )}

      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Photo mission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50">
              <Camera className="w-14 h-14 mx-auto mb-3 text-blue-500 opacity-80" />
              <p className="text-slate-600 text-sm font-medium mb-4">
                Caméra ou galerie (simulation démo)
              </p>
              <Button
                type="button"
                className="h-12 rounded-xl px-6 font-semibold"
                onClick={() => toast.message('Caméra', { description: 'Ouverture simulée.' })}
              >
                <Camera className="w-5 h-5 mr-2" />
                Ouvrir l&apos;appareil photo
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-xl font-semibold border-2"
                onClick={() => setPhotoDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="button"
                className="h-12 rounded-xl font-semibold shadow-md"
                onClick={() => {
                  toast.success('Photo envoyée (simulation)');
                  setPhotoDialogOpen(false);
                }}
              >
                <Upload className="w-5 h-5 mr-2" />
                Envoyer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Message à l&apos;exploitation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Textarea
              placeholder="Ex. retard 15 min, quai occupé…"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={5}
              className="rounded-xl border-2 text-base min-h-[120px]"
            />
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-xl font-semibold border-2"
                onClick={() => setMessageDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="button"
                className="h-12 rounded-xl font-semibold shadow-md"
                onClick={() => {
                  if (!newMessage.trim()) {
                    toast.error('Saisissez un message');
                    return;
                  }
                  toast.success('Message envoyé (simulation)');
                  setNewMessage('');
                  setMessageDialogOpen(false);
                }}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Envoyer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={incidentDialogOpen} onOpenChange={setIncidentDialogOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md border-red-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700 text-lg">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </span>
              Signaler un incident
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Textarea
              placeholder="Décrivez la situation (panne, accès refusé, etc.)"
              value={incidentDescription}
              onChange={(e) => setIncidentDescription(e.target.value)}
              rows={5}
              className="rounded-xl border-2 border-red-100 text-base min-h-[120px]"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl border-2 font-semibold"
              onClick={() => toast.message('Photo incident', { description: 'Ajout simulé.' })}
            >
              <Camera className="w-5 h-5 mr-2" />
              Ajouter une photo
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-xl font-semibold border-2"
                onClick={() => setIncidentDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="button"
                className="h-12 rounded-xl font-bold bg-red-600 hover:bg-red-700 shadow-md"
                onClick={() => {
                  if (!incidentDescription.trim()) {
                    toast.error('Décrivez le problème');
                    return;
                  }
                  toast.success('Incident transmis (simulation)');
                  setIncidentDescription('');
                  setIncidentDialogOpen(false);
                }}
              >
                Envoyer le signalement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}