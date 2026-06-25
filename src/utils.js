const pageRoutes = {
  Dashboard: "/",
  Operations: "/operations",
  OperationDetail: "/operations/detail",
  NewOperation: "/operations/new",
  LiveMap: "/live-map",
  FleetDashboard: "/flotte",
  FleetDetail: "/flotte/detail",
  FleetLoadingAlerts: "/flotte/alertes-chargement",
  FleetMaintenanceHub: "/flotte/maintenance-flotte",
  FleetIsoExploitation: "/flotte/exploitation-iso",
  FleetInternationalTracking: "/flotte/suivi-inter",
  Drivers: "/drivers",
  DriverApp: "/driver-app",
  Vehicles: "/vehicles",
  VehicleDetail: "/vehicles/detail",
  Documents: "/documents",
  Incidents: "/incidents",
  Messages: "/messages",
  Reports: "/reports",
  Admin: "/admin",
  AIAssistant: "/ai-assistant",
  CrmDashboard: "/crm",
  SalesQuotes: "/crm/devis",
  ClientsFile: "/crm/clients-fichier",
};

export function createPageUrl(pageName) {
  return pageRoutes[pageName] || "/";
}

export const pages = pageRoutes;

