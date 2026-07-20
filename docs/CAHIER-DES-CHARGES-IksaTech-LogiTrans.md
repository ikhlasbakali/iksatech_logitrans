# Cahier des charges — IksaTech LogiTrans

**Plateforme de gestion transport & logistique** (national / international)  
**Version applicative :** 0.1.0  
**Date :** 22 juin 2026  
**Référence :** CDC-LT-2026-001

---

## 1. Contexte et objectifs

### 1.1 Contexte

IksaTech LogiTrans est une **TMS (Transport Management System)** web unifiée destinée aux transporteurs routiers opérant en **national** et en **international**. Elle couvre l'ensemble de la chaîne opérationnelle : de la création du dossier transport jusqu'à la livraison, en passant par la conformité douanière, la gestion de flotte, le CRM commercial et l'interface terrain chauffeur.

### 1.2 Objectifs métier

| Objectif | Description |
|----------|-------------|
| Centraliser l'exploitation | Un seul outil pour les dossiers, la flotte, les documents et la messagerie |
| Visibilité temps réel | Suivi cartographique des missions et ETA |
| Conformité internationale | Flux documentaire douanier structuré (CMR, MRN, T1, EUR1, etc.) |
| Pilotage direction | KPI, rapports BI, tableau de bord CRM |
| Terrain connecté | Application chauffeur mobile-first pour statuts et preuves |
| Aide à la décision | Assistant IA, alertes intelligentes, recommandations d'affectation |

### 1.3 Périmètre fonctionnel

- **14 modules fonctionnels**
- **25+ écrans / parcours utilisateur**
- **7 profils utilisateur** (rôles)
- **11 entités métier** principales
- Transport **national** et **international** (Incoterms®, douane, visas chauffeurs)

---

## 2. Profils utilisateurs et droits d'accès

### 2.1 Rôles applicatifs

| Rôle | Catégorie | Description |
|------|-----------|-------------|
| **Administrateur** | Direction & IT | Accès complet. Seul habilité à gérer les comptes, rôles, modules et traçabilité |
| **Manager** | Exploitation | Pilotage opérationnel, flotte, rapports, IA. Pas de gestion des comptes |
| **Responsable exploitation** | Exploitation | Même périmètre qu'un manager |
| **Opérateur flux (Agent)** | Exploitation | Traitement quotidien des dossiers. Pas de rapports direction ni admin |
| **Support technique** | Exploitation | Assistance sur dossiers, véhicules, documents. Pas chauffeurs, rapports, IA, CRM |
| **Chauffeur** | Terrain | Missions, messages, application terrain uniquement |
| **Client** | Externe | Consultation de ses transports, documents et messages |

### 2.2 Contrôle d'accès (double niveau)

1. **Contrôle par route** — chaque URL est protégée par une liste de rôles autorisés
2. **Contrôle par module** — attribution fine des modules fonctionnels par rôle, personnalisable par l'administrateur

### 2.3 Matrice modules × rôles (par défaut)

| Module | Admin | Manager | Resp. expl. | Agent | Support | Client | Chauffeur |
|--------|:-----:|:-------:|:-----------:|:-----:|:-------:|:------:|:---------:|
| Pilotage & synthèse | Oui | Oui | Oui | Oui | Oui | Oui | Oui |
| Opérations transport | Oui | Oui | Oui | Oui | Oui | Oui | Non |
| Suivi temps réel | Oui | Oui | Oui | Oui | Oui | Non | Non |
| Tour de contrôle flotte | Oui | Oui | Oui | Oui | Oui | Non | Non |
| Chauffeurs & visas | Oui | Oui | Oui | Oui | Non | Non | Non |
| Parc & véhicules | Oui | Oui | Oui | Oui | Oui | Non | Non |
| Documents & conformité | Oui | Oui | Oui | Oui | Oui | Oui | Non |
| Incidents & support | Oui | Oui | Oui | Oui | Oui | Non | Non |
| Messagerie | Oui | Oui | Oui | Oui | Oui | Oui | Oui |
| Reporting & BI | Oui | Oui | Oui | Non | Non | Non | Non |
| IA & aide à la décision | Oui | Oui | Oui | Oui | Non | Non | Non |
| CRM & affaires | Oui | Oui | Oui | Oui | Non | Non | Non |
| Administration | Oui | Non | Non | Non | Non | Non | Non |
| Application chauffeur | Non | Non | Non | Non | Non | Non | Oui |

