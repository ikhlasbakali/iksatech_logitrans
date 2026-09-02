# Lot A — Operations & OperationEvents

## Operations

- `GET /api/operations` — Liste toutes les operations avec client, chauffeurs, vehicule et agent assigne.
- `POST /api/operations` — Cree une operation. Requiert `reference`, `client_id`, `type`. Genere automatiquement un OperationEvent de type `created`.
- `GET /api/operations/{id}` — Detail d'une operation (avec historique des evenements).
- `PUT /api/operations/{id}` — Met a jour une operation. Si le `status` change, verifie que la transition est autorisee (voir workflow ci-dessous) et genere un OperationEvent de type `status_change`.
- `DELETE /api/operations/{id}` — Supprime une operation.

### Workflow des statuts

`draft` -> `confirmed` -> `assigned` -> `loading` -> `in_transit` -> `unloading` -> `delivered` -> `completed`
`cancelled` possible depuis `draft`, `confirmed`, `assigned`, `loading`.
`incident` possible depuis `loading`, `in_transit`, `unloading`, avec retour possible vers `in_transit`, `unloading` ou `cancelled`.

## OperationEvents

- `GET /api/operation-events` — Liste tous les evenements avec l'operation et l'acteur lies.
- `POST /api/operation-events` — Cree un evenement manuellement. Requiert `operation_id`, `type`, `title`.
- `GET /api/operation-events/{id}` — Detail d'un evenement.
- `PUT /api/operation-events/{id}` — Met a jour un evenement.
- `DELETE /api/operation-events/{id}` — Supprime un evenement.