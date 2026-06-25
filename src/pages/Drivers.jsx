import React, { useState } from 'react';
import { appApi } from '@/api/appApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Phone,
  Mail,
  MapPin,
  Star,
  Truck,
  Clock,
  TrendingUp,
  MoreVertical,
  Pencil,
  IdCard,
} from 'lucide-react';
import DriverVisaStatusPanel from '@/components/drivers/DriverVisaStatusPanel';
import { classifyDriverVisa, getDriverVisaPresentation } from '@/utils/driverVisaStats';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function driverMatchesVisaFilter(driver, visaFilter) {
  if (visaFilter === 'all') return true;
  const cat = classifyDriverVisa(driver);
  if (visaFilter === 'sans') return cat === 'sans' || cat === 'invalide';
  return cat === visaFilter;
}

function defaultDriverForm() {
  return {
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    status: 'available',
    rating: 4.6,
    on_time_rate: 95,
    visaSituation: 'none',
    work_visa_expiry: '',
  };
}

function driverRecordToForm(driver) {
  const raw = driver?.work_visa_expiry;
  let work_visa_expiry = '';
  let visaSituation = 'none';
  if (raw) {
    const exp = new Date(raw);
    if (!Number.isNaN(exp.getTime())) {
      visaSituation = 'with_date';
      work_visa_expiry = `${exp.getFullYear()}-${String(exp.getMonth() + 1).padStart(2, '0')}-${String(exp.getDate()).padStart(2, '0')}`;
    }
  }
  return {
    first_name: driver?.first_name ?? '',
    last_name: driver?.last_name ?? '',
    phone: driver?.phone ?? '',
    email: driver?.email ?? '',
    status: driver?.status ?? 'available',
    rating: driver?.rating ?? 4.6,
    on_time_rate: driver?.on_time_rate ?? 95,
    visaSituation,
    work_visa_expiry,
  };
}

function workVisaExpiryFromForm(form) {
  if (form.visaSituation !== 'with_date') return null;
  const d = String(form.work_visa_expiry || '').trim();
  return d || null;
}

function validateDriverVisaForm(form) {
  if (form.visaSituation === 'with_date' && !String(form.work_visa_expiry || '').trim()) {
    return 'Indiquez la date d’expiration du titre, ou choisissez « sans titre enregistré ».';
  }
  return null;
}

function telHref(phone) {
  const t = String(phone || '').trim();
  if (!t) return null;
  const digits = t.replace(/\D/g, '');
  if (digits.length < 8) return null;
  const body = t.startsWith('+') ? `+${digits}` : digits;
  return `tel:${body}`;
}

