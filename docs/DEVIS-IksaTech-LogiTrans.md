# DEVIS COMMERCIAL — IksaTech LogiTrans

**Plateforme de gestion transport & logistique** (national / international)  
**Référence devis :** DEV-LT-2026-001  
**Date :** 3 juin 2026  
**Validité :** 30 jours  
**Devise :** EUR (HT) — TVA applicable selon statut du client

---

## 1. Émetteur & client

| | |
|---|---|
| **Émetteur** | IksaTech — *à compléter : raison sociale, ICE/RC, adresse, email, téléphone* |
| **Produit** | **IksaTech LogiTrans** — TMS + flotte + CRM + application chauffeur |
| **Client** | *À compléter : société, contact, SIRET/ICE, adresse* |
| **Objet** | Abonnement logiciel + prestations de mise en service (détail ci-dessous) |

---

## 2. Synthèse de l’offre

Solution web unifiée couvrant **l’exploitation transport** (dossiers, suivi, conformité douanière), **la flotte** (véhicules, chauffeurs, maintenance, alertes), **la relation client** (CRM, devis, fichier clients), **le terrain** (application chauffeur) et **le pilotage** (tableaux de bord, rapports, assistant IA).

| Indicateur technique | Valeur |
|---------------------|--------|
| Modules fonctionnels | 14 |
| Écrans / parcours | 25+ |
| Profils utilisateur | 7 rôles |
| Volume applicatif | ~196 fichiers sources, ~36 600 lignes |
| Déploiement actuel | Application web (frontend) — API prête à brancher sur backend hébergé |

---

## 3. Inventaire fonctionnel détaillé (par module)

### Module 1 — Pilotage & synthèse (`dashboard`)

| # | Fonctionnalité | Détail |
|---|----------------|--------|
| 1.1 | Tableau de bord direction | KPI missions, livraisons, alertes |
| 1.2 | Mini-carte flotte | Positions véhicules actifs (vue synthèse) |
| 1.3 | Fil d’activité | Historique opérationnel récent |
| 1.4 | Actions rapides | Raccourcis création dossier, carte, incidents |
| 1.5 | Alertes intelligentes | Notifications métier (retards, documents manquants) |
| 1.6 | Vue par profil | Contenu adapté admin, exploitation, client, chauffeur |

**Accès rôles :** Administrateur, Manager, Resp. exploitation, Agent, Support, Client, Chauffeur

---

### Module 2 — Opérations transport (`transport_ops`)

| # | Fonctionnalité | Détail |
|---|----------------|--------|
| 2.1 | Liste des opérations | Filtres statut, priorité, client, recherche |
| 2.2 | Création dossier (assistant multi-étapes) | Formulaire guidé en plusieurs étapes |
| 2.3 | Référence automatique | Génération `OP-ANNÉE-XXXXXXXX` sans saisie manuelle |
| 2.4 | National & international | Type d’opération, pays, Incoterms® 2020 |
| 2.5 | Géolocalisation création | Carte Leaflet, clic / géocodage Nominatim |
| 2.6 | Affectation ressources | Client, chauffeur(s), véhicule, dates |
| 2.7 | Marchandise | Poids, palettes, température contrôlée, instructions |
| 2.8 | Workflow statuts | Brouillon → confirmé → assigné → chargement → transit → livraison → clôture |
| 2.9 | Fiche dossier complète | Référence, badges statut/priorité, client, incoterm |
| 2.10 | Changement de statut | Menu actions + mise à jour temps réel |
| 2.11 | Contrôle documents obligatoires | Blocage / alerte si pièces manquantes |
| 2.12 | Onglet historique | Timeline événements (`OperationEvent`) |
| 2.13 | Onglet documents | Pièces liées au dossier |
| 2.14 | Onglet messages | Fil messagerie par opération |
| 2.15 | Checkpoints douaniers | Suivi transfrontalier sur la fiche |
| 2.16 | Recommandation IA trajet | Suggestion chauffeur / itinéraire à la création |
| 2.17 | Moteur workflow | Déclenchement règles métier à la création / changement |

**Accès rôles :** Admin, Manager, Resp. exploitation, Agent, Support (lecture/assistance), Client (consultation)

---

### Module 3 — Suivi temps réel (`tracking_live`)

| # | Fonctionnalité | Détail |
|---|----------------|--------|
| 3.1 | Carte live nationale / international | Cartographie missions |
| 3.2 | Calcul ETA | Estimation durée (haversine + vitesses métier) |
| 3.3 | Simulation suivi | Positions et progression (prêt télématique) |
| 3.4 | Coordonnées villes | Référentiel géographique intégré |

