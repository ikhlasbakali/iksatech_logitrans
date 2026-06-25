import React from "react";
import { Navigate, Route, Routes, matchPath, useLocation } from "react-router-dom";
import Layout from "@/Layout";
import { useAuth } from "@/auth/AuthContext";
import Dashboard from "@/pages/Dashboard";
import Operations from "@/pages/Operations";
import OperationDetail from "@/pages/OperationDetail";
import NewOperation from "@/pages/NewOperation";
import LiveMap from "@/pages/LiveMap";
import Drivers from "@/pages/Drivers";
import DriverApp from "@/pages/DriverApp";
import Vehicles from "@/pages/Vehicles";
import VehicleDetail from "@/pages/VehicleDetail";
import Documents from "@/pages/Documents";
import Incidents from "@/pages/Incidents";
import Messages from "@/pages/Messages";
import Reports from "@/pages/Reports";
import Admin from "@/pages/Admin";
import AIAssistant from "@/pages/AIAssistant";
import CrmDashboardPage from "@/pages/CrmDashboardPage";
import SalesQuotesPage from "@/pages/SalesQuotesPage";
import ClientsFilePage from "@/pages/ClientsFilePage";
import FleetDashboardPage from "@/pages/FleetDashboardPage";
import FleetDetailPage from "@/pages/FleetDetailPage";
import FleetLoadingAlertsPage from "@/pages/FleetLoadingAlertsPage";
import FleetMaintenanceHubPage from "@/pages/FleetMaintenanceHubPage";
import FleetIsoExploitationPage from "@/pages/FleetIsoExploitationPage";
import FleetInternationalTrackingPage from "@/pages/FleetInternationalTrackingPage";
import Login from "@/pages/Login";
import { roleHasModuleForPage } from "@/auth/accessModules";

const routeConfig = [
  { path: "/login", page: "Login", element: <Login /> },
  { path: "/", page: "Dashboard", element: <Dashboard />, allowedRoles: ["admin", "manager", "exploitation_manager", "agent", "support", "client", "driver"] },
  { path: "/operations", page: "Operations", element: <Operations />, allowedRoles: ["admin", "manager", "exploitation_manager", "agent", "support", "client"] },
  { path: "/operations/detail", page: "OperationDetail", element: <OperationDetail />, allowedRoles: ["admin", "manager", "exploitation_manager", "agent", "support", "client"] },
  { path: "/operations/new", page: "NewOperation", element: <NewOperation />, allowedRoles: ["admin", "manager", "exploitation_manager", "agent"] },
  { path: "/live-map", page: "LiveMap", element: <LiveMap />, allowedRoles: ["admin", "manager", "exploitation_manager", "agent", "support"] },
  { path: "/flotte/detail", page: "FleetDashboard", element: <FleetDetailPage />, allowedRoles: ["admin", "manager", "exploitation_manager", "agent", "support"] },
  { path: "/flotte/alertes-chargement", page: "FleetDashboard", element: <FleetLoadingAlertsPage />, allowedRoles: ["admin", "manager", "exploitation_manager", "agent", "support"] },
  { path: "/flotte/maintenance-flotte", page: "FleetDashboard", element: <FleetMaintenanceHubPage />, allowedRoles: ["admin", "manager", "exploitation_manager", "agent", "support"] },
  { path: "/flotte/exploitation-iso", page: "FleetDashboard", element: <FleetIsoExploitationPage />, allowedRoles: ["admin", "manager", "exploitation_manager", "agent", "support"] },
  { path: "/flotte/suivi-inter", page: "FleetDashboard", element: <FleetInternationalTrackingPage />, allowedRoles: ["admin", "manager", "exploitation_manager", "agent", "support"] },
  { path: "/flotte", page: "FleetDashboard", element: <FleetDashboardPage />, allowedRoles: ["admin", "manager", "exploitation_manager", "agent", "support"] },
  { path: "/drivers", page: "Drivers", element: <Drivers />, allowedRoles: ["admin", "manager", "exploitation_manager", "agent"] },
  { path: "/driver-app", page: "DriverApp", element: <DriverApp />, allowedRoles: ["driver"] },
  { path: "/vehicles", page: "Vehicles", element: <Vehicles />, allowedRoles: ["admin", "manager", "exploitation_manager", "agent", "support"] },
  { path: "/vehicles/detail", page: "VehicleDetail", element: <VehicleDetail />, allowedRoles: ["admin", "manager", "exploitation_manager", "agent", "support"] },
  { path: "/documents", page: "Documents", element: <Documents />, allowedRoles: ["admin", "manager", "exploitation_manager", "agent", "support", "client"] },
  { path: "/incidents", page: "Incidents", element: <Incidents />, allowedRoles: ["admin", "manager", "exploitation_manager", "agent", "support"] },
  { path: "/messages", page: "Messages", element: <Messages />, allowedRoles: ["admin", "manager", "exploitation_manager", "agent", "support", "client", "driver"] },
  { path: "/reports", page: "Reports", element: <Reports />, allowedRoles: ["admin", "manager", "exploitation_manager"] },
  { path: "/admin", page: "Admin", element: <Admin />, allowedRoles: ["admin"] },
  { path: "/ai-assistant", page: "AIAssistant", element: <AIAssistant />, allowedRoles: ["admin", "manager", "exploitation_manager", "agent"] },
  { path: "/crm/devis", page: "SalesQuotes", element: <SalesQuotesPage />, allowedRoles: ["admin", "manager", "exploitation_manager", "agent"] },
  {
    path: "/crm/clients-fichier",
    page: "ClientsFile",
    element: <ClientsFilePage />,
    allowedRoles: ["admin", "manager", "exploitation_manager", "agent"],
  },
  { path: "/crm", page: "CrmDashboard", element: <CrmDashboardPage />, allowedRoles: ["admin", "manager", "exploitation_manager", "agent"] },
];

