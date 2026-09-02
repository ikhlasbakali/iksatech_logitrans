# API — Lot C : CRM (Client, SalesQuote) & Messages

Auteur : Salima
Branche locale : `feature/crm-messages`

## Client

**Base URL** : `/api/clients`
**Auth** : Bearer Token requis (Sanctum)

| Méthode | URL | Description |
|---|---|---|
| GET | `/api/clients` | Liste tous les clients avec leurs devis liés |
| POST | `/api/clients` | Crée un client (validation stricte : nom, contact, adresse obligatoires) |
| GET | `/api/clients/{id}` | Détail d'un client + ses devis |
| PUT | `/api/clients/{id}` | Modifie un client (champs libres, pas de validation stricte) |
| DELETE | `/api/clients/{id}` | Supprime un client |

## SalesQuote (Devis)

**Base URL** : `/api/sales-quotes`
**Auth** : Bearer Token requis (Sanctum)

| Méthode | URL | Description |
|---|---|---|
| GET | `/api/sales-quotes` | Liste tous les devis avec client + commercial associés |
| POST | `/api/sales-quotes` | Crée un devis (le commercial est auto-rempli via l'utilisateur connecté) |
| GET | `/api/sales-quotes/{id}` | Détail d'un devis |
| PUT | `/api/sales-quotes/{id}` | Modifie un devis |
| DELETE | `/api/sales-quotes/{id}` | Supprime un devis |

Statuts possibles : `draft`, `sent`, `accepted`, `rejected`, `expired`, `invoiced`.

## Message

**Base URL** : `/api/messages`
**Auth** : Bearer Token requis (Sanctum)

| Méthode | URL | Description |
|---|---|---|
| GET | `/api/messages` | Liste tous les messages avec expéditeur/destinataire |
| POST | `/api/messages` | Crée un message (l'expéditeur est auto-rempli via l'utilisateur connecté) |
| GET | `/api/messages/{id}` | Détail d'un message |
| PUT | `/api/messages/{id}` | Modifie un message |
| DELETE | `/api/messages/{id}` | Supprime un message |

⚠️ `operation_id` est optionnel pour l'instant (Model `Operation` géré par Saida). Le champ est déjà prévu et fonctionnel une fois son lot terminé — aucun changement de code nécessaire.

## Notes techniques

- Toutes les réponses sont formatées via API Resource (`ClientResource`, `SalesQuoteResource`, `MessageResource`) et enveloppées dans `"data": {...}`.
- La validation stricte (Form Request) n'est active que sur `POST` (création). Les `PUT` (modification) restent souples pour l'instant.
- Testé manuellement via Postman le 14/08/2026 : Create, Read (liste + détail), Update, Delete — tous validés (200/201/422 selon le cas).