**Accès rôles :** Admin, Manager, Resp. exploitation, Agent, Support

---

### Module 4 — Tour de contrôle flotte (`fleet_tower`)

Hub **5 sous-écrans** + tableau logistique principal :

| # | Fonctionnalité | Détail |
|---|----------------|--------|
| 4.1 | Tableau logistique flotte | KPI solidaires (missions, charge, conformité) |
| 4.2 | Missions du jour | Tableau trajets, export CSV |
| 4.3 | Panneau visas chauffeurs | Valide / expire / sans visa |
| 4.4 | Détail mission flotte | Fiche mission enrichie |
| 4.5 | Alertes chargement | Surveillance chargements / délais |
| 4.6 | Hub maintenance flotte | Planning et historique maintenance |
| 4.7 | Exploitation ISO | Indicateurs qualité / conformité exploitation |
| 4.8 | Suivi international | Flux transfrontaliers consolidés |
| 4.9 | Sync logistique | API logistique interne (missions dashboard) |

**Accès rôles :** Admin, Manager, Resp. exploitation, Agent, Support

---

### Module 5 — Ressources humaines — Chauffeurs (`fleet_drivers`)

| # | Fonctionnalité | Détail |
|---|----------------|--------|
| 5.1 | Fiches chauffeurs | Identité, contact, statut |
| 5.2 | Gestion visas | Valide, expiré, bientôt expiré, sans visa |
| 5.3 | Statistiques visa | Tableaux de bord RH transport international |
| 5.4 | Liaison compte utilisateur | Compte chauffeur relié à la fiche (admin) |
| 5.5 | Disponibilité missions | Chauffeurs occupés / libres selon opérations actives |

**Accès rôles :** Admin, Manager, Resp. exploitation, Agent

---

### Module 6 — Parc & véhicules (`fleet_vehicles`)

| # | Fonctionnalité | Détail |
|---|----------------|--------|
| 6.1 | Liste parc | Tracteurs, semi-remorques, statuts |
| 6.2 | Fiche véhicule détaillée | Immatriculation, type, affectations |
| 6.3 | Maintenance véhicule | Panneau entretien par unité |
| 6.4 | Coûts véhicule | Suivi coûts exploitation (`VehicleCost`) |
| 6.5 | Historique maintenance | `MaintenanceHistory` |
| 6.6 | Catégories flotte | National / international / mixte |

**Accès rôles :** Admin, Manager, Resp. exploitation, Agent, Support

---

### Module 7 — Documents & conformité (`compliance_docs`)

| # | Fonctionnalité | Détail |
|---|----------------|--------|
| 7.1 | Bibliothèque documentaire | Recherche, filtres type / statut / dossier |
| 7.2 | Upload pièces | Par type et par opération |
| 7.3 | Flux documentaire international | Nota → Facture → CMR → Fiche chargement → MRN → T1 → Salida → EUR1 → MLV |
| 7.4 | Validation / rejet | Workflow validateur (rôles autorisés) |
| 7.5 | Historique & audit document | Traçabilité des actions |
| 7.6 | Intelligence documentaire | Extraction métadonnées (nom fichier), suggestion dossier |
| 7.7 | Ouverture / téléchargement | Actions fichier (PDF, images) |
| 7.8 | Accès client | Consultation pièces de ses transports |

**Types couverts :** Nota, facture commerciale, CMR, fiche chargement, MRN, T1, Salida, EUR1, MLV, photos, divers

**Accès rôles :** Admin, Manager, Resp. exploitation, Agent, Support, Client

---

### Module 8 — Support & incidents (`support_incidents`)

| # | Fonctionnalité | Détail |
|---|----------------|--------|
| 8.1 | Liste incidents | Gravité, statut, opération liée |
| 8.2 | Création / suivi | Description, résolution |
| 8.3 | Lien opération | Contexte mission |
| 8.4 | Déclaration terrain | Via application chauffeur |

**Accès rôles :** Admin, Manager, Resp. exploitation, Agent, Support

---

### Module 9 — Messagerie & coordination (`collab_messages`)

| # | Fonctionnalité | Détail |
|---|----------------|--------|
| 9.1 | Conversations | Interne, client, terrain |
| 9.2 | Messagerie par dossier | Depuis fiche opération |
| 9.3 | Interface chauffeur | Envoi message depuis mission |
| 9.4 | Accès client | Échanges sur ses transports |

**Accès rôles :** Tous sauf restriction rapports (client, chauffeur inclus)

---

### Module 10 — Reporting & BI (`bi_reports`)

