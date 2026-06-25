import { USER_ROLE_ORDER } from "@/config/userRoles";

/**
 * Matrice « écran → rôles autorisés » — alignée sur `src/App.jsx` (routeConfig).
 * Les **modules métier** (droits par fonction) sont dans `src/config/appModules.js` et
 * `src/auth/accessModules.js`.
 * Sert à l’administration : gestion des accès et pédagogie des profils.
 */
export const ROLE_ACCESS_ROWS = [
  {
    id: "dashboard",
    label: "Tableau de bord",
    path: "/",
    roles: ["admin", "manager", "exploitation_manager", "agent", "support", "client", "driver"],
  },
  {
    id: "operations",
    label: "Opérations (liste & détail)",
    path: "/operations",
    roles: ["admin", "manager", "exploitation_manager", "agent", "support", "client"],
  },
  {
    id: "new_operation",
    label: "Nouvelle opération",
    path: "/operations/new",
    roles: ["admin", "manager", "exploitation_manager", "agent"],
  },
  {
    id: "live_map",
    label: "Carte temps réel",
    path: "/live-map",
    roles: ["admin", "manager", "exploitation_manager", "agent", "support"],
  },
  {
    id: "fleet",
    label: "Flotte (tableaux de bord, maintenance, alertes…)",
    path: "/flotte",
    roles: ["admin", "manager", "exploitation_manager", "agent", "support"],
  },
  {
    id: "drivers",
    label: "Chauffeurs",
    path: "/drivers",
    roles: ["admin", "manager", "exploitation_manager", "agent"],
  },
  {
    id: "driver_app",
    label: "Application chauffeur",
    path: "/driver-app",
    roles: ["driver"],
  },
  {
    id: "vehicles",
    label: "Véhicules",
    path: "/vehicles",
    roles: ["admin", "manager", "exploitation_manager", "agent", "support"],
  },
  {
    id: "documents",
    label: "Documents",
    path: "/documents",
    roles: ["admin", "manager", "exploitation_manager", "agent", "support", "client"],
  },
  {
    id: "incidents",
    label: "Incidents",
    path: "/incidents",
    roles: ["admin", "manager", "exploitation_manager", "agent", "support"],
  },
  {
    id: "messages",
    label: "Messages",
    path: "/messages",
    roles: ["admin", "manager", "exploitation_manager", "agent", "support", "client", "driver"],
  },
  {
    id: "reports",
    label: "Rapports",
    path: "/reports",
    roles: ["admin", "manager", "exploitation_manager"],
  },
  {
    id: "admin",
    label: "Administration (comptes, rôles, traçabilité)",
    path: "/admin",
    roles: ["admin"],
  },
  {
    id: "ai",
    label: "Assistant IA",
    path: "/ai-assistant",
    roles: ["admin", "manager", "exploitation_manager", "agent"],
  },
  {
    id: "crm",
    label: "CRM (devis, fichier clients)",
    path: "/crm",
    roles: ["admin", "manager", "exploitation_manager", "agent"],
  },
];

export const MATRIX_ROLE_KEYS = USER_ROLE_ORDER;

export function roleHasAccessToRow(role, row) {
  const r = String(role || "").toLowerCase();
  return Boolean(row?.roles?.some((x) => String(x).toLowerCase() === r));
}
