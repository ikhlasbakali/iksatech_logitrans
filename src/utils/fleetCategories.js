/** Catégorie d’actif routier — statistiques tracteurs / remorques séparées */

export const ASSET_TRACTOR = "tractor";
export const ASSET_TRAILER = "trailer";

/**
 * Détermine si l’enregistrement est un tracteur ou une remorque.
 * @param {{ asset_category?: string, type?: string }} vehicle
 */
export function getVehicleAssetCategory(vehicle) {
  if (vehicle?.asset_category === ASSET_TRAILER || vehicle?.asset_category === ASSET_TRACTOR) {
    return vehicle.asset_category;
  }
  const t = vehicle?.type;
  if (t === "semi_trailer") return ASSET_TRAILER;
  return ASSET_TRACTOR;
}

export function partitionFleet(vehicles) {
  const list = Array.isArray(vehicles) ? vehicles : [];
  const tractors = list.filter((v) => getVehicleAssetCategory(v) === ASSET_TRACTOR);
  const trailers = list.filter((v) => getVehicleAssetCategory(v) === ASSET_TRAILER);
  return { tractors, trailers };
}

function isVehicleActive(v) {
  return v?.status === "in_use" || v?.status === "in_transit";
}

/**
 * Statistiques indépendantes tracteurs vs remorques (total, dispo, en service, maintenance).
 */
export function fleetStatsByCategory(vehicles) {
  const { tractors, trailers } = partitionFleet(vehicles);
  const block = (list) => ({
    total: list.length,
    available: list.filter((v) => v.status === "available").length,
    active: list.filter(isVehicleActive).length,
    maintenance: list.filter((v) => v.status === "maintenance").length,
  });
  return {
    tractors: block(tractors),
    trailers: block(trailers),
  };
}

export const assetCategoryLabels = {
  [ASSET_TRACTOR]: "Tracteur",
  [ASSET_TRAILER]: "Remorque",
};