| # | Fonctionnalité | Détail |
|---|----------------|--------|
| 10.1 | KPI livraisons | Taux à l’heure, retards, incidents |
| 10.2 | Graphiques Recharts | Barres, lignes, secteurs, aires |
| 10.3 | Filtres période | Jour, semaine, mois, personnalisé |
| 10.4 | Export CSV / PDF | Rapports téléchargeables |
| 10.5 | Analytics opérations | Service `reportingService` sur données réelles |
| 10.6 | Performance flotte / chauffeurs | Vues direction |

**Accès rôles :** Admin, Manager, Resp. exploitation

---

### Module 11 — IA & aide à la décision (`ai_workspace`)

| # | Fonctionnalité | Détail |
|---|----------------|--------|
| 11.1 | Prédiction retards | Analyse opérations en cours |
| 11.2 | Détection anomalies flotte | Véhicules / missions atypiques |
| 11.3 | Suggestions opérationnelles | Recommandations consolidées |
| 11.4 | Recommandations par dossier | Actions suggérées par opération |
| 11.5 | Assistant conversationnel | Chat contextuel (flotte, chauffeurs, incidents) |
| 11.6 | Recommandation trajet (création) | Score chauffeurs à l’affectation |

**Accès rôles :** Admin, Manager, Resp. exploitation, Agent

---

### Module 12 — CRM & affaires (`crm_commercial`)

**12.A — Tableau de bord CRM**

| # | Fonctionnalité | Détail |
|---|----------------|--------|
| 12.1 | KPI commerciaux | CA, objectifs, conversions |
| 12.2 | Pipeline ventes | Analyse type Odoo, étapes |
| 12.3 | Classement commerciaux | Performance équipe |
| 12.4 | Top clients / produits / services | Modales détail |
| 12.5 | Carte géographique | Répartition CA par zone |
| 12.6 | Évolution CA | Journalier / mensuel |
| 12.7 | Devises EUR / DH | Bascule affichage |
| 12.8 | Actions rapides CRM | Raccourcis métier |

**12.B — Devis commerciaux (ERP)**

| # | Fonctionnalité | Détail |
|---|----------------|--------|
| 12.9 | Création / édition devis | Lignes, TVA, remises |
| 12.10 | Statuts devis | Brouillon, envoyé, accepté, refusé, expiré, facturé |
| 12.11 | Export HTML / CSV | Document client |
| 12.12 | Impression devis | Mise en page professionnelle |
| 12.13 | Duplication devis | Gain de temps commercial |

**12.C — Fichier clients**

| # | Fonctionnalité | Détail |
|---|----------------|--------|
| 12.14 | Annuaire clients | Fiche, contacts, historique |
| 12.15 | Import CSV / JSON | Modèle fourni, validation lignes |
| 12.16 | Détection doublons | À l’import |
| 12.17 | Annuaire dérivé opérations | Consolidation depuis dossiers transport |

**Accès rôles :** Admin, Manager, Resp. exploitation, Agent

---

### Module 13 — Administration & sécurité (`system_admin`)

| # | Fonctionnalité | Détail |
|---|----------------|--------|
| 13.1 | Gestion utilisateurs | Création, modification, désactivation |
| 13.2 | 7 profils métier | Admin, Manager, Resp. exploitation, Agent, Support, Chauffeur, Client |
| 13.3 | Matrice d’accès | Écran × rôle (pédagogie + contrôle) |
| 13.4 | Droits par module | Attribution modules par rôle |
| 13.5 | Départements | Structure organisationnelle |
| 13.6 | Journal sécurité | `SecurityAuditLog` (200 derniers événements) |
| 13.7 | Paramètres application | Notifications, IA, affectation auto |
| 13.8 | Compte admin canonique | Protection compte principal |
| 13.9 | Liaison chauffeur ↔ compte | À la création utilisateur terrain |

**Accès rôles :** Administrateur uniquement

---

### Module 14 — Application chauffeur (`field_driver`)

| # | Fonctionnalité | Détail |
|---|----------------|--------|
| 14.1 | Missions du chauffeur | Liste filtrée par affectation |
| 14.2 | Mission courante | Sélection auto (en route / chargement) |
| 14.3 | Stepper statuts terrain | Assigné → chargement → transit → déchargement → livré |
| 14.4 | Actions guidées | Libellés métier (« Je pars », « Chargement terminé », etc.) |
| 14.5 | Checklist trajet | Contrôles avant départ |
| 14.6 | Confirmation livraison | Preuve livraison |
| 14.7 | Photo / preuve | Capture simulée (prêt capteur mobile) |
| 14.8 | Déclaration incident | Depuis mobile |
| 14.9 | Messagerie terrain | Dialogue exploitation |
| 14.10 | Interface mobile-first | Navigation simplifiée, menu latéral |