---

## 3. Inventaire fonctionnel détaillé

### Module 1 — Pilotage & synthèse

**Route :** `/`  
**Objectif :** Vue d'ensemble des indicateurs et missions pour tous les profils.

| ID | Fonctionnalité | Spécification |
|----|----------------|---------------|
| 1.1 | Tableau de bord direction | KPI missions actives, livraisons, alertes, retards |
| 1.2 | Mini-carte flotte | Positions des véhicules actifs (vue synthèse Leaflet) |
| 1.3 | Fil d'activité | Historique opérationnel récent |
| 1.4 | Actions rapides | Raccourcis : création dossier, carte live, incidents |
| 1.5 | Alertes intelligentes | Notifications métier (retards, documents manquants) |
| 1.6 | Vue adaptée au profil | Contenu filtré selon le rôle connecté |
| 1.7 | Notifications plateforme | Centre de notifications (workflow, transit, alertes) |

---

### Module 2 — Opérations transport

**Routes :** `/operations`, `/operations/detail`, `/operations/new`  
**Objectif :** Gestion complète des dossiers transport nationaux et internationaux.

| ID | Fonctionnalité | Spécification |
|----|----------------|---------------|
| 2.1 | Liste des opérations | Filtres : statut, priorité, client, recherche textuelle |
| 2.2 | Création dossier (assistant multi-étapes) | Formulaire guidé en plusieurs étapes |
| 2.3 | Référence automatique | Génération OP-ANNÉE-XXXXXXXX sans saisie manuelle |
| 2.4 | Types d'opération | Import, export, national, international, groupage, lot complet |
| 2.5 | National & international | Pays, Incoterms® 2020, flux douanier |
| 2.6 | Géolocalisation à la création | Carte Leaflet, clic / géocodage Nominatim |
| 2.7 | Affectation ressources | Client, chauffeur(s) (jusqu'à 2), véhicule, dates planifiées |
| 2.8 | Marchandise | Description, poids, volume, palettes, température contrôlée, ADR |
| 2.9 | Workflow statuts | Brouillon → Confirmé → Assigné → Chargement → Transit → Déchargement → Livré → Clôturé |
| 2.10 | Priorités | Faible, moyenne, haute, urgente |
| 2.11 | Fiche dossier complète | Référence, badges statut/priorité, client, incoterm, GPS |
| 2.12 | Changement de statut | Menu actions + mise à jour temps réel |
| 2.13 | Contrôle documents obligatoires | Blocage / alerte si pièces manquantes |
| 2.14 | Onglet historique | Timeline événements |
| 2.15 | Onglet documents | Pièces liées au dossier |
| 2.16 | Onglet messages | Fil messagerie par opération |
| 2.17 | Checkpoints douaniers | Suivi transfrontalier sur la fiche |
| 2.18 | Recommandation IA trajet | Suggestion chauffeur / itinéraire à la création |
| 2.19 | Moteur workflow | Déclenchement règles métier à la création / changement |
| 2.20 | Score de risque IA | Score 0–100 et résumé IA par dossier |
| 2.21 | Suivi position | Coordonnées courantes, ETA, retard en minutes |

**Règle métier — documents obligatoires (international) :**  
Nota → Facture commerciale → CMR → Fiche chargement → MRN → T1 → Salida → EUR1 → MLV

---

### Module 3 — Suivi temps réel

**Route :** `/live-map`

| ID | Fonctionnalité | Spécification |
|----|----------------|---------------|
| 3.1 | Carte live nationale / international | Cartographie missions actives |
| 3.2 | Calcul ETA | Estimation durée (haversine + vitesses métier) |
| 3.3 | Simulation suivi | Positions et progression (prêt télématique) |
| 3.4 | Référentiel géographique | Coordonnées villes intégrées |
| 3.5 | Mise à jour automatique | Simulation tracking en arrière-plan |

---

### Module 4 — Tour de contrôle flotte

**Routes :** `/flotte`, `/flotte/detail`, `/flotte/alertes-chargement`, `/flotte/maintenance-flotte`, `/flotte/exploitation-iso`, `/flotte/suivi-inter`

| ID | Fonctionnalité | Spécification |
|----|----------------|---------------|
| 4.1 | Tableau logistique flotte | KPI consolidés : missions, charge, conformité |
| 4.2 | Missions du jour | Tableau trajets, export CSV |
| 4.3 | Panneau visas chauffeurs | Valide / expire bientôt / expiré / sans visa |
| 4.4 | Détail mission flotte | Fiche mission enrichie |
| 4.5 | Alertes chargement | Surveillance chargements et délais |
| 4.6 | Hub maintenance flotte | Planning et historique maintenance |
| 4.7 | Exploitation ISO | Indicateurs qualité / conformité |
| 4.8 | Suivi international | Flux transfrontaliers consolidés |
| 4.9 | Sync logistique | API logistique interne |

---

### Module 5 — Chauffeurs

**Route :** `/drivers`

| ID | Fonctionnalité | Spécification |
|----|----------------|---------------|
| 5.1 | Fiches chauffeurs | Identité, contact, statut, permis |
| 5.2 | Gestion visas | Valide, expiré, bientôt expiré, sans visa |
| 5.3 | Statistiques visa | Tableaux de bord RH transport international |
| 5.4 | Liaison compte utilisateur | Compte chauffeur relié à la fiche |
| 5.5 | Disponibilité missions | Chauffeurs occupés / libres |
| 5.6 | Panneau statut visa | Composant dédié |

---

### Module 6 — Parc & véhicules

**Routes :** `/vehicles`, `/vehicles/detail`

| ID | Fonctionnalité | Spécification |
|----|----------------|---------------|
| 6.1 | Liste parc | Tracteurs, semi-remorques, statuts |
| 6.2 | Fiche véhicule détaillée | Immatriculation, type, affectations |
| 6.3 | Maintenance véhicule | Panneau entretien par unité |
| 6.4 | Coûts véhicule | Suivi coûts exploitation |
| 6.5 | Historique maintenance | Entité MaintenanceHistory |
| 6.6 | Catégories flotte | National / international / mixte |
| 6.7 | KPI flotte | Calcul indicateurs dashboard |

---

### Module 7 — Documents & conformité

**Route :** `/documents`

| ID | Fonctionnalité | Spécification |
|----|----------------|---------------|
| 7.1 | Bibliothèque documentaire | Recherche, filtres type / statut / dossier |
| 7.2 | Upload pièces | Par type et par opération |
| 7.3 | Flux documentaire international | Nota → Facture → CMR → Chargement → MRN → T1 → Salida → EUR1 → MLV |
| 7.4 | Validation / rejet | Workflow validateur |
| 7.5 | Historique & audit document | Traçabilité des actions |
| 7.6 | Intelligence documentaire | Extraction métadonnées, suggestion dossier |
| 7.7 | Ouverture / téléchargement | Actions fichier PDF, images |
| 7.8 | Accès client | Consultation des pièces de ses transports |

**Types de documents :** Nota, Facture commerciale, CMR, Fiche chargement, MRN, T1, Salida, EUR1, MLV, POD, Packing list, Photo, Douane, Autre.

---

### Module 8 — Support & incidents

**Route :** `/incidents`

| ID | Fonctionnalité | Spécification |
|----|----------------|---------------|
| 8.1 | Liste incidents | Filtres gravité, statut, opération liée |
| 8.2 | Création / suivi | Description, résolution, statut |
| 8.3 | Lien opération | Contexte mission associée |
| 8.4 | Déclaration terrain | Via application chauffeur |
| 8.5 | Gravités | Classification par niveau |

---

### Module 9 — Messagerie & coordination

**Route :** `/messages`

| ID | Fonctionnalité | Spécification |
|----|----------------|---------------|
| 9.1 | Conversations | Interne, client, terrain |
| 9.2 | Messagerie par dossier | Depuis fiche opération |
| 9.3 | Interface chauffeur | Envoi message depuis mission |
| 9.4 | Accès client | Échanges sur ses transports |
| 9.5 | Fil chronologique | Messages horodatés par opération |

---

### Module 10 — Reporting & BI

**Route :** `/reports`

| ID | Fonctionnalité | Spécification |
|----|----------------|---------------|
| 10.1 | KPI livraisons | Taux à l'heure, retards, incidents |
| 10.2 | Graphiques Recharts | Barres, lignes, secteurs, aires |
| 10.3 | Filtres période | Jour, semaine, mois, personnalisé |
| 10.4 | Export CSV / PDF | Rapports téléchargeables |
| 10.5 | Analytics opérations | Service reporting sur données réelles |
| 10.6 | Performance flotte / chauffeurs | Vues direction consolidées |

---

### Module 11 — IA & aide à la décision

**Route :** `/ai-assistant`

| ID | Fonctionnalité | Spécification |
|----|----------------|---------------|
| 11.1 | Prédiction retards | Analyse opérations en cours |
| 11.2 | Détection anomalies flotte | Véhicules / missions atypiques |
| 11.3 | Suggestions opérationnelles | Recommandations consolidées |
| 11.4 | Recommandations par dossier | Actions suggérées par opération |
| 11.5 | Assistant conversationnel | Chat contextuel |
| 11.6 | Recommandation trajet | Score chauffeurs à l'affectation |
| 11.7 | Insights IA | Service d'analyse contextuelle |

---

### Module 12 — CRM & affaires

**Routes :** `/crm`, `/crm/devis`, `/crm/clients-fichier`

#### 12.A — Tableau de bord CRM

| ID | Fonctionnalité | Spécification |
|----|----------------|---------------|
| 12.1 | KPI commerciaux | CA, objectifs, conversions |
| 12.2 | Pipeline ventes | Analyse type Odoo, étapes |
| 12.3 | Classement commerciaux | Performance équipe |
| 12.4 | Top clients / produits / services | Modales détail |
| 12.5 | Carte géographique | Répartition CA par zone |
| 12.6 | Évolution CA | Journalier / mensuel |
| 12.7 | Devises EUR / DH | Bascule affichage multi-devises |
| 12.8 | Actions rapides CRM | Raccourcis métier |
| 12.9 | Analyse commandes | Composant dédié |
| 12.10 | Métriques enrichies | Indicateurs avancés |

#### 12.B — Devis commerciaux

| ID | Fonctionnalité | Spécification |
|----|----------------|---------------|
| 12.11 | Création / édition devis | Lignes, TVA, remises |
| 12.12 | Statuts devis | Brouillon, envoyé, accepté, refusé, expiré, facturé |
| 12.13 | Export HTML / CSV | Document client |
| 12.14 | Impression devis | Mise en page professionnelle |
| 12.15 | Duplication devis | Gain de temps commercial |

#### 12.C — Fichier clients

| ID | Fonctionnalité | Spécification |
|----|----------------|---------------|
| 12.16 | Annuaire clients | Fiche, contacts, historique |
| 12.17 | Import CSV / JSON | Modèle fourni, validation lignes |
| 12.18 | Détection doublons | À l'import |
| 12.19 | Annuaire dérivé opérations | Consolidation depuis dossiers transport |
| 12.20 | Service email | Envoi emails commerciaux |

---

### Module 13 — Administration & sécurité

**Route :** `/admin`

| ID | Fonctionnalité | Spécification |
|----|----------------|---------------|
| 13.1 | Gestion utilisateurs | Création, modification, désactivation |
| 13.2 | 7 profils métier | Admin, Manager, Resp. exploitation, Agent, Support, Chauffeur, Client |
| 13.3 | Matrice d'accès | Écran × rôle |
| 13.4 | Droits par module | Attribution modules par rôle |
| 13.5 | Départements | Structure organisationnelle |
| 13.6 | Journal sécurité | 200 derniers événements |
| 13.7 | Paramètres application | Notifications, IA, affectation auto |
| 13.8 | Compte admin canonique | Protection compte principal |
| 13.9 | Liaison chauffeur ↔ compte | À la création utilisateur terrain |
| 13.10 | Règles workflow | Configuration moteur d'automation |

---

### Module 14 — Application chauffeur

**Route :** `/driver-app`

| ID | Fonctionnalité | Spécification |
|----|----------------|---------------|
| 14.1 | Missions du chauffeur | Liste filtrée par affectation |
| 14.2 | Mission courante | Sélection auto (en route / chargement) |
| 14.3 | Stepper statuts terrain | Assigné → chargement → transit → déchargement → livré |
| 14.4 | Actions guidées | Libellés métier (« Je pars », « Chargement terminé », etc.) |
| 14.5 | Checklist trajet | Contrôles avant départ |
| 14.6 | Confirmation livraison | Preuve livraison |
| 14.7 | Photo / preuve | Capture simulée (prêt capteur mobile) |
| 14.8 | Déclaration incident | Depuis mobile |
| 14.9 | Messagerie terrain | Dialogue exploitation |
| 14.10 | Interface mobile-first | Navigation simplifiée |
| 14.11 | Redirection automatique | Chauffeur redirigé vers l'app terrain à la connexion |

---

## 4. Modèle de données

| Entité | Description | Champs clés |
|--------|-------------|-------------|
| Operation | Dossier transport | référence, client, type, statut, priorité, GPS, chauffeurs, véhicule, marchandise, ETA |
| OperationEvent | Événement timeline | type, horodatage, opération, auteur |
| Driver | Chauffeur | identité, contact, visa, statut, compte |
| Vehicle | Véhicule | immatriculation, type, catégorie, statut |
| VehicleCost | Coût véhicule | montant, type, date, véhicule |
| MaintenanceHistory | Historique maintenance | véhicule, intervention, date, coût |
| Document | Pièce documentaire | type, statut, opération, fichier |
| Incident | Incident | gravité, statut, opération, description |
| Message | Message | expéditeur, destinataire, opération, contenu |
| Client | Client CRM | raison sociale, contacts, historique |
| SalesQuote | Devis commercial | lignes, TVA, remises, statut, client |

---

## 5. Workflows et règles métier

### 5.1 Workflow opération

```
Brouillon → Confirmé → Assigné → Chargement → En transit → Déchargement → Livré → Clôturé
                                                                              ↓
                                                                         Incident / Annulé
```

### 5.2 Moteur d'automation

| Déclencheur | Actions possibles |
|-------------|-------------------|
| operation.created | Notification plateforme, mise à jour champ |
| document.validated | Notification aux rôles cibles |
| delay.detected | Alerte retard |
| vehicle.inactive | Notification maintenance |

### 5.3 Flux documentaire obligatoire

```
Nota → Facture commerciale → CMR → Fiche chargement → MRN → T1 → Salida → EUR1 → MLV
```

---

## 6. Architecture technique

### 6.1 Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18, Vite 5 |
| UI | Tailwind CSS, Radix UI, Framer Motion |
| Cartographie | Leaflet / OpenStreetMap |
| Graphiques | Recharts |
| État | TanStack React Query |
| Routing | React Router DOM v6 |

### 6.2 Sécurité

- Authentification par email/mot de passe
- Contrôle routes + modules par rôle
- Journal sécurité (audit)
- Redirection par profil à la connexion

### 6.3 Exports

- CSV : missions, rapports, devis, import clients
- PDF : rapports direction
- HTML : devis commerciaux

---

## 7. Exigences non fonctionnelles

| Critère | Spécification |
|---------|---------------|
| Responsive | Desktop, tablette, mobile |
| Performance | Chargement rapide, simulation tracking arrière-plan |
| Multi-devises | EUR / DH (CRM) |
| Langue | Interface française |
| Branding | Logo et accroche personnalisables |
| PWA | Manifest web |

---

## 8. Limitations et évolutions

| Limitation | État actuel | Évolution |
|------------|-------------|-----------|
| Persistance | localStorage (démo) | API REST + backend cloud |
| Télématique | Simulation | Connecteur GPS |
| Mobile | Web responsive | App native iOS/Android |
| IA | Règles heuristiques | Connexion LLM cloud |
| ERP | Export CSV/HTML | Intégration Sage, Odoo |

---

## 9. Parcours utilisateur principaux

### 9.1 Création dossier international

1. Connexion agent → Dashboard
2. Nouvelle opération (assistant multi-étapes)
3. Client, type international, Incoterm, adresses carte, marchandise
4. Affectation chauffeur (IA) + véhicule
5. Validation → référence auto → workflow déclenché
6. Upload documents obligatoires
7. Suivi carte live + fiche dossier

### 9.2 Mission chauffeur terrain

1. Connexion → redirection app chauffeur
2. Sélection mission courante
3. Checklist avant départ
4. Actions guidées : départ → chargement → transit → livré
5. Confirmation livraison + photo
6. Incident si besoin
7. Messagerie exploitation

### 9.3 Pilotage direction

1. Connexion manager → Dashboard KPI
2. Rapports BI (filtres, exports)
3. CRM : pipeline, top clients, CA géographique
4. Assistant IA : anomalies, retards
5. Tour de contrôle flotte

---

## 10. Synthèse

| Indicateur | Valeur |
|------------|--------|
| Modules fonctionnels | 14 |
| Écrans / parcours | 25+ |
| Profils utilisateur | 7 rôles |
| Entités métier | 11 |
| Types de documents | 15+ |
| Statuts opération | 10 |

---

*Document généré à partir de l'analyse du code source IksaTech LogiTrans — juin 2026.*
