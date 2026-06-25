import { appApi, appendOperationTimelineEvent } from "@/api/appApi";
import { formatLocalLong, formatUtcLong } from "@/utils/international";

/**
 * Enregistre l’arrivée au point (douane ou coordonnées), historise et notifie l’exploitation.
 */
export async function recordCheckpointArrival({
  checkpoint,
  operation,
  actorName,
  arrivedLat,
  arrivedLng,
}) {
  const arrivedAt = new Date().toISOString();
  const label = checkpoint.label || "Point de contrôle";
  const kindLabel =
    checkpoint.checkpoint_kind === "customs_office" ? "Bureau de douane" : "Position GPS / point exact";

  await appApi.entities.CustomsCheckpoint.update(checkpoint.id, {
    status: "arrived",
    arrived_at: arrivedAt,
    arrived_by_name: actorName || "Exploitation",
    ...(arrivedLat != null && arrivedLng != null
      ? { arrived_lat: Number(arrivedLat), arrived_lng: Number(arrivedLng) }
      : {}),
  });

  const descParts = [
    `${kindLabel} : ${label}`,
    checkpoint.address ? `Lieu : ${checkpoint.address}` : null,
    checkpoint.country_code ? `Pays (ISO) : ${checkpoint.country_code}` : null,
    checkpoint.customs_reference ? `Réf. douanière / MRN : ${checkpoint.customs_reference}` : null,
    `Heure UTC : ${formatUtcLong(arrivedAt)}`,
    `Heure locale (navigateur) : ${formatLocalLong(arrivedAt)}`,
    checkpoint.lat != null && checkpoint.lng != null
      ? `Coordonnées cible : ${Number(checkpoint.lat).toFixed(5)}, ${Number(checkpoint.lng).toFixed(5)}`
      : null,
    arrivedLat != null && arrivedLng != null
      ? `Coordonnées à l’arrivée : ${Number(arrivedLat).toFixed(5)}, ${Number(arrivedLng).toFixed(5)}`
      : null,
    `Rayon de validation (géofence conseillé) : ${checkpoint.radius_meters || 500} m`,
  ].filter(Boolean);

  appendOperationTimelineEvent({
    operation_id: operation.id,
    type: "customs_passage",
    title: `Arrivée confirmée — ${label}`,
    description: descParts.join(" · "),
    actor: actorName || "Exploitation",
    created_date: arrivedAt,
  });

  await appApi.entities.TransitNotification.create({
    operation_id: operation.id,
    operation_ref: operation.reference || operation.id,
    checkpoint_id: checkpoint.id,
    title: "Arrivée sur point de contrôle / douane",
    body: `${label} — dossier ${operation.reference || operation.id}`,
    occurred_at: arrivedAt,
    read: false,
    detail_summary: descParts.join("\n"),
  });

  return { arrivedAt };
}