**Accès rôles :** Chauffeur

---

## 4. Socle technique inclus dans tous les forfaits

| # | Élément | Détail |
|---|---------|--------|
| S.1 | Interface web responsive | React 18, Vite, Tailwind, Radix UI |
| S.2 | Authentification & sessions | Connexion par rôle, redirection métier |
| S.3 | Contrôle d’accès double | Routes + modules (`accessModules`) |
| S.4 | Persistance locale démo | `localStorage` + jeu de données — **remplaçable par API REST** |
| S.5 | Couche repository | Abstraction prête pour backend |
| S.6 | Entités métier | Operation, Driver, Vehicle, Document, Incident, Message, SalesQuote, Client, etc. |
| S.7 | Notifications toast | Retour utilisateur (Sonner) |
| S.8 | Exports | CSV, PDF, HTML (rapports & devis) |
| S.9 | Cartographie | Leaflet / OpenStreetMap |
| S.10 | Branding personnalisable | Logo, accroches (`branding.js`) |
| S.11 | Workflow configurable | Moteur règles + déclencheurs |
| S.12 | Multi-devises CRM | EUR / DH |

---

## 5. Grille tarifaire modulaire (abonnement mensuel HT)

Prix unitaires si le client choisit **à la carte** (minimum facturé : socle + 3 modules).

| Code | Module | Prix / mois HT |
|------|--------|----------------|
| M01 | Pilotage & synthèse | 49 € |
| M02 | Opérations transport | 129 € |
| M03 | Suivi temps réel | 69 € |
| M04 | Tour de contrôle flotte | 99 € |
| M05 | Chauffeurs & visas | 59 € |
| M06 | Parc & véhicules | 69 € |
| M07 | Documents & conformité | 79 € |
| M08 | Incidents & support | 45 € |
| M09 | Messagerie & coordination | 39 € |
| M10 | Reporting & BI | 59 € |
| M11 | IA & aide à la décision | 49 € |
| M12 | CRM & affaires (dashboard + devis + clients) | 119 € |
| M13 | Administration & sécurité | *Inclus* |
| M14 | Application chauffeur | 59 € |
| **SOCLE** | Hébergement web, mises à jour UI, support email (8h-18h) | 99 € |

**Total à la carte (tous modules) :** **1 121 € / mois HT**  
*Remise packagée recommandée : voir §6.*

---

## 6. Forfaits recommandés (abonnement mensuel HT)

### Forfait STARTER — PME nationale (≤ 15 véhicules, ≤ 8 utilisateurs)

| Inclus | |
|--------|--|
| M01, M02, M05, M06, M09, M13, SOCLE | |
| Utilisateurs | 8 comptes |
| Support | Email, 48 h ouvrées |

| | |
|--|--|
| **Prix mensuel HT** | **399 € / mois** |
| *Économie vs à la carte* | ~35 % |

---

### Forfait PRO — Transport national + international (≤ 40 véhicules, ≤ 20 utilisateurs)

| Inclus | |
|--------|--|
| Tous modules **sauf** M11 (IA) en option | |
| M11 IA en option | +49 € / mois |
| Utilisateurs | 20 comptes |
| Support | Email + téléphone, 24 h ouvrées |

| | |
|--|--|
| **Prix mensuel HT** | **749 € / mois** |
| **Avec module IA** | **798 € / mois** |
| *Économie vs à la carte* | ~33 % |

---

### Forfait BUSINESS — Groupe / multi-sites (véhicules illimités*, ≤ 50 utilisateurs)

| Inclus | |
|--------|--|
| **Tous les modules** M01 → M14 | |
| Personnalisation logo & couleurs | Incluse |
| Formation en ligne | 4 h / trimestre |
| Support prioritaire | 8 h ouvrées |
| *Fair use : jusqu’à 150 véhicules suivis ; au-delà : voir option VEH* | |

| | |
|--|--|
| **Prix mensuel HT** | **1 099 € / mois** |
| *Économie vs à la carte* | ~2 % + services inclus |

---

## 7. Suppléments & options (HT)

