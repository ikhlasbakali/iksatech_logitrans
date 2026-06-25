import type { FleetDashboardMissionRow, LogisticsApiMissionsResponse, LogisticsStatisticsDto } from "./types";

function apiBase(): string {
  const env = (import.meta.env.VITE_LOGISTICS_API_URL as string | undefined)?.replace(/\/$/, "");
  if (env) return env;
  return "";
}

function joinUrl(path: string): string {
  const base = apiBase();
  if (base) return `${base}${path.startsWith("/") ? path : `/${path}`}`;
  return path.startsWith("/") ? path : `/${path}`;
}

/** Réponse JSON tolérante (tableau racine ou enveloppe) */
function normalizeMissionsPayload(json: unknown): FleetDashboardMissionRow[] {
  if (Array.isArray(json)) return json as FleetDashboardMissionRow[];
  const o = json as LogisticsApiMissionsResponse;
  if (Array.isArray(o?.missions)) return o.missions;
  if (Array.isArray(o?.data)) return o.data;
  if (Array.isArray(o?.rows)) return o.rows;
  return [];
}

/**
 * GET missions depuis le service Express (8081) ou proxy Vite `/api`.
 * En absence de backend : retourner [] (le front peut fallback sur appApi.entities.Operation).
 */
export async function fetchLogisticsMissions(init?: RequestInit): Promise<FleetDashboardMissionRow[]> {
  const url = joinUrl("/api/missions");
  const res = await fetch(url, { ...init, headers: { Accept: "application/json", ...init?.headers } });
  if (!res.ok) throw new Error(`missions ${res.status}`);
  const json = await res.json();
  return normalizeMissionsPayload(json);
}

export async function fetchLogisticsStatistics(init?: RequestInit): Promise<LogisticsStatisticsDto> {
  const url = joinUrl("/api/statistics");
  const res = await fetch(url, { ...init, headers: { Accept: "application/json", ...init?.headers } });
  if (!res.ok) throw new Error(`statistics ${res.status}`);
  return (await res.json()) as LogisticsStatisticsDto;
}

export async function postLogisticsSync(init?: RequestInit): Promise<unknown> {
  const url = joinUrl("/api/sync");
  const res = await fetch(url, { method: "POST", ...init });
  if (!res.ok) throw new Error(`sync ${res.status}`);
  return res.json().catch(() => ({}));
}

export async function fetchLogisticsStatus(init?: RequestInit): Promise<unknown> {
  const url = joinUrl("/api/status");
  const res = await fetch(url, { ...init, headers: { Accept: "application/json", ...init?.headers } });
  if (!res.ok) throw new Error(`status ${res.status}`);
  return res.json();
}
