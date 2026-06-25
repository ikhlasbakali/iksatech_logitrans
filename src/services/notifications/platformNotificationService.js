/**
 * Notifications métier filtrées par rôle (en complément des alertes douane / transit).
 */
import { dataRepository } from "@/services/repository/dataRepository";

export async function listNotificationsForRole(userRole) {
  const role = String(userRole || "")
    .trim()
    .toLowerCase();
  const all = await dataRepository.platformNotifications.list("-created_date", 80);
  return all.filter(
    (n) => !n.target_roles?.length || n.target_roles.some((r) => String(r).toLowerCase() === role)
  );
}

export async function markPlatformNotificationRead(id) {
  return dataRepository.platformNotifications.update(id, { read: true });
}

export async function markAllPlatformReadForUser(userRole) {
  const items = await listNotificationsForRole(userRole);
  await Promise.all(items.filter((n) => !n.read).map((n) => markPlatformNotificationRead(n.id)));
}
