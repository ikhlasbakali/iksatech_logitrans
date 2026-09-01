# Lot B — Drivers & Vehicles

## Drivers

- `GET /api/drivers` — Liste tous les chauffeurs avec leur user et véhicule actuel.
- `POST /api/drivers` — Crée un chauffeur. Requiert `user_id`, `first_name`, `last_name`, `phone`, `license_number`, `license_type`.
- `GET /api/drivers/{id}` — Détail d'un chauffeur.
- `PUT /api/drivers/{id}` — Met à jour un chauffeur.
- `DELETE /api/drivers/{id}` — Supprime un chauffeur.

## Vehicles

- `GET /api/vehicles` — Liste tous les véhicules avec leur chauffeur actuel.
- `POST /api/vehicles` — Crée un véhicule. Requiert `plate_number`, `vehicle_type`. `current_driver_id` doit être unique (un chauffeur = un seul véhicule à la fois).
- `GET /api/vehicles/{id}` — Détail d'un véhicule (avec coûts et historique de maintenance).
- `PUT /api/vehicles/{id}` — Met à jour un véhicule.
- `DELETE /api/vehicles/{id}` — Supprime un véhicule.