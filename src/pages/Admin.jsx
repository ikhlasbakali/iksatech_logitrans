import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { appApi, CANONICAL_ADMIN_EMAIL } from '@/api/appApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Users, 
  Shield, 
  Bell,
  Palette,
  Database,
  Key,
  Globe,
  Mail,
  Plus,
  MoreVertical,
  CheckCircle2,
  ScrollText,
  Building2,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  USER_ROLE_META,
  USER_ROLE_ORDER,
  getUserRoleLabel,
  rolesGroupedByCategory,
  userRoleSelectOptions,
} from "@/config/userRoles";
import { MATRIX_ROLE_KEYS, ROLE_ACCESS_ROWS, roleHasAccessToRow } from "@/config/roleAccessMatrix";
import { APP_MODULES } from "@/config/appModules";
import { ROLE_MODULE_IDS, buildDefaultRoleModuleGrantsSnapshot } from "@/auth/accessModules";

export default function Admin() {
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    user_role: 'agent',
    password: '',
    linked_driver_id: '',
    driver_phone: '',
    department_id: '',
  });
  const [createError, setCreateError] = useState('');
  const [editAccountUser, setEditAccountUser] = useState(null);
  const [editAccountForm, setEditAccountForm] = useState({
    full_name: '',
    email: '',
    is_active: true,
    new_password: '',
    user_role: 'agent',
    linked_driver_id: '',
    department_id: '',
  });
  const [newDept, setNewDept] = useState({
    name: '',
    code: '',
    scope_label: 'National',
    description: '',
  });
  const [grantDraft, setGrantDraft] = useState(null);
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    autoAssign: false,
    aiPredictions: true,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => appApi.entities.User.list(),
  });

  const { data: driversList = [] } = useQuery({
    queryKey: ['drivers'],
    queryFn: () => appApi.entities.Driver.list(),
  });

  const { data: securityAuditLog = [] } = useQuery({
    queryKey: ['securityAuditLog'],
    queryFn: () => appApi.entities.SecurityAuditLog.list('-created_date', 200),
  });

  const { data: appControl } = useQuery({
    queryKey: ['appControlSettings'],
    queryFn: () => appApi.entities.AppControlSettings.get(),
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => appApi.entities.Department.list('-created_date'),
  });

  useEffect(() => {
    if (!appControl) return;
    const merged = buildDefaultRoleModuleGrantsSnapshot();
    const o = appControl.role_module_grants;
    if (o) {
      for (const rk of Object.keys(merged)) {
        if (Array.isArray(o[rk])) merged[rk] = [...o[rk]];
      }
    }
    setGrantDraft(merged);
  }, [appControl]);

  const createUserMutation = useMutation({
    mutationFn: (payload) => appApi.entities.User.create(payload),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['securityAuditLog'] });
      setNewUser({
        full_name: '',
        email: '',
        user_role: 'agent',
        password: '',
        linked_driver_id: '',
        driver_phone: '',
        department_id: '',
      });
      setCreateError('');
      setNewUserOpen(false);
      if (String(vars?.user_role || '').toLowerCase() === 'driver' && !vars?.linked_driver_id) {
        toast.success(
          'Compte créé — une fiche chauffeur a été ajoutée automatiquement à la liste « Chauffeurs » (téléphone modifiable sur la fiche).'
        );
      } else {
        toast.success('Compte créé.');
      }
    },
    onError: (error) => {
      setCreateError(error?.message || "Erreur lors de la création");
    },
  });

  const handleCreateUser = () => {
    setCreateError('');
    createUserMutation.mutate(newUser);
  };

  const updateAccountMutation = useMutation({
    mutationFn: ({ id, payload }) => appApi.entities.User.update(id, payload),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['securityAuditLog'] });
      queryClient.invalidateQueries({ queryKey: ['appControlSettingsSnapshot'] });
      toast.success(`Compte mis à jour : ${getUserRoleLabel(vars.payload.user_role)}`);
      setEditAccountUser(null);
    },
    onError: (error) => {
      toast.error(error?.message || 'Impossible d’enregistrer les modifications');
    },
  });

  const openEditAccount = (u) => {
    setEditAccountUser(u);
    setEditAccountForm({
      full_name: u.full_name || '',
      email: u.email || '',
      is_active: u.is_active !== false,
      new_password: '',
      user_role: u.user_role || 'agent',
      linked_driver_id: u.linked_driver_id || '',
      department_id: u.department_id || '',
    });
  };

  const saveGrantsMutation = useMutation({
    mutationFn: (grants) => appApi.entities.AppControlSettings.updateGrants(grants),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appControlSettings'] });
      queryClient.invalidateQueries({ queryKey: ['securityAuditLog'] });
      queryClient.invalidateQueries({ queryKey: ['appControlSettingsSnapshot'] });
      toast.success('Droits modules enregistrés pour chaque rôle.');
    },
    onError: (e) => toast.error(e?.message || 'Enregistrement impossible'),
  });

  const resetGrantsMutation = useMutation({
    mutationFn: () => appApi.entities.AppControlSettings.resetGrants(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appControlSettings'] });
      queryClient.invalidateQueries({ queryKey: ['securityAuditLog'] });
      queryClient.invalidateQueries({ queryKey: ['appControlSettingsSnapshot'] });
      toast.success('Modules réinitialisés sur les valeurs système par défaut.');
    },
    onError: (e) => toast.error(e?.message || 'Réinitialisation impossible'),
  });

  const createDeptMutation = useMutation({
    mutationFn: (payload) => appApi.entities.Department.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setNewDept({ name: '', code: '', scope_label: 'National', description: '' });
      toast.success('Département créé.');
    },
    onError: (e) => toast.error(e?.message || 'Création impossible'),
  });

  const deleteDeptMutation = useMutation({
    mutationFn: (id) => appApi.entities.Department.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Département supprimé.');
    },
    onError: (e) => toast.error(e?.message || 'Suppression impossible'),
  });

  function validateModuleGrants(draft) {
    const a = draft.admin || [];
    if (!a.includes('system_admin') || !a.includes('dashboard')) {
      return 'Le rôle Administrateur doit conserver au minimum « Pilotage » et « Administration ».';
    }
    return null;
  }

  function toggleGrantModule(roleKey, moduleId) {
    setGrantDraft((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [roleKey]: [...(prev[roleKey] || [])] };
      const set = new Set(next[roleKey]);
      if (set.has(moduleId)) set.delete(moduleId);
      else set.add(moduleId);
      next[roleKey] = Array.from(set);
      return next;
    });
  }

  const isCanonicalAdminAccount = (u) =>
    (u?.email || '').trim().toLowerCase() === CANONICAL_ADMIN_EMAIL.toLowerCase();

  const editAccountDriverNeedsProvision =
    Boolean(editAccountUser) &&
    editAccountForm.user_role === 'driver' &&
    !String(editAccountUser.linked_driver_id || '').trim();

  const editAccountDirty =
    Boolean(editAccountUser) &&
    (editAccountDriverNeedsProvision ||
      (() => {
        const u = editAccountUser;
        const f = editAccountForm;
        if ((f.full_name || '').trim() !== (u.full_name || '').trim()) return true;
        if ((f.email || '').trim().toLowerCase() !== (u.email || '').trim().toLowerCase()) return true;
        if (f.is_active !== (u.is_active !== false)) return true;
        if (String(f.new_password || '').trim() !== '') return true;
        if ((f.user_role || '') !== (u.user_role || '')) return true;
        if ((f.linked_driver_id || '') !== (u.linked_driver_id || '')) return true;
        if ((f.department_id || '') !== (u.department_id || '')) return true;
        return false;
      })());

  const editAccountSaveDisabled = !editAccountUser || updateAccountMutation.isPending || !editAccountDirty;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl lg:text-3xl font-bold text-slate-900"
        >
          Administration
        </motion.h1>
        <p className="text-slate-500 mt-1">
          <strong className="text-slate-700">Seul le profil Administrateur</strong> peut créer et modifier les comptes :
          agents d’exploitation, responsables, managers, support, <strong className="text-slate-700">chauffeurs</strong>,{' '}
          <strong className="text-slate-700">clients</strong> et autres administrateurs. Les agents et le reste de l’équipe
          n’ont pas accès à cet écran ni à l’API de gestion des utilisateurs. Création des comptes dans l’onglet{' '}
          <strong className="text-slate-700">Utilisateurs</strong> ; création des <strong className="text-slate-700">départements</strong> et attribution des{' '}
          <strong className="text-slate-700">modules</strong> par rôle dans <strong className="text-slate-700">Départements &amp; modules</strong> ; le détail des accès dans{' '}
          <strong className="text-slate-700">Rôles &amp; accès</strong> ; le <strong className="text-slate-700">journal de traçabilité</strong> enregistre les actions par nom d&apos;administrateur.
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="structure">
            <Building2 className="w-4 h-4 mr-2" />
            Départements &amp; modules
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Shield className="w-4 h-4 mr-2" />
            Rôles &amp; accès
          </TabsTrigger>
          <TabsTrigger value="trace">
            <ScrollText className="w-4 h-4 mr-2" />
            Traçabilité
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Utilisateurs</CardTitle>
                <CardDescription>
                  Attribuez un profil à chaque compte (exploitation, chauffeur, client…)
                </CardDescription>
              </div>
              <Dialog open={newUserOpen} onOpenChange={setNewUserOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Inviter un utilisateur
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Inviter un utilisateur</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label>Nom complet</Label>
                      <Input
                        placeholder="Prénom Nom"
                        value={newUser.full_name}
                        onChange={(event) =>
                          setNewUser((prev) => ({ ...prev, full_name: event.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="email@exemple.fr"
                        value={newUser.email}
                        onChange={(event) =>
                          setNewUser((prev) => ({ ...prev, email: event.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Mot de passe</Label>
                      <Input
                        type="password"
                        placeholder="Mot de passe"
                        value={newUser.password}
                        onChange={(event) =>
                          setNewUser((prev) => ({ ...prev, password: event.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Rôle</Label>
                      <Select
                        value={newUser.user_role}
                        onValueChange={(value) =>
                          setNewUser((prev) => ({ ...prev, user_role: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          {userRoleSelectOptions().map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Département</Label>
                      <Select
                        value={newUser.department_id || '__none__'}
                        onValueChange={(value) =>
                          setNewUser((prev) => ({
                            ...prev,
                            department_id: value === '__none__' ? '' : value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Aucun" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">— Non affecté —</SelectItem>
                          {departments.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.name} ({d.scope_label})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {newUser.user_role === 'driver' && (
                      <div className="space-y-3">
                        <div>
                          <Label>Téléphone (fiche chauffeur)</Label>
                          <Input
                            type="tel"
                            placeholder="+33 6 12 34 56 78 (recommandé)"
                            value={newUser.driver_phone}
                            onChange={(event) =>
                              setNewUser((prev) => ({ ...prev, driver_phone: event.target.value }))
                            }
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            Si vide, un numéro provisoire est posé — modifiez-le ensuite sur la fiche dans «
                            Chauffeurs ».
                          </p>
                        </div>
                        <div>
                          <Label>Lier une fiche existante (optionnel)</Label>
                          <Select
                            value={newUser.linked_driver_id || '__auto__'}
                            onValueChange={(value) =>
                              setNewUser((prev) => ({
                                ...prev,
                                linked_driver_id: value === '__auto__' ? '' : value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Création auto" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="__auto__">
                                Créer automatiquement une nouvelle fiche (recommandé)
                              </SelectItem>
                              {driversList.map((d) => (
                                <SelectItem key={d.id} value={d.id}>
                                  {d.first_name} {d.last_name} — {d.id}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-slate-500 mt-1">
                            Par défaut, une entrée est ajoutée dans la liste des chauffeurs avec le nom et l&apos;e-mail
                            du compte. Choisissez une fiche existante seulement pour rattacher un chauffeur déjà créé.
                          </p>
                        </div>
                      </div>
                    )}
                    {createError && (
                      <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {createError}
                      </p>
                    )}
                    <Button className="w-full" onClick={handleCreateUser}>
                      <Mail className="w-4 h-4 mr-2" />
                      Créer le compte
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map((user, index) => {
                  const meta = USER_ROLE_META[user.user_role];
                  const roleColor = meta?.color || 'bg-slate-100 text-slate-700';
                  const roleLabel = getUserRoleLabel(user.user_role);
                  const dept = departments.find((d) => d.id === user.department_id);
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            {user.full_name?.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-slate-900">{user.full_name}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                          {dept && (
                            <p className="text-xs text-slate-600 mt-1">
                              Département : <span className="font-medium">{dept.name}</span>
                            </p>
                          )}
                          {user.is_active === false && (
                            <p className="text-xs font-medium text-rose-700 mt-1">Compte désactivé — connexion bloquée</p>
                          )}
                        </div>
                      </div>
                        <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-end">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${roleColor}`}>
                            {roleLabel}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" aria-label="Actions utilisateur">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditAccount(user)}>
                                {isCanonicalAdminAccount(user)
                                  ? 'Gérer le compte principal (identité)'
                                  : 'Profil, rôle & statut du compte'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Départements</CardTitle>
              <CardDescription>
                Structurez l&apos;organisation (national, international, support…). Affectez chaque utilisateur à un
                département depuis la fiche compte.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3 rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                  <p className="text-sm font-semibold text-slate-800">Nouveau département</p>
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input
                      value={newDept.name}
                      onChange={(e) => setNewDept((p) => ({ ...p, name: e.target.value }))}
                      placeholder="ex. Hub Benelux"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Code (optionnel)</Label>
                    <Input
                      value={newDept.code}
                      onChange={(e) => setNewDept((p) => ({ ...p, code: e.target.value }))}
                      placeholder="ex. HUB-BNL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Périmètre</Label>
                    <Select
                      value={newDept.scope_label}
                      onValueChange={(v) => setNewDept((p) => ({ ...p, scope_label: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="National">National</SelectItem>
                        <SelectItem value="International">International</SelectItem>
                        <SelectItem value="Transverse">Transverse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      rows={2}
                      value={newDept.description}
                      onChange={(e) => setNewDept((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Rôle de ce département dans la chaîne transport / logistique"
                    />
                  </div>
                  <Button
                    type="button"
                    disabled={createDeptMutation.isPending || !String(newDept.name || '').trim()}
                    onClick={() =>
                      createDeptMutation.mutate({
                        name: newDept.name.trim(),
                        code: String(newDept.code || '').trim() || undefined,
                        scope_label: newDept.scope_label,
                        description: String(newDept.description || '').trim() || undefined,
                      })
                    }
                  >
                    Créer le département
                  </Button>
                </div>
                <div className="rounded-xl border border-slate-200 divide-y max-h-80 overflow-y-auto">
                  {departments.length === 0 ? (
                    <p className="p-4 text-sm text-slate-500">Aucun département.</p>
                  ) : (
                    departments.map((d) => (
                      <div key={d.id} className="p-4 flex items-start justify-between gap-3 text-sm">
                        <div>
                          <p className="font-semibold text-slate-900">{d.name}</p>
                          <p className="text-xs text-slate-500 font-mono">{d.id}</p>
                          {d.code && <p className="text-xs text-slate-600">Code : {d.code}</p>}
                          <p className="text-xs text-slate-600 mt-1">
                            <span className="font-medium">{d.scope_label}</span>
                            {d.description ? ` — ${d.description}` : null}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="shrink-0 text-rose-700 border-rose-200"
                          disabled={deleteDeptMutation.isPending}
                          onClick={() => {
                            if (window.confirm(`Supprimer le département « ${d.name} » ?`)) {
                              deleteDeptMutation.mutate(d.id);
                            }
                          }}
                        >
                          Supprimer
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modules : qui accède à quoi</CardTitle>
              <CardDescription>
                Cochez les modules activés pour chaque rôle. Les changements s&apos;appliquent au menu et aux routes
                après enregistrement (rechargement automatique du bandeau de navigation).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!grantDraft ? (
                <p className="text-sm text-slate-500">Chargement de la configuration…</p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setGrantDraft(buildDefaultRoleModuleGrantsSnapshot())}
                    >
                      Brouillon = défauts système
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={resetGrantsMutation.isPending}
                      onClick={() => {
                        if (
                          window.confirm(
                            'Réinitialiser les droits modules sur les valeurs par défaut du système pour tous les rôles ?'
                          )
                        ) {
                          resetGrantsMutation.mutate();
                        }
                      }}
                    >
                      Réinitialiser (stockage)
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={saveGrantsMutation.isPending}
                      onClick={() => {
                        const err = validateModuleGrants(grantDraft);
                        if (err) {
                          toast.error(err);
                          return;
                        }
                        saveGrantsMutation.mutate(grantDraft);
                      }}
                    >
                      Enregistrer les droits modules
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {USER_ROLE_ORDER.map((roleKey) => (
                      <div key={roleKey} className="rounded-xl border border-slate-200 p-4">
                        <p className="text-sm font-semibold text-slate-900 mb-3">
                          {getUserRoleLabel(roleKey)}{' '}
                          <span className="font-mono text-xs font-normal text-slate-400">({roleKey})</span>
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {APP_MODULES.map((m) => (
                            <label
                              key={m.id}
                              className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2 text-xs cursor-pointer hover:bg-slate-100/80"
                            >
                              <Checkbox
                                className="mt-0.5"
                                checked={Boolean(grantDraft[roleKey]?.includes(m.id))}
                                onCheckedChange={() => toggleGrantModule(roleKey, m.id)}
                              />
                              <span>
                                <span className="font-medium text-slate-900">{m.label}</span>
                                <span className="block text-[10px] text-slate-500 uppercase tracking-wide mt-0.5">
                                  {m.scope}
                                </span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <Dialog open={Boolean(editAccountUser)} onOpenChange={(open) => !open && setEditAccountUser(null)}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Gestion du compte utilisateur</DialogTitle>
            </DialogHeader>
            {editAccountUser && (
              <div className="space-y-5 pt-2">
                <p className="text-xs text-slate-500">
                  Les modifications sont consignées dans l&apos;onglet <strong>Traçabilité</strong> avec le nom de
                  l&apos;administrateur connecté.
                </p>

                <div className="space-y-2">
                  <Label>Nom affiché</Label>
                  <Input
                    value={editAccountForm.full_name}
                    onChange={(e) => setEditAccountForm((p) => ({ ...p, full_name: e.target.value }))}
                    disabled={false}
                  />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    value={editAccountForm.email}
                    onChange={(e) => setEditAccountForm((p) => ({ ...p, email: e.target.value }))}
                    disabled={isCanonicalAdminAccount(editAccountUser)}
                  />
                  {isCanonicalAdminAccount(editAccountUser) && (
                    <p className="text-xs text-slate-500">L&apos;e-mail du compte principal ne peut pas être modifié.</p>
                  )}
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Compte actif</p>
                    <p className="text-xs text-slate-500">Si désactivé, la connexion est refusée.</p>
                  </div>
                  <Switch
                    checked={editAccountForm.is_active}
                    onCheckedChange={(v) => setEditAccountForm((p) => ({ ...p, is_active: v }))}
                    disabled={isCanonicalAdminAccount(editAccountUser)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nouveau mot de passe (optionnel)</Label>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Laisser vide pour ne pas changer"
                    value={editAccountForm.new_password}
                    onChange={(e) => setEditAccountForm((p) => ({ ...p, new_password: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Département</Label>
                  <Select
                    value={editAccountForm.department_id || '__none__'}
                    onValueChange={(v) =>
                      setEditAccountForm((p) => ({ ...p, department_id: v === '__none__' ? '' : v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Non affecté" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">— Non affecté —</SelectItem>
                      {departments.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name} ({d.scope_label})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <Label>Rôle / profil applicatif</Label>
                  <Select
                    value={editAccountForm.user_role}
                    onValueChange={(value) => setEditAccountForm((p) => ({ ...p, user_role: value }))}
                    disabled={isCanonicalAdminAccount(editAccountUser)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {userRoleSelectOptions().map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">
                    Après changement de rôle, l&apos;utilisateur doit se reconnecter pour mettre à jour le menu.
                  </p>
                </div>

                {editAccountForm.user_role === 'driver' && !isCanonicalAdminAccount(editAccountUser) && (
                  <div>
                    <Label>Fiche chauffeur</Label>
                    <Select
                      value={editAccountForm.linked_driver_id || '__auto__'}
                      onValueChange={(v) =>
                        setEditAccountForm((p) => ({ ...p, linked_driver_id: v === '__auto__' ? '' : v }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Création auto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__auto__">
                          Auto : conserver la fiche actuelle ou en créer une nouvelle si besoin
                        </SelectItem>
                        {driversList.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.first_name} {d.last_name} — {d.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500 mt-1">
                      Si le compte n&apos;avait pas encore de fiche, une ligne est ajoutée dans « Chauffeurs ».
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setEditAccountUser(null)}>
                    Annuler
                  </Button>
                  <Button
                    disabled={editAccountSaveDisabled}
                    onClick={() => {
                      const payload = {
                        full_name: editAccountForm.full_name.trim(),
                        email: editAccountForm.email.trim(),
                        is_active: editAccountForm.is_active,
                        user_role: editAccountForm.user_role,
                      };
                      if (String(editAccountForm.new_password || '').trim()) {
                        payload.password = editAccountForm.new_password;
                      }
                      if (editAccountForm.user_role === 'driver') {
                        payload.linked_driver_id = editAccountForm.linked_driver_id || null;
                      } else {
                        payload.linked_driver_id = null;
                      }
                      payload.department_id = editAccountForm.department_id || null;
                      updateAccountMutation.mutate({ id: editAccountUser.id, payload });
                    }}
                  >
                    Enregistrer
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Matrice des accès (écrans)</CardTitle>
                <CardDescription>
                  Vue alignée sur les routes de l&apos;application. Pour élargir ou restreindre un rôle : modifier{' '}
                  <span className="font-mono text-xs">App.jsx</span> (routes) et <span className="font-mono text-xs">Layout.jsx</span>{' '}
                  (menu).
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-xs border-collapse min-w-[640px]">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-2 font-semibold text-slate-800">Espace</th>
                      {MATRIX_ROLE_KEYS.map((rk) => (
                        <th
                          key={rk}
                          title={getUserRoleLabel(rk)}
                          className="text-center py-2 px-1 font-medium text-slate-600 max-w-[3.5rem]"
                        >
                          <span className="line-clamp-2">{getUserRoleLabel(rk)}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROLE_ACCESS_ROWS.map((row) => (
                      <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                        <td className="py-2 px-2 text-slate-800 align-top">
                          <span className="font-medium">{row.label}</span>
                          <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{row.path}</span>
                        </td>
                        {MATRIX_ROLE_KEYS.map((rk) => (
                          <td key={rk} className="text-center py-2 px-1 align-middle">
                            {roleHasAccessToRow(rk, row) ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 inline-block" aria-label="oui" />
                            ) : (
                              <span className="text-slate-300" aria-hidden>
                                —
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modules par profil</CardTitle>
                <CardDescription>
                  Chaque <strong>rôle</strong> active un ensemble de <strong>modules métier</strong> (transport national
                  &amp; international, conformité, CRM, terrain…). Le menu et les routes appliquent ces droits (
                  <span className="font-mono text-xs">Layout.jsx</span>, <span className="font-mono text-xs">App.jsx</span>,{' '}
                  <span className="font-mono text-xs">auth/accessModules.js</span>).
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-xs border-collapse min-w-[720px]">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-2 font-semibold text-slate-800 sticky left-0 bg-white z-10">
                        Rôle
                      </th>
                      {APP_MODULES.map((m) => (
                        <th
                          key={m.id}
                          title={`${m.label} — ${m.description}`}
                          className="text-center py-2 px-0.5 font-medium text-slate-600 max-w-[4.5rem] align-bottom"
                        >
                          <span className="line-clamp-3 leading-tight">{m.label}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {USER_ROLE_ORDER.map((roleKey) => (
                      <tr key={roleKey} className="border-b border-slate-100 hover:bg-slate-50/80">
                        <td className="py-2 px-2 font-medium text-slate-900 sticky left-0 bg-white z-10">
                          {getUserRoleLabel(roleKey)}
                          <span className="block text-[10px] font-mono text-slate-400">{roleKey}</span>
                        </td>
                        {APP_MODULES.map((m) => {
                          const ok = ROLE_MODULE_IDS[roleKey]?.includes(m.id);
                          return (
                            <td key={m.id} className="text-center py-2 px-0.5">
                              {ok ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 inline-block" aria-label="oui" />
                              ) : (
                                <span className="text-slate-300" aria-hidden>
                                  —
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {rolesGroupedByCategory().map(({ key, categoryLabel, roles: roleKeys }) => (
              <div key={key}>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">{categoryLabel}</h2>
                <div className="grid gap-4">
                  {roleKeys.map((roleKey) => {
                    const meta = USER_ROLE_META[roleKey];
                    if (!meta) return null;
                    return (
                      <Card key={roleKey}>
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                            <div className="flex items-start gap-3">
                              <Shield className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                              <div>
                                <h3 className="font-semibold text-slate-900">{meta.label}</h3>
                                <p className="text-xs font-mono text-slate-400 mt-0.5">{roleKey}</p>
                                <p className="text-sm text-slate-600 mt-2">{meta.description}</p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 text-sm rounded-full font-medium shrink-0 ${meta.color}`}>
                              {users.filter((u) => u.user_role === roleKey).length} compte(s)
                            </span>
                          </div>
                          <ul className="space-y-2 pl-8 sm:pl-11 border-t border-slate-100 pt-4">
                            {meta.access.map((line) => (
                              <li key={line} className="flex items-start gap-2 text-sm text-slate-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                <span>{line}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trace">
          <Card>
            <CardHeader>
              <CardTitle>Journal de traçabilité</CardTitle>
              <CardDescription>
                Chaque action sensible (création ou modification de compte) est enregistrée avec le{' '}
                <strong>nom affiché</strong> et l&apos;<strong>e-mail</strong> de l&apos;administrateur qui était connecté.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-slate-200 divide-y max-h-[520px] overflow-y-auto bg-white">
                {securityAuditLog.length === 0 ? (
                  <p className="p-6 text-sm text-slate-500">
                    Aucune entrée pour le moment. Créez ou modifiez un utilisateur pour alimenter ce journal (données
                    locales).
                  </p>
                ) : (
                  securityAuditLog.map((entry) => (
                    <div key={entry.id} className="p-4 text-sm space-y-1.5">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-900">{entry.actor_name}</p>
                          <p className="text-xs text-slate-500">{entry.actor_email}</p>
                        </div>
                        <span className="text-xs font-mono text-slate-500 shrink-0">
                          {format(new Date(entry.created_date), 'dd/MM/yyyy HH:mm', { locale: fr })}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-snug">{entry.summary}</p>
                      {(entry.target_user_name || entry.target_user_email) && (
                        <p className="text-xs text-slate-600 pt-1 border-t border-slate-100">
                          Compte concerné :{' '}
                          <span className="font-medium">{entry.target_user_name || '—'}</span>
                          {entry.target_user_email ? ` (${entry.target_user_email})` : null}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres généraux</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Affectation automatique</p>
                    <p className="text-sm text-slate-500">Affecter automatiquement les chauffeurs disponibles</p>
                  </div>
                  <Switch 
                    checked={settings.autoAssign}
                    onCheckedChange={(v) => setSettings({...settings, autoAssign: v})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Prédictions IA</p>
                    <p className="text-sm text-slate-500">Activer l'analyse prédictive des risques</p>
                  </div>
                  <Switch 
                    checked={settings.aiPredictions}
                    onCheckedChange={(v) => setSettings({...settings, aiPredictions: v})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intégrations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-slate-900">API REST</p>
                      <p className="text-sm text-slate-500">Intégration avec systèmes tiers</p>
                    </div>
                  </div>
                  <StatusBadge status="available" size="sm" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-medium text-slate-900">EDI / TMS</p>
                      <p className="text-sm text-slate-500">Connexion flux logistiques</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configurer</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Notifications push</p>
                  <p className="text-sm text-slate-500">Recevoir des alertes en temps réel</p>
                </div>
                <Switch 
                  checked={settings.notifications}
                  onCheckedChange={(v) => setSettings({...settings, notifications: v})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Alertes email</p>
                  <p className="text-sm text-slate-500">Recevoir des emails pour les incidents critiques</p>
                </div>
                <Switch 
                  checked={settings.emailAlerts}
                  onCheckedChange={(v) => setSettings({...settings, emailAlerts: v})}
                />
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium text-slate-900 mb-4">Types d'alertes</h4>
                <div className="space-y-3">
                  {['Retards détectés', 'Incidents signalés', 'Documents manquants', 'Maintenance véhicule', 'Nouvelles opérations'].map((alert) => (
                    <div key={alert} className="flex items-center justify-between py-2">
                      <span className="text-sm text-slate-600">{alert}</span>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}