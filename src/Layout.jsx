import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Truck, 
  Map, 
  FileText, 
  Users, 
  Settings, 
  AlertTriangle,
  MessageSquare,
  BarChart3,
  Package,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Sparkles,
  HelpCircle,
  Smartphone,
  Cpu,
  LayoutGrid,
  ClipboardList,
  FileSpreadsheet,
  BookUser,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/auth/AuthContext";
import { APP_LOGO_URL, APP_NAME, APP_TAGLINE_SHORT } from "@/config/branding";
import {
  COMMERCIAL_DATA_NOTICE_EN,
  COMMERCIAL_DATA_NOTICE_FR,
  COMMERCIAL_EDITION_LABEL,
  COMMERCIAL_PRIVACY_URL,
  COMMERCIAL_SUPPORT_EMAIL,
  COMMERCIAL_WEB_URL,
} from "@/config/commercial";
import { getUserRoleLabel } from "@/config/userRoles";
import { roleHasModuleForPage } from "@/auth/accessModules";
import { appApi, getRoleModuleGrantsOverride } from "@/api/appApi";
import { formatUtcLong } from "@/utils/international";
import { useTrackingSimulation } from "@/hooks/useTrackingSimulation";
import { useSmartAlerts } from "@/hooks/useSmartAlerts";
import {
  listNotificationsForRole,
  markPlatformNotificationRead,
  markAllPlatformReadForUser,
} from "@/services/notifications/platformNotificationService";

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, page: 'Dashboard', roles: ['admin', 'manager', 'exploitation_manager', 'agent', 'support', 'client', 'driver'] },
  { name: 'Tableau logistique', icon: ClipboardList, page: 'FleetDashboard', roles: ['admin', 'manager', 'exploitation_manager', 'agent', 'support'] },
  { name: 'Opérations', icon: Package, page: 'Operations', roles: ['admin', 'manager', 'exploitation_manager', 'agent', 'support', 'client'] },
  { name: 'Carte temps réel', icon: Map, page: 'LiveMap', roles: ['admin', 'manager', 'exploitation_manager', 'agent', 'support'] },
  { name: 'Chauffeurs', icon: Users, page: 'Drivers', roles: ['admin', 'manager', 'exploitation_manager', 'agent'] },
  { name: 'Véhicules', icon: Truck, page: 'Vehicles', roles: ['admin', 'manager', 'exploitation_manager', 'agent', 'support'] },
  { name: 'Documents', icon: FileText, page: 'Documents', roles: ['admin', 'manager', 'exploitation_manager', 'agent', 'support', 'client'] },
  { name: 'Incidents', icon: AlertTriangle, page: 'Incidents', roles: ['admin', 'manager', 'exploitation_manager', 'agent', 'support'] },
  { name: 'Messages', icon: MessageSquare, page: 'Messages', roles: ['admin', 'manager', 'exploitation_manager', 'agent', 'support', 'client', 'driver'] },
  { name: 'Rapports', icon: BarChart3, page: 'Reports', roles: ['admin', 'manager', 'exploitation_manager'] },
  { name: 'IA Assistant', icon: Sparkles, page: 'AIAssistant', roles: ['admin', 'manager', 'exploitation_manager', 'agent'] },
  { name: 'CRM & facturation', icon: LayoutGrid, page: 'CrmDashboard', roles: ['admin', 'manager', 'exploitation_manager', 'agent'] },
  { name: 'Devis (ERP)', icon: FileSpreadsheet, page: 'SalesQuotes', roles: ['admin', 'manager', 'exploitation_manager', 'agent'] },
  { name: 'Fichier clients', icon: BookUser, page: 'ClientsFile', roles: ['admin', 'manager', 'exploitation_manager', 'agent'] },
];

const bottomNav = [
  { name: 'Administration', icon: Settings, page: 'Admin', roles: ['admin'] },
  { name: 'App Chauffeur', icon: Smartphone, page: 'DriverApp', roles: ['driver'] },
];

function userHasRole(user, roles) {
  if (!roles?.length) return true;
  const r = String(user?.user_role ?? "")
    .trim()
    .toLowerCase();
  return roles.some((role) => String(role).toLowerCase() === r);
}

export default function Layout({ children, currentPageName }) {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDriverShell = currentPageName === "DriverApp";

  useTrackingSimulation(Boolean(user) && !isDriverShell);
  useSmartAlerts(Boolean(user) && !isDriverShell);

  const { data: transitNotes = [] } = useQuery({
    queryKey: ["transitNotifications"],
    queryFn: () => appApi.entities.TransitNotification.list("-created_date", 40),
    enabled: !isDriverShell,
  });

  const { data: platformNotes = [] } = useQuery({
    queryKey: ["platformNotifications", user?.user_role],
    queryFn: () => listNotificationsForRole(user?.user_role),
    enabled: Boolean(user) && !isDriverShell,
  });

  /** Recalcul menu quand l’admin modifie les droits modules (même navigateur). */
  useQuery({
    queryKey: ["appControlSettingsSnapshot"],
    queryFn: () => getRoleModuleGrantsOverride(),
    enabled: Boolean(user) && !isDriverShell,
    staleTime: 15_000,
  });

  const unreadTransit = transitNotes.filter((n) => !n.read).length;
  const unreadPlatform = platformNotes.filter((n) => !n.read).length;
  const unreadCount = unreadTransit + unreadPlatform;

  const markOneRead = useMutation({
    mutationFn: (id) => appApi.entities.TransitNotification.update(id, { read: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transitNotifications"] }),
  });

  const markPlatformOneRead = useMutation({
    mutationFn: (id) => markPlatformNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["platformNotifications"] }),
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      const all = await appApi.entities.TransitNotification.list();
      await Promise.all(
        all.filter((n) => !n.read).map((n) => appApi.entities.TransitNotification.update(n.id, { read: true }))
      );
      if (user?.user_role) {
        await markAllPlatformReadForUser(user.user_role);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transitNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["platformNotifications"] });
    },
  });

  // Driver app has its own layout (hooks above must stay unconditional)
  if (isDriverShell) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        :root {
          --brand-blue: #1e40af;
          --brand-blue-light: #3b82f6;
          --brand-dark: #0f172a;
        }
        
        .sidebar-link {
          transition: all 0.2s ease;
        }
        
        .sidebar-link:hover {
          transform: translateX(4px);
        }
        
        .sidebar-link.active {
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%);
          border-left: 3px solid #3b82f6;
        }
      `}</style>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-white/95 backdrop-blur-md border-r border-slate-200/80",
        "shadow-[4px_0_32px_-8px_rgba(15,23,42,0.08)] transform transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="min-h-16 flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-100">
            <Link to={createPageUrl('Dashboard')} className="flex flex-col gap-1 min-w-0 pr-1">
              <img
                src={APP_LOGO_URL}
                alt={`Logo ${APP_NAME}`}
                className="h-9 w-auto max-w-[11.5rem] object-contain object-left"
              />
              <span className="text-[11px] font-semibold text-slate-600 truncate tracking-tight">
                {APP_NAME}
              </span>
              <span className="text-[10px] leading-snug text-slate-500 line-clamp-2">
                {APP_TAGLINE_SHORT}
              </span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation : menu principal scrollable ; « Système » fixé en bas pour que Administration reste visible */}
          <nav className="flex-1 flex flex-col min-h-0 py-4 px-3">
            <div className="flex-1 overflow-y-auto min-h-0 space-y-1 pr-1 -mr-1">
              {navigation
                .filter(
                  (item) =>
                    userHasRole(user, item.roles) && roleHasModuleForPage(user?.user_role, item.page)
                )
                .map((item) => {
                const isActive = currentPageName === item.page;
                return (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.page)}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-blue-50 text-blue-700 active" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isActive && "text-blue-600")} />
                    {item.name}
                    {item.name === 'Incidents' && (
                      <span className="ml-auto px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        2
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="shrink-0 mt-3 pt-4 border-t border-slate-100 bg-white/95">
              <p className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Système
              </p>
              <div className="space-y-1">
                {bottomNav
                  .filter(
                    (item) =>
                      userHasRole(user, item.roles) && roleHasModuleForPage(user?.user_role, item.page)
                  )
                  .map((item) => {
                  const isActive = currentPageName === item.page;
                  const isAdminLink = item.page === "Admin";
                  return (
                    <Link
                      key={item.name}
                      to={createPageUrl(item.page)}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                        isAdminLink &&
                          "bg-violet-50 text-violet-900 border border-violet-200/80 shadow-sm",
                        isAdminLink && isActive && "ring-2 ring-violet-400",
                        !isAdminLink &&
                          (isActive
                            ? "bg-blue-50 text-blue-700 active"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-5 h-5",
                          isAdminLink ? "text-violet-700" : isActive && "text-blue-600"
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* User section */}
          {user && (
            <div className="p-4 border-t border-slate-100">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                  {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {user.full_name || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {getUserRoleLabel(user.user_role)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
          <div className="flex items-center justify-between h-full px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  type="search"
                  placeholder="Rechercher une opération, chauffeur..."
                  className="w-80 pl-10 bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5 text-slate-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[min(100vw-2rem,22rem)] max-h-[min(70vh,24rem)] overflow-y-auto p-0">
                  <div className="flex items-center justify-between border-b px-3 py-2 bg-slate-50/80">
                    <span className="text-sm font-semibold text-slate-900">Centre de notifications</span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        className="text-xs font-medium text-blue-600 hover:underline"
                        onClick={() => markAllRead.mutate()}
                        disabled={markAllRead.isPending}
                      >
                        Tout lu
                      </button>
                    )}
                  </div>

                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-violet-700 flex items-center gap-1 border-b border-slate-100">
                    <Cpu className="w-3.5 h-3.5" />
                    Plateforme &amp; workflow
                  </div>
                  {platformNotes.length === 0 ? (
                    <p className="px-3 py-3 text-center text-xs text-slate-500">Aucune alerte métier</p>
                  ) : (
                    <ul className="py-1 border-b border-slate-100">
                      {platformNotes.slice(0, 14).map((n) => (
                        <li key={n.id} className="border-b border-slate-50 last:border-0">
                          <button
                            type="button"
                            className={`w-full text-left block px-3 py-2 hover:bg-violet-50/60 ${!n.read ? "bg-violet-50/40" : ""}`}
                            onClick={() => !n.read && markPlatformOneRead.mutate(n.id)}
                          >
                            <p className="text-sm font-medium text-slate-900">{n.title}</p>
                            <p className="text-xs text-slate-600 mt-0.5">{n.body}</p>
                            <p className="text-[10px] text-slate-400 mt-1">
                              {format(new Date(n.created_date), "dd/MM/yyyy HH:mm", { locale: fr })}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-blue-700 flex items-center gap-1 border-b border-slate-100">
                    <Sparkles className="w-3.5 h-3.5" />
                    Transit &amp; douane
                  </div>
                  {transitNotes.length === 0 ? (
                    <p className="px-3 py-3 text-center text-xs text-slate-500">Aucune notification douane</p>
                  ) : (
                    <ul className="py-1">
                      {transitNotes.map((n) => (
                        <li key={n.id} className="border-b border-slate-100 last:border-0">
                          <Link
                            to={`${createPageUrl("OperationDetail")}?id=${n.operation_id}`}
                            className={`block px-3 py-2.5 text-left hover:bg-slate-50 ${!n.read ? "bg-blue-50/50" : ""}`}
                            onClick={() => !n.read && markOneRead.mutate(n.id)}
                          >
                            <p className="text-sm font-medium text-slate-900">{n.title}</p>
                            <p className="text-xs text-slate-600 mt-0.5">{n.body}</p>
                            <p className="text-[10px] text-slate-400 mt-1 font-mono">
                              UTC {formatUtcLong(n.occurred_at)} ·{" "}
                              {format(new Date(n.occurred_at), "dd/MM/yyyy HH:mm", { locale: fr })} (affichage local)
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Help */}
              <Button variant="ghost" size="icon" asChild title="Support">
                <a href={`mailto:${COMMERCIAL_SUPPORT_EMAIL}`} aria-label="Contacter le support">
                  <HelpCircle className="w-5 h-5 text-slate-600" />
                </a>
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.full_name?.charAt(0) || 'U'}
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-slate-900">
                      {user?.full_name || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Mon profil
                  </DropdownMenuItem>
                  {userHasRole(user, ["admin"]) && (
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl("Admin")}>
                        <Settings className="w-4 h-4 mr-2" />
                        Administration — comptes &amp; rôles
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600"
                  onClick={() => logout()}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>

        <footer className="border-t border-slate-200/80 bg-slate-50/90 px-4 lg:px-8 py-4 text-[11px] text-slate-600 leading-relaxed space-y-2">
          <p className="font-medium text-slate-700">{COMMERCIAL_EDITION_LABEL}</p>
          <p>{COMMERCIAL_DATA_NOTICE_FR}</p>
          <p lang="en">{COMMERCIAL_DATA_NOTICE_EN}</p>
          <p className="pt-1">
            <a href={`mailto:${COMMERCIAL_SUPPORT_EMAIL}`} className="text-blue-700 hover:underline">
              {COMMERCIAL_SUPPORT_EMAIL}
            </a>
            <span className="mx-1.5 text-slate-300">·</span>
            <a href={COMMERCIAL_WEB_URL} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
              {COMMERCIAL_WEB_URL}
            </a>
            <span className="mx-1.5 text-slate-300">·</span>
            <a href={COMMERCIAL_PRIVACY_URL} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
              Privacy
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}