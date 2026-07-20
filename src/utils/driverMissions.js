/**
 * Aide-mémoire métier : missions chauffeur dérivées des opérations (driver_id / driver2_id).
 */

/** @param {string | undefined} status */
export function operationStatusToDriverStep(status) {
  if (status === "incident") return "in_transit";
  const map = {
    draft: "assigned",
    confirmed: "assigned",
    assigned: "assigned",
    loading: "loading",
    in_transit: "in_transit",
    unloading: "unloading",
    delivered: "delivered",
    completed: "delivered",
    cancelled: "assigned",
  };
  return map[status] || "assigned";
}

/**
 * @param {string | undefined} current
 * @returns {string | null}
 */
export function getNextOperationStatus(current) {
  if (current === "incident" || current === "cancelled") return null;
  const flow = {
    draft: "confirmed",
    confirmed: "assigned",
    assigned: "loading",
    loading: "in_transit",
    in_transit: "unloading",
    unloading: "delivered",
  };
  if (current === "delivered" || current === "completed") return null;
  return flow[current] ?? null;
}

/**
 * @param {object} user
 * @param {object[]} drivers
 * @returns {string | null}
 */
export function resolveDriverId(user, drivers = []) {
  if (!user || String(user.user_role || "").toLowerCase() !== "driver") return null;
  if (user.linked_driver_id) return user.linked_driver_id;
  const full = (user.full_name || "").trim().toLowerCase();
  if (!full) return null;
  const hit = drivers.find(
    (d) => `${d.first_name} ${d.last_name}`.trim().toLowerCase() === full
  );
  return hit?.id ?? null;
}

/**
 * @param {object[]} operations
 * @param {string | null} driverId
 * @param {string | undefined} driverFullName
 */
export function filterOperationsForDriver(operations, driverId, driverFullName) {
  if (!driverId && !driverFullName) return [];
  const name = (driverFullName || "").trim().toLowerCase();
  return operations.filter((op) => {
    if (driverId && (op.driver_id === driverId || op.driver2_id === driverId)) return true;
    if (name && op.driver_name && op.driver_name.trim().toLowerCase() === name) return true;
    if (name && op.driver2_name && op.driver2_name.trim().toLowerCase() === name) return true;
    return false;
  });
}

function pickupCompleted(op) {
  const s = op.status;
  return (
    Boolean(op.actual_pickup) ||
    ["loading", "in_transit", "unloading", "delivered", "completed"].includes(s)
  );
}

function deliveryCompleted(op) {
  const s = op.status;
  return Boolean(op.actual_delivery) || ["delivered", "completed"].includes(s);
}

function parseTime(iso) {
  if (!iso) return new Date();
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

/**
 * @param {object} op — entité Operation (appApi)
 */
export function operationToMission(op) {
  const step = operationStatusToDriverStep(op.status);
  return {
    id: op.id,
    operationId: op.id,
    reference: op.reference,
    client: op.client_name,
    status: step,
    operationStatus: op.status,
    pickup: {
      address: op.pickup_address || op.pickup_city || "—",
      city: op.pickup_city || "—",
      time: parseTime(op.scheduled_pickup || op.actual_pickup),
      completed: pickupCompleted(op),
    },
    delivery: {
      address: op.delivery_address || op.delivery_city || "—",
      city: op.delivery_city || "—",
      time: parseTime(op.scheduled_delivery || op.actual_delivery || op.eta),
      completed: deliveryCompleted(op),
    },
    cargo: op.cargo_description || "Fret (voir dossier)",
    priority: op.priority || "medium",
    instructions: op.special_instructions || "",
  };
}
