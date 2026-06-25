/**
 * Profils utilisateur (rôles) — utilisés pour les menus, routes et page Administration.
 * Pour modifier qui voit quoi : src/Layout.jsx (navigation) et src/App.jsx (routes).
 * Règle métier : la création et la modification des comptes (tous profils) sont réservées
 * à l’administrateur — les autres rôles n’y ont pas accès (voir appApi User + route /admin).
 */

export const USER_ROLE_ORDER = [
  "admin",
  "manager",
  "exploitation_manager",
  "agent",
  "support",
  "driver",
  "client",
];

/** @typedef {{ label: string, category: string, categoryKey: string, color: string, description: string, access: string[] }} RoleMeta */

/** @type {Record<string, RoleMeta>} */
export const USER_ROLE_META = {
  admin: {
    label: "Administrateur",
    category: "Direction",
    categoryKey: "direction",
    color: "bg-purple-100 text-purple-700",
    description:
      "Seul rôle habilité à créer, modifier et désactiver les comptes (agents, chauffeurs, clients, managers, etc.). Accès complet au reste de l’application.",
    access: [
      "Page Administration — gestion exclusive des utilisateurs, rôles, modules et traçabilité",
      "Tout le menu applicatif (exploitation, flotte, rapports, etc.)",
      "Rapports, IA assistant, gestion chauffeurs / véhicules / incidents",
    ],
  },
  manager: {
    label: "Manager",
    category: "Exploitation",
    categoryKey: "exploitation",
    color: "bg-blue-100 text-blue-700",
    description:
      "Pilotage opérationnel, flotte et reporting. Pas de gestion des comptes : seul l’administrateur crée ou modifie les utilisateurs.",
    access: [
      "Opérations, carte temps réel, chauffeurs, véhicules, documents, incidents, messages",
      "Rapports et IA assistant",
      "Pas : création de comptes (agents, chauffeurs, clients) — réservé administrateur",
    ],
  },
  exploitation_manager: {
    label: "Responsable exploitation",
    category: "Exploitation",
    categoryKey: "exploitation",
    color: "bg-indigo-100 text-indigo-700",
    description:
      "Même périmètre opérationnel qu’un manager. Les comptes utilisateurs sont gérés uniquement par l’administrateur.",
    access: [
      "Opérations, carte, chauffeurs, véhicules, documents, incidents, messages",
      "Rapports et IA assistant",
      "Pas : gestion des comptes et rôles — réservé administrateur",
    ],
  },
  agent: {
    label: "Opérateur flux",
    category: "Exploitation",
    categoryKey: "exploitation",
    color: "bg-green-100 text-green-700",
    description:
      "Traitement des dossiers et suivi quotidien. Ne crée pas les comptes chauffeur, client ou collègues : l’administrateur s’en charge.",
    access: [
      "Opérations, carte, chauffeurs, véhicules, documents, incidents, messages",
      "IA assistant",
      "Pas d’accès Rapports (statistiques direction)",
      "Pas : Administration / création d’utilisateurs",
    ],
  },
  support: {
    label: "Support technique",
    category: "Exploitation",
    categoryKey: "exploitation",
    color: "bg-amber-100 text-amber-700",
    description:
      "Assistance et visibilité sur les dossiers. Aucune gestion des comptes ni des profils (réservé administrateur).",
    access: [
      "Opérations, carte, véhicules, documents, incidents, messages",
      "Pas : Chauffeurs, Rapports, IA assistant",
      "Pas : création ou modification des comptes utilisateurs",
    ],
  },
  driver: {
    label: "Chauffeur",
    category: "Terrain",
    categoryKey: "terrain",
    color: "bg-slate-100 text-slate-700",
    description:
      "Interface terrain : missions et messages. Compte créé et relié à sa fiche chauffeur par l’administrateur.",
    access: [
      "Dashboard (ses statistiques et missions)",
      "Messages",
      "Application « App Chauffeur »",
      "Pas : gestion des comptes ou des autres utilisateurs",
    ],
  },
  client: {
    label: "Client",
    category: "Externe",
    categoryKey: "externe",
    color: "bg-cyan-100 text-cyan-800",
    description:
      "Suivi de ses transports. Compte ouvert et géré par l’administrateur (invitation, mot de passe, désactivation).",
    access: [
      "Dashboard",
      "Opérations (consultation)",
      "Documents",
      "Messages",
      "Pas : création d’autres comptes ni accès interne exploitation",
    ],
  },
};

/** @param {string | undefined} role */
export function getUserRoleLabel(role) {
  if (!role) return "Utilisateur";
  return USER_ROLE_META[role]?.label || role;
}

/** Pour formulaires : liste { value, label } */
export function userRoleSelectOptions() {
  return USER_ROLE_ORDER.map((key) => ({
    value: key,
    label: USER_ROLE_META[key]?.label || key,
  }));
}

const CATEGORY_LABELS = {
  direction: "Direction & IT",
  exploitation: "Équipes exploitation",
  terrain: "Terrain",
  externe: "Partenaires & clients",
};

export function rolesGroupedByCategory() {
  /** @type {Record<string, { categoryLabel: string, roles: string[] }>} */
  const groups = {};
  for (const key of USER_ROLE_ORDER) {
    const meta = USER_ROLE_META[key];
    if (!meta) continue;
    const ck = meta.categoryKey;
    if (!groups[ck]) {
      groups[ck] = { categoryLabel: CATEGORY_LABELS[ck] || meta.category, roles: [] };
    }
    groups[ck].roles.push(key);
  }
  return ["direction", "exploitation", "terrain", "externe"]
    .filter((k) => groups[k])
    .map((k) => ({ key: k, ...groups[k] }));
}