| Code | Option | Facturation | Prix |
|------|--------|-------------|------|
| U01 | Utilisateur supplémentaire | / mois | 25 € / utilisateur |
| VEH | Véhicule suivi supplémentaire (au-delà du forfait) | / mois | 12 € / véhicule |
| GPS | Connecteur télématique (Géotab, etc.) | Setup + / mois | 3 500 € + 150 € / mois |
| API | Backend cloud + API REST + auth sécurisée | Projet | 28 000 € (one-shot) ou 450 € / mois hébergé |
| MOB | Application mobile native (iOS/Android) | Projet | 18 000 € (one-shot) |
| ERP | Intégration comptabilité (Sage, Odoo, etc.) | Projet | 6 000 € – 15 000 € |
| SMS | Notifications SMS terrain | / mois | 80 € + coût opérateur |
| SLA | SLA 99,5 % + support 24/7 | / mois | +250 € |
| BRAND | Charte graphique complète + domaine client | One-shot | 2 500 € |

---

## 8. Prestations ponctuelles (mise en service)

| Code | Prestation | Prix HT |
|------|------------|---------|
| P01 | Installation & paramétrage initial | 1 500 € |
| P02 | Migration données (Excel/CSV → plateforme) | 800 € – 2 500 € * |
| P03 | Formation exploitation (1 jour, 6 pers. max) | 900 € |
| P04 | Formation commerciale CRM / devis (½ journée) | 500 € |
| P05 | Accompagnement pilote (3 mois, 2 h/semaine) | 2 400 € |
| P06 | Personnalisation métier (champs, statuts, workflows) | 120 € / h (min. 8 h) |

\* *P02 : devis sur échantillon de fichiers.*

---

## 9. Exemple de devis chiffré (scénario type)

**Client :** Transporteur international — 25 camions, 15 utilisateurs  
**Choix :** Forfait PRO + module IA + mise en service complète

| Ligne | Description | Qté | Prix unit. HT | Total HT |
|-------|-------------|-----|---------------|----------|
| 1 | Abonnement Forfait PRO | 12 mois | 749 € | 8 988 € |
| 2 | Module IA (M11) | 12 mois | 49 € | 588 € |
| 3 | Utilisateurs suppl. (15 inclus → +0) | — | — | 0 € |
| 4 | Installation & paramétrage (P01) | 1 | 1 500 € | 1 500 € |
| 5 | Formation exploitation 1 j (P03) | 1 | 900 € | 900 € |
| 6 | Migration données moyenne (P02) | 1 | 1 500 € | 1 500 € |
| | | | **Total année 1** | **13 476 € HT** |
| | | | *Équivalent mensuel lissé* | *~1 123 € HT / mois* |

**Renouvellement année 2+ (abonnement seul) :** 798 € × 12 = **9 576 € HT / an**

---

## 10. Comparatif rapide des forfaits

| Critère | STARTER | PRO | BUSINESS |
|---------|---------|-----|----------|
| Prix / mois HT | 399 € | 749 € | 1 099 € |
| Véhicules (indicatif) | ≤ 15 | ≤ 40 | ≤ 150* |
| Utilisateurs | 8 | 20 | 50 |
| International / douane | Partiel | Complet | Complet |
| CRM & devis | Non | Oui | Oui |
| App chauffeur | Non | Oui | Oui |
| IA | Non | Option | Oui |
| Formation | — | — | 4 h / trimestre |

---

## 11. Conditions commerciales

1. **Paiement :** 40 % à la commande, 30 % à la mise en production, 30 % à 30 jours (abonnements : mensuel ou annuel -10 %).
2. **Engagement :** 12 mois minimum recommandé ; résiliation avec préavis 3 mois.
3. **Propriété :** Logiciel sous licence d’utilisation ; code source non cédé sauf accord spécifique.
4. **Hébergement :** Non inclus en phase pilote locale ; inclus si option API / hébergement IksaTech.
5. **Évolutions :** Mises à jour correctives incluses ; évolutions majeures selon roadmap ou devis complémentaire.
6. **Confidentialité :** Données client strictement confidentielles.
7. **Limitation :** La version actuelle sans backend cloud est adaptée **pilote / démo / intranet** ; la production multi-sites nécessite l’option **API** pour sécurité et sauvegarde.

---

## 12. Acceptation du devis

| | |
|--|--|
| **Bon pour accord** | Date : _______________ |
| **Nom & qualité** | |
| **Signature & cachet** | |
| **Forfait choisi** | ☐ STARTER ☐ PRO ☐ BUSINESS ☐ À la carte |
| **Options** | ☐ IA ☐ API ☐ GPS ☐ Autre : _____________ |

---

*Document généré à partir de l’inventaire fonctionnel réel du dépôt IksaTech LogiTrans (juin 2026). Les montants sont indicatifs et ajustables selon marché (Maghreb / Europe), volume et niveau de support.*
