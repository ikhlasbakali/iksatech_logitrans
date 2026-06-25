import { APP_MODULES, allModuleIds } from "@/config/appModules";
import { getRoleModuleGrantsOverride } from "@/api/appApi";

/**
 * Modules autorisés par rôle applicatif.
 * À adapter si vous introduisez des droits fins par utilisateur (ex. `user.module_ids`).
 */
const BASE_EXCEPT = (exclude) => allModuleIds().filter((id) => !exclude.includes(id));

export const ROLE_MODULE_IDS = {
  admin: allModuleIds(),
  manager: BASE_EXCEPT(["system_admin", "field_driver"]),
  exploitation_manager: BASE_EXCEPT(["system_admin", "field_driver"]),
  agent: BASE_EXCEPT(["bi_reports", "system_admin", "field_driver"]),
  support: BASE_EXCEPT([
    "fleet_drivers",
    "bi_reports",
    "ai_workspace",
    "crm_commercial",
    "system_admin",
    "field_driver",
  ]),
  client: ["dashboard", "transport_ops", "compliance_docs", "collab_messages"],
  driver: ["dashboard", "collab_messages", "field_driver"],
};

/** Copie des jeux par défaut (avant toute personnalisation admin). */
export function buildDefaultRoleModuleGrantsSnapshot() {
  return Object.fromEntries(Object.entries(ROLE_MODULE_IDS).map(([k, v]) => [k, [...v]]));
}

/**
 * @param {string | undefined} role
 * @returns {string[]}
 */
export function getModuleIdsForRole(role) {
  const r = String(role || "")
    .trim()
    .toLowerCase();
  const custom = getRoleModuleGrantsOverride();
  if (custom && Object.prototype.hasOwnProperty.call(custom, r) && Array.isArray(custom[r])) {
    return [...custom[r]];
  }
  return ROLE_MODULE_IDS[r] ? [...ROLE_MODULE_IDS[r]] : [];
}

/**
 * @param {string | undefined} role
 * @param {string} moduleId
 */
export function roleHasModule(role, moduleId) {
  const mid = String(moduleId || "").trim();
  if (!mid) return true;
  return getModuleIdsForRole(role).includes(mid);
}

/**
 * @param {string | undefined} role
 * @param {string} pageName — même clé que `page` dans Layout / App (`Dashboard`, `Operations`, …)
 */
export function roleHasModuleForPage(role, pageName) {
  const page = String(pageName || "").trim();
  if (!page) return false;
  const mod = APP_MODULES.find((m) => m.pages.includes(page));
  if (!mod) return true;
  return roleHasModule(role, mod.id);
}
