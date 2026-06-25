/**
 * Intégration tableau de bord logistique / flotte (API Express recommandée sur 8081).
 *
 * Variables d’environnement :
 * - `VITE_LOGISTICS_API_URL` : ex. `http://localhost:8081` (sans slash final).
 * - En dev, si la variable est vide, les appels utilisent `/api/*` → proxy Vite vers 8081 (voir vite.config.js).
 *
 * Champs dashboard sans équivalent Operation : les ajouter côté API + schéma JSON,
 * puis étendre `FleetDashboardMissionRow` et le mapper.
 */

export * from "./types";
export * from "./mapOperationToDashboardMission";
export * from "./logisticsApi";