const getCurrentPage = (pathname) => {
  const match = routeConfig.find((route) =>
    matchPath({ path: route.path, end: true }, pathname)
  );
  if (match) return match.page;
  if (pathname.startsWith("/flotte")) return "FleetDashboard";
  return "Dashboard";
};

const defaultRouteByRole = {
  admin: "/",
  manager: "/",
  exploitation_manager: "/",
  agent: "/",
  support: "/",
  client: "/",
  driver: "/driver-app",
};

function roleAllowed(userRole, allowedRoles) {
  if (!allowedRoles?.length) return true;
  const r = String(userRole ?? "")
    .trim()
    .toLowerCase();
  return allowedRoles.some((a) => String(a).toLowerCase() === r);
}

function RequireAuth({ children, allowedRoles, page }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !roleAllowed(user.user_role, allowedRoles)) {
    const key = String(user.user_role ?? "")
      .trim()
      .toLowerCase();
    const dest =
      defaultRouteByRole[key] ||
      defaultRouteByRole[user.user_role] ||
      "/";
    return <Navigate to={dest} replace />;
  }
  if (page && !roleHasModuleForPage(user.user_role, page)) {
    const key = String(user.user_role ?? "")
      .trim()
      .toLowerCase();
    const dest = defaultRouteByRole[key] || defaultRouteByRole[user.user_role] || "/";
    return <Navigate to={dest} replace />;
  }
  return children;
}

export default function App() {
  const location = useLocation();
  const currentPageName = getCurrentPage(location.pathname);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="*"
        element={
          <RequireAuth>
            <Layout currentPageName={currentPageName}>
              <Routes>
                {routeConfig
                  .filter((route) => route.path !== "/login")
                  .map((route) => (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        route.allowedRoles ? (
                          <RequireAuth allowedRoles={route.allowedRoles} page={route.page}>
                            {route.element}
                          </RequireAuth>
                        ) : (
                          route.element
                        )
                      }
                    />
                  ))}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </RequireAuth>
        }
      />
    </Routes>
  );
}