function mapsSearchUrlForDriver(driver) {
  const q =
    String(driver?.current_location || '').trim() ||
    [driver?.first_name, driver?.last_name].filter(Boolean).join(' ').trim();
  if (!q) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

function DriverFormFields({ form, setForm, idPrefix }) {
  const wid = `${idPrefix}-work-visa`;
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Prénom</Label>
          <Input
            value={form.first_name}
            onChange={(e) => setForm((prev) => ({ ...prev, first_name: e.target.value }))}
            placeholder="Jean"
          />
        </div>
        <div className="space-y-2">
          <Label>Nom</Label>
          <Input
            value={form.last_name}
            onChange={(e) => setForm((prev) => ({ ...prev, last_name: e.target.value }))}
            placeholder="Dupont"
          />
        </div>
        <div className="space-y-2">
          <Label>Téléphone</Label>
          <Input
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="+33 6 12 34 56 78"
          />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="viktor.rostov@fleet.demo"
          />
        </div>
        <div className="space-y-2">
          <Label>Statut</Label>
          <Select value={form.status} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="on_mission">En mission</SelectItem>
              <SelectItem value="loading">Chargement</SelectItem>
              <SelectItem value="off_duty">Repos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Taux de ponctualité (%)</Label>
          <Input
            type="number"
            value={form.on_time_rate}
            onChange={(e) => setForm((prev) => ({ ...prev, on_time_rate: Number(e.target.value) }))}
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <IdCard className="h-4 w-4 text-slate-600" />
          Titre de travail / visa
        </div>
        <div className="space-y-2">
          <Label>Situation</Label>
          <Select
            value={form.visaSituation}
            onValueChange={(value) =>
              setForm((prev) => ({
                ...prev,
                visaSituation: value,
                work_visa_expiry: value === 'none' ? '' : prev.work_visa_expiry,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sans titre enregistré (pas de visa suivi)</SelectItem>
              <SelectItem value="with_date">Avec titre — renseigner la date d&apos;expiration</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-600">
            Les totaux « Avec visa » / « Sans visa » du tableau ci-dessus se basent sur cette date : sans date, le
            chauffeur est compté <strong className="font-medium text-slate-800">sans visa</strong> sur le tableau de
            bord.
          </p>
        </div>
        {form.visaSituation === 'with_date' && (
          <div className="space-y-2">
            <Label htmlFor={wid}>Date d&apos;expiration du titre</Label>
            <Input
              id={wid}
              type="date"
              value={form.work_visa_expiry}
              onChange={(e) => setForm((prev) => ({ ...prev, work_visa_expiry: e.target.value }))}
            />
            <p className="text-xs text-slate-500">
              Une date passée reste enregistrée comme titre expiré (visible dans les filtres et alertes).
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default function Drivers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [visaFilter, setVisaFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formData, setFormData] = useState(() => defaultDriverForm());
  const [editForm, setEditForm] = useState(() => defaultDriverForm());

  const queryClient = useQueryClient();

  const { data: drivers = [] } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => appApi.entities.Driver.list(),
  });

  const createMutation = useMutation({
    mutationFn: (payload) => appApi.entities.Driver.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setDialogOpen(false);
      setFormData(defaultDriverForm());
      toast.success('Chauffeur ajouté.');
    },
    onError: (e) => {
      toast.error(e?.message || 'Impossible d’ajouter le chauffeur.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const updated = await appApi.entities.Driver.update(id, payload);
      if (!updated) throw new Error('Chauffeur introuvable');
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setEditTarget(null);
      toast.success('Fiche chauffeur mise à jour.');
    },
    onError: (e) => {
      toast.error(e?.message || 'Impossible d’enregistrer les modifications.');
    },
  });

  const filteredDrivers = drivers.filter((driver) => {
    const hay = `${driver.first_name} ${driver.last_name} ${driver.phone || ''} ${driver.email || ''}`.toLowerCase();
    const matchesSearch = !searchTerm || hay.includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;
    const matchesVisa = driverMatchesVisaFilter(driver, visaFilter);

    return matchesSearch && matchesStatus && matchesVisa;
  });

  const stats = {
    total: drivers.length,
    available: drivers.filter(d => d.status === 'available').length,
    onMission: drivers.filter(d => ['on_mission', 'loading'].includes(d.status)).length,
    offDuty: drivers.filter(d => d.status === 'off_duty').length,
  };

  const noDriversInStore = drivers.length === 0;
  const noFilterMatch = !noDriversInStore && filteredDrivers.length === 0;

  const openEditDriver = (driver) => {
    setEditForm(driverRecordToForm(driver));
    setEditTarget(driver);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl lg:text-3xl font-bold text-slate-900"
          >
            Chauffeurs
          </motion.h1>
          <p className="text-slate-500 mt-1">
            Gérez votre équipe de chauffeurs
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau chauffeur
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-sm text-slate-500">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.available}</p>
              <p className="text-sm text-slate-500">Disponibles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-xl">
              <Truck className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.onMission}</p>
              <p className="text-sm text-slate-500">En mission</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-xl">
              <Clock className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.offDuty}</p>
              <p className="text-sm text-slate-500">Repos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <DriverVisaStatusPanel drivers={drivers} showExpiringList />

      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher un chauffeur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full lg:w-auto">
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="available">Disponibles</TabsTrigger>
              <TabsTrigger value="on_mission">En mission</TabsTrigger>
              <TabsTrigger value="off_duty">Repos</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex flex-col gap-1.5 w-full lg:w-64 shrink-0">
            <Label className="text-xs text-slate-500">Filtrer par titre / visa</Label>
            <Select value={visaFilter} onValueChange={setVisaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Visa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="sans">Sans titre (pas de date)</SelectItem>
                <SelectItem value="valide">Visa valide (&gt; 30 j.)</SelectItem>
                <SelectItem value="bientot">Expire bientôt (≤ 30 j.)</SelectItem>
                <SelectItem value="expire">Visa expiré</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Drivers grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrivers.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center text-slate-600">
            {noFilterMatch ? (
              <>
                <p className="font-medium text-slate-800">Aucun résultat pour ces filtres</p>
                <p className="mt-2 text-sm">
                  Ajustez la recherche, le statut ou le filtre visa — ou réinitialisez les filtres pour afficher toute
                  l&apos;équipe.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium text-slate-800">Aucun chauffeur dans la base</p>
                <p className="mt-2 text-sm">
                  Les données affichées proviennent du stockage applicatif local. Ajoutez un chauffeur ou réinitialisez
                  les données initiales depuis l&apos;administration si votre déploiement le prévoit.
                </p>
              </>
            )}
          </div>
        )}
        {filteredDrivers.map((driver, index) => (
          <motion.div
            key={driver.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={driver.photo_url} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-lg">
                        {driver.first_name?.charAt(0)}{driver.last_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {driver.first_name} {driver.last_name}
                      </h3>
                      <StatusBadge status={driver.status} size="sm" showDot />
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDriver(driver)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Modifier la fiche
                      </DropdownMenuItem>
                      {telHref(driver.phone) ? (
                        <DropdownMenuItem asChild>
                          <a href={telHref(driver.phone)} className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            Appeler
                          </a>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem disabled>Téléphone non utilisable</DropdownMenuItem>
                      )}
                      {String(driver.email || '').trim() ? (
                        <DropdownMenuItem asChild>
                          <a href={`mailto:${String(driver.email).trim()}`} className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            Envoyer un e-mail
                          </a>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem disabled>E-mail non renseigné</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {driver.current_location && (
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{driver.current_location}</span>
                  </div>
                )}

                {(() => {
                  const v = getDriverVisaPresentation(driver);
                  return (
                    <div className="mb-4 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <IdCard className="h-4 w-4 shrink-0 text-slate-500" />
                        <Badge variant="outline" className={v.badgeClassName}>
                          {v.shortLabel}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 leading-snug pl-6">{v.detailLabel}</p>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-semibold text-slate-900">{driver.rating}</span>
                    </div>
                    <p className="text-xs text-slate-500">Note</p>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <p className="font-semibold text-slate-900">{driver.total_deliveries}</p>
                    <p className="text-xs text-slate-500">Livraisons</p>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span className="font-semibold text-slate-900">{driver.on_time_rate}%</span>
                    </div>
                    <p className="text-xs text-slate-500">Ponctualité</p>
                  </div>
                </div>

                {driver.certifications?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {driver.certifications.map((cert) => (
                      <span 
                        key={cert}
                        className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  {telHref(driver.phone) ? (
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={telHref(driver.phone)}>
                        <Phone className="w-4 h-4 mr-1" />
                        Appeler
                      </a>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      type="button"
                      onClick={() => toast.info('Numéro de téléphone insuffisant pour lancer un appel.')}
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Appeler
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    type="button"
                    onClick={() => {
                      const url = mapsSearchUrlForDriver(driver);
                      if (!url) {
                        toast.info('Aucun libellé de position ni identité pour ouvrir la carte.');
                        return;
                      }
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    Localiser
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un chauffeur</DialogTitle>
            <DialogDescription>
              Renseignez l&apos;identité et le contact. Indiquez si un titre de travail / visa est suivi sur la fiche
              (date d&apos;expiration) ou laissez « sans titre » pour les profils non concernés.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <DriverFormFields form={formData} setForm={setFormData} idPrefix="create" />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                disabled={createMutation.isPending}
                onClick={() => {
                  const err = validateDriverVisaForm(formData);
                  if (err) {
                    toast.error(err);
                    return;
                  }
                  createMutation.mutate({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone,
                    email: formData.email,
                    status: formData.status,
                    rating: Number(formData.rating) || 4.6,
                    on_time_rate: Number(formData.on_time_rate) || 95,
                    total_deliveries: 0,
                    certifications: [],
                    current_location: 'Base régionale',
                    work_visa_expiry: workVisaExpiryFromForm(formData),
                  });
                }}
              >
                Ajouter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editTarget)} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la fiche chauffeur</DialogTitle>
            <DialogDescription>
              {editTarget
                ? `${editTarget.first_name} ${editTarget.last_name} — identifiant ${editTarget.id}`
                : ''}
            </DialogDescription>
          </DialogHeader>
          {editTarget && (
            <div className="space-y-4">
              <DriverFormFields form={editForm} setForm={setEditForm} idPrefix="edit" />
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEditTarget(null)}>
                  Annuler
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={updateMutation.isPending}
                  onClick={() => {
                    const err = validateDriverVisaForm(editForm);
                    if (err) {
                      toast.error(err);
                      return;
                    }
                    updateMutation.mutate({
                      id: editTarget.id,
                      payload: {
                        first_name: editForm.first_name,
                        last_name: editForm.last_name,
                        phone: editForm.phone,
                        email: editForm.email,
                        status: editForm.status,
                        rating: Number(editForm.rating) || 4.6,
                        on_time_rate: Number(editForm.on_time_rate) || 95,
                        work_visa_expiry: workVisaExpiryFromForm(editForm),
                      },
                    });
                  }}
                >
                  Enregistrer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}