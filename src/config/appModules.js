/**
 * Modules fonctionnels — transport & logistique national / international.
 * Chaque entrée de menu (Layout) et chaque route (App) référence un `moduleId`.
 * Les rôles reçoivent une liste de modules : `src/auth/accessModules.js`.
 */

/** @typedef {'national' | 'international' | 'global' | 'commercial' | 'system' | 'field'} ModuleScope */

/** @type {{ id: string, label: string, description: string, scope: ModuleScope, pages: string[] }[]} */
export const APP_MODULES = [
  {
    id: "dashboard",
    label: "Pilotage & synthèse",
    description: "Vue d’ensemble des indicateurs et missions.",
    scope: "global",
    pages: ["Dashboard"],
  },
  {
    id: "transport_ops",
    label: "Opérations transport",
    description: "Dossiers routiers nationaux et flux internationaux (détail, création).",
    scope: "national",
    pages: ["Operations", "OperationDetail", "NewOperation"],
  },
  {
    id: "tracking_live",
    label: "Suivi temps réel",
    description: "Carte et visibilité opérationnelle (national / international).",
    scope: "global",
    pages: ["LiveMap"],
  },
  {
    id: "fleet_tower",
    label: "Tour de contrôle flotte",
    description: "Hub flotte : alertes, maintenance, ISO, suivi transfrontalier.",
    scope: "international",
    pages: ["FleetDashboard"],
  },
  {
    id: "fleet_drivers",
    label: "Ressources humaines — chauffeurs",
    description: "Fiches chauffeurs, visas, affectations.",
    scope: "global",
    pages: ["Drivers"],
  },
  {
    id: "fleet_vehicles",
    label: "Parc & véhicules",
    description: "Tracteurs, semi-remorques, maintenance.",
    scope: "global",
    pages: ["Vehicles", "VehicleDetail"],
  },
  {
    id: "compliance_docs",
    label: "Documents & conformité",
    description: "Pièces douanières, CMR, preuves de livraison.",
    scope: "international",
    pages: ["Documents"],
  },
  {
    id: "support_incidents",
    label: "Support & incidents",
    description: "Gestion des anomalies et assistance exploitation.",
    scope: "global",
    pages: ["Incidents"],
  },
  {
    id: "collab_messages",
    label: "Messagerie & coordination",
    description: "Échanges internes / clients / terrain.",
    scope: "global",
    pages: ["Messages"],
  },
  {
    id: "bi_reports",
    label: "Reporting & BI",
    description: "Indicateurs direction et exploitation avancée.",
    scope: "global",
    pages: ["Reports"],
  },
  {
    id: "ai_workspace",
    label: "IA & aide à la décision",
    description: "Assistant contextuel opérations et risques.",
    scope: "global",
    pages: ["AIAssistant"],
  },
  {
    id: "crm_commercial",
    label: "CRM & affaires",
    description: "Devis, fichier clients, pipeline commercial.",
    scope: "commercial",
    pages: ["CrmDashboard", "SalesQuotes", "ClientsFile"],
  },
  {
    id: "system_admin",
    label: "Administration & sécurité",
    description: "Comptes, rôles, traçabilité, paramètres.",
    scope: "system",
    pages: ["Admin"],
  },
  {
    id: "field_driver",
    label: "Application chauffeur",
    description: "Interface terrain — missions et statuts.",
    scope: "field",
    pages: ["DriverApp"],
  },
];

const MODULE_IDS = APP_MODULES.map((m) => m.id);

export function getModuleById(id) {
  return APP_MODULES.find((m) => m.id === id) || null;
}

/** Tous les ids (pour rôle admin). */
export function allModuleIds() {
  return [...MODULE_IDS];
}

/** Pages couvertes par un ensemble de modules. */
export function pagesFromModuleIds(ids) {
  const set = new Set();
  for (const id of ids || []) {
    const m = getModuleById(id);
    if (m) m.pages.forEach((p) => set.add(p));
  }
  return set;
}
