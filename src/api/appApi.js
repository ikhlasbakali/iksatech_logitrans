/**
 * API applicative locale (persistance navigateur + jeu de données initial).
 * Aucun backend tiers requis : prête à être branchée sur votre API (REST/GraphQL) en production.
 */

import { NEUTRAL_PDF_SAMPLE_URL } from "@/config/commercial";

let entityCreateSeq = 0;
function nextLocalEntityId() {
  entityCreateSeq += 1;
  return `id_${Date.now().toString(36)}_${entityCreateSeq}`;
}

export const STORAGE_KEYS = {
  dataStore: "logitrans_app_store",
  sessionUser: "logitrans_session_user",
  users: "logitrans_users",
};

/** Compte principal : doit toujours rester administrateur (gestion des comptes). */
export const CANONICAL_ADMIN_EMAIL = "iksatech@iksatech.com";

const LEGACY_KEYS = {
  dataStore: "logiflow_store",
  sessionUser: "logiflow_user",
  users: "logiflow_users",
};

const now = new Date();

const addHours = (hours) => new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();
const addDays = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

/** Parc initial : répartition visas (valide / sans / expiré / bientôt) pour tableaux de bord exploitables dès l’installation. */
function buildDriverSeedList(addDaysFn) {
  const poolFirst = [
    "Ibrahim",
    "Youssef",
    "Carlos",
    "Jan",
    "Amadou",
    "Diego",
    "Ahmed",
    "Fatou",
    "Oumar",
    "Ali",
    "Hassan",
    "Zineb",
    "Rachid",
    "Karim",
    "Sofiane",
    "Omar",
    "Nadia",
    "Leila",
    "Hiba",
    "Samir",
  ];
  const poolLast = [
    "Benali",
    "Haddad",
    "Gomez",
    "Novak",
    "Diallo",
    "Rodriguez",
    "Mansouri",
    "Kabbaj",
    "Sy",
    "Bouazza",
    "Cherkaoui",
    "Idrissi",
    "Lahlou",
    "Tazi",
    "Fassi",
    "Alaoui",
    "Filali",
    "Berrada",
    "Raji",
    "Sebti",
  ];

  const core = [
    {
      id: "drv-001",
      first_name: "Viktor",
      last_name: "Rostov",
      phone: "+33 6 12 34 56 78",
      email: "viktor.rostov@fleet.demo",
      status: "on_mission",
      rating: 4.8,
      total_deliveries: 342,
      on_time_rate: 96,
      certifications: ["ADR", "Frigo"],
      current_location: "A6 direction Lyon",
      work_visa_expiry: addDaysFn(220),
    },
    {
      id: "drv-002",
      first_name: "Aisha",
      last_name: "Okonkwo",
      phone: "+33 6 98 76 54 32",
      email: "aisha.okonkwo@fleet.demo",
      status: "available",
      rating: 4.9,
      total_deliveries: 287,
      on_time_rate: 98,
      certifications: ["ADR"],
      current_location: "Entrepôt Paris Nord",
      work_visa_expiry: addDaysFn(18),
    },
    {
      id: "drv-003",
      first_name: "Helena",
      last_name: "Varga",
      phone: "+33 6 11 22 33 44",
      email: "helena.varga@fleet.demo",
      status: "available",
      rating: 4.7,
      total_deliveries: 198,
      on_time_rate: 94,
      certifications: ["ADR", "Frigo"],
      current_location: "Base régionale",
      work_visa_expiry: null,
    },
    {
      id: "drv-004",
      first_name: "Omar",
      last_name: "Al-Khatib",
      phone: "+33 6 55 66 77 88",
      email: "omar.alkhatib@fleet.demo",
      status: "on_mission",
      rating: 4.6,
      total_deliveries: 412,
      on_time_rate: 91,
      certifications: ["ADR"],
      current_location: "A8 — direction Nice",
      work_visa_expiry: addDaysFn(-24),
    },
  ];

  const extra = [];
  for (let i = 0; i < 116; i += 1) {
    let work_visa_expiry = null;
    let status = "available";
    if (i < 87) {
      work_visa_expiry = addDaysFn(40 + (i % 500));
      status = i % 5 === 0 ? "on_mission" : "available";
    } else if (i < 87 + 9) {
      work_visa_expiry = addDaysFn(1 + ((i - 87) % 25));
    } else if (i < 87 + 9 + 6) {
      work_visa_expiry = addDaysFn(-12 - ((i - 96) % 400));
    } else {
      work_visa_expiry = null;
    }
    const n = 100 + i;
    extra.push({
      id: `drv-${String(n).padStart(3, "0")}`,
      first_name: poolFirst[i % poolFirst.length],
      last_name: `${poolLast[i % poolLast.length]}-${n}`,
      phone: `+336${String(70200000 + i).slice(-8)}`,
      email: `chauffeur.${n}@fleet.example.com`,
      status,
      rating: Math.round((4.2 + (i % 8) / 10) * 10) / 10,
      total_deliveries: 50 + (i * 7) % 500,
      on_time_rate: 88 + (i % 12),
      certifications: i % 3 === 0 ? ["ADR"] : i % 3 === 1 ? ["ADR", "Frigo"] : [],
      current_location: "Base régionale",
      work_visa_expiry,
    });
  }

  return [...core, ...extra];
}

const seedData = {
  Operation: [
    {
      id: "op-001",
      reference: "OP-2024-0892",
      client_name: "Baltic Trade OÜ",
      type_operation: "national",
      status: "in_transit",
      priority: "high",
      incoterm: "CPT",
      pickup_address: "15 Rue de la Paix",
      pickup_city: "Paris",
      delivery_address: "28 Avenue Jean Jaurès",
      delivery_city: "Lyon",
      scheduled_pickup: addHours(-6),
      scheduled_delivery: addHours(4),
      actual_delivery: null,
      driver_id: "drv-001",
      driver_name: "Viktor Rostov",
      driver2_id: "drv-002",
      driver2_name: "Aisha Okonkwo",
      cargo_description: "24 palettes — Électronique",
      special_instructions: "Livraison quai 3. Appeler 10 min avant arrivée.",
      vehicle_plate: "AB-123-CD",
      delay_minutes: 15,
      created_date: addDays(-2),
    },
    {
      id: "op-002",
      reference: "OP-2024-0890",
      client_name: "Kwantum Labs GmbH",
      type_operation: "national",
      status: "delivered",
      priority: "medium",
      pickup_address: "Zone fret — Lille",
      pickup_city: "Lille",
      delivery_address: "8 Rue du Commerce",
      delivery_city: "Paris",
      scheduled_pickup: addDays(-1),
      scheduled_delivery: addHours(-2),
      actual_delivery: addHours(-1),
      driver_id: "drv-003",
      driver_name: "Helena Varga",
      cargo_description: "12 palettes — Mobilier",
      special_instructions: "Marchandise fragile.",
      vehicle_plate: "EF-456-GH",
      delay_minutes: 0,
      created_date: addDays(-1),
    },
    {
      id: "op-003",
      reference: "OP-2024-0891",
      client_name: "Ningbo Cargo Link Ltd",
      type_operation: "national",
      status: "incident",
      priority: "urgent",
      pickup_address: "Quai Marseille — Fret",
      pickup_city: "Marseille",
      delivery_address: "Plateforme Nice",
      delivery_city: "Nice",
      scheduled_pickup: addHours(-8),
      scheduled_delivery: addHours(1),
      actual_delivery: null,
      driver_id: "drv-004",
      driver_name: "Omar Al-Khatib",
      cargo_description: "Fret général",
      vehicle_plate: "IJ-789-KL",
      delay_minutes: 75,
      created_date: addDays(-1),
    },
    {
      id: "op-004",
      reference: "OP-2024-0895",
      client_name: "Kwantum Labs GmbH",
      type_operation: "national",
      status: "assigned",
      priority: "medium",
      pickup_address: "42 Boulevard Haussmann",
      pickup_city: "Paris",
      delivery_address: "8 Rue du Commerce",
      delivery_city: "Nantes",
      scheduled_pickup: addHours(4),
      scheduled_delivery: addHours(10),
      actual_delivery: null,
      driver_id: "drv-001",
      driver_name: "Viktor Rostov",
      cargo_description: "12 palettes — Mobilier",
      special_instructions: "Marchandise fragile.",
      vehicle_plate: "AB-123-CD",
      delay_minutes: 0,
      created_date: addDays(-1),
    },
  ],
  Vehicle: [
    {
      id: "veh-001",
      plate_number: "AB-123-CD",
      brand: "Renault",
      model: "T",
      year: 2021,
      type: "truck_44t",
      asset_category: "tractor",
      status: "in_transit",
      mileage: 145230,
      current_driver: "Viktor Rostov",
      next_maintenance: addDays(10),
      last_maintenance_km: 135000,
      maintenance_interval_km: 20000,
      technical_inspection_date: addDays(25),
      insurance_expiry: addDays(50),
      registration_expiry: addDays(90),
      temperature_controlled: false,
      adr_certified: true,
      current_lat: 48.72,
      current_lng: 2.85,
      last_position_at: addHours(0),
      speed_kmh: 78,
      stationary_ticks: 0,
      inactive_alert_sent: false,
      fuel_consumption_avg: 8.1,
    },
    {
      id: "veh-002",
      plate_number: "EF-456-GH",
      brand: "Mercedes",
      model: "Actros",
      year: 2020,
      type: "truck_19t",
      asset_category: "tractor",
      status: "available",
      mileage: 98450,
      current_driver: "Helena Varga",
      next_maintenance: addDays(30),
      last_maintenance_km: 90000,
      maintenance_interval_km: 20000,
      technical_inspection_date: addDays(120),
      insurance_expiry: addDays(180),
      registration_expiry: addDays(365),
      temperature_controlled: false,
      adr_certified: false,
      current_lat: 48.9033,
      current_lng: 2.2644,
      last_position_at: addHours(-1),
      speed_kmh: 0,
      stationary_ticks: 0,
      inactive_alert_sent: false,
      fuel_consumption_avg: 7.6,
    },
    {
      id: "veh-003",
      plate_number: "IJ-789-KL",
      brand: "Volvo",
      model: "FH",
      year: 2019,
      type: "refrigerated",
      asset_category: "tractor",
      status: "maintenance",
      mileage: 201320,
      current_driver: null,
      next_maintenance: addDays(-2),
      last_maintenance_km: 180000,
      maintenance_interval_km: 15000,
      technical_inspection_date: addDays(-5),
      insurance_expiry: addDays(15),
      registration_expiry: addDays(40),
      temperature_controlled: true,
      adr_certified: true,
      current_lat: 43.2965,
      current_lng: 5.3698,
      last_position_at: addHours(-2),
      speed_kmh: 0,
      stationary_ticks: 0,
      inactive_alert_sent: false,
      fuel_consumption_avg: 9.2,
    },
    {
      id: "veh-004",
      plate_number: "RM-440-FR",
      brand: "Krone",
      model: "Profi Liner",
      year: 2022,
      type: "semi_trailer",
      asset_category: "trailer",
      status: "available",
      mileage: 0,
      current_driver: null,
      next_maintenance: addDays(60),
      last_maintenance_km: 0,
      maintenance_interval_km: 0,
      technical_inspection_date: addDays(180),
      insurance_expiry: addDays(200),
      registration_expiry: addDays(300),
      temperature_controlled: false,
      adr_certified: false,
    },
    {
      id: "veh-005",
      plate_number: "RM-883-FR",
      brand: "Schmitz",
      model: "S.KO Cool",
      year: 2021,
      type: "semi_trailer",
      asset_category: "trailer",
      status: "in_use",
      mileage: 0,
      current_driver: null,
      next_maintenance: addDays(20),
      last_maintenance_km: 0,
      maintenance_interval_km: 0,
      technical_inspection_date: addDays(90),
      insurance_expiry: addDays(120),
      registration_expiry: addDays(240),
      temperature_controlled: true,
      adr_certified: false,
    },
  ],
  Driver: buildDriverSeedList(addDays),
  Document: [
    {
      id: "doc-n01",
      operation_id: "op-001",
      dossier_reference: "OP-2024-0892",
      name: "Nota_reservation.pdf",
      type: "nota",
      status: "validated",
      file_url: NEUTRAL_PDF_SAMPLE_URL,
      uploaded_by: "Exploitation",
      validated_by: "N. Volkov (contrôle)",
      validated_at: addHours(-5),
      created_date: addHours(-6),
    },
    {
      id: "doc-fi01",
      operation_id: "op-001",
      dossier_reference: "OP-2024-0892",
      name: "Facture_commerciale.pdf",
      type: "commercial_invoice",
      status: "validated",
      file_url: NEUTRAL_PDF_SAMPLE_URL,
      uploaded_by: "Exploitation",
      validated_by: "N. Volkov (contrôle)",
      validated_at: addHours(-5),
      created_date: addHours(-6),
    },
    {
      id: "doc-001",
      operation_id: "op-001",
      dossier_reference: "OP-2024-0892",
      name: "CMR_signe.pdf",
      type: "cmr",
      status: "validated",
      file_url: NEUTRAL_PDF_SAMPLE_URL,
      uploaded_by: "Viktor Rostov",
      validated_by: "N. Volkov (contrôle)",
      validated_at: addHours(-4),
      created_date: addHours(-5),
    },
    {
      id: "doc-ld01",
      operation_id: "op-001",
      dossier_reference: "OP-2024-0892",
      name: "Fiche_chargement.pdf",
      type: "loading_sheet",
      status: "validated",
      file_url: NEUTRAL_PDF_SAMPLE_URL,
      uploaded_by: "Exploitation",
      validated_at: addHours(-4),
      created_date: addHours(-5),
    },
    {
      id: "doc-mrn1",
      operation_id: "op-001",
      dossier_reference: "OP-2024-0892",
      name: "MRN_declaration.pdf",
      type: "mrn",
      status: "validated",
      file_url: NEUTRAL_PDF_SAMPLE_URL,
      uploaded_by: "Douane",
      validated_at: addHours(-3),
      created_date: addHours(-4),
    },
    {
      id: "doc-t11",
      operation_id: "op-001",
      dossier_reference: "OP-2024-0892",
      name: "T1_transit.pdf",
      type: "t1",
      status: "validated",
      file_url: NEUTRAL_PDF_SAMPLE_URL,
      uploaded_by: "Douane",
      validated_at: addHours(-3),
      created_date: addHours(-4),
    },
    {
      id: "doc-sal1",
      operation_id: "op-001",
      dossier_reference: "OP-2024-0892",
      name: "Salida_UE.pdf",
      type: "salida",
      status: "validated",
      file_url: NEUTRAL_PDF_SAMPLE_URL,
      uploaded_by: "Douane",
      validated_at: addHours(-2),
      created_date: addHours(-3),
    },
    {
      id: "doc-e1",
      operation_id: "op-001",
      dossier_reference: "OP-2024-0892",
      name: "EUR1_origine.pdf",
      type: "eur1",
      status: "validated",
      file_url: NEUTRAL_PDF_SAMPLE_URL,
      uploaded_by: "Exploitation",
      validated_at: addHours(-2),
      created_date: addHours(-3),
    },
    {
      id: "doc-mlv1",
      operation_id: "op-001",
      dossier_reference: "OP-2024-0892",
      name: "MLV_reception_client.pdf",
      type: "mlv",
      status: "pending",
      file_url: NEUTRAL_PDF_SAMPLE_URL,
      uploaded_by: "Aisha Okonkwo",
      created_date: addHours(-2),
    },
    {
      id: "doc-002",
      operation_id: "op-002",
      dossier_reference: "OP-2024-0890",
      name: "BL_provisoire.pdf",
      type: "bl",
      status: "pending",
      file_url: NEUTRAL_PDF_SAMPLE_URL,
      uploaded_by: "Helena Varga",
      created_date: addHours(-1),
    },
  ],
  Incident: [
    {
      id: "inc-001",
      operation_id: "op-003",
      title: "Retard trafic",
      severity: "medium",
      status: "open",
      type: "delay",
      description: "Trafic dense sur A8",
      created_date: addHours(-3),
    },
    {
      id: "inc-002",
      operation_id: "op-001",
      title: "Réclamation client — créneau",
      severity: "low",
      status: "resolved",
      type: "customer_complaint",
      description: "Client informé, créneau décalé d’une heure.",
      created_date: addDays(-4),
      resolved_at: addDays(-3),
    },
    {
      id: "inc-003",
      operation_id: "op-002",
      title: "Litige facturation résolu",
      severity: "medium",
      status: "closed",
      type: "customer_complaint",
      description: "Accord sur avoir partiel.",
      created_date: addDays(-10),
      resolved_at: addDays(-8),
    },
  ],
  Message: [
    {
      id: "msg-001",
      operation_id: "op-001",
      sender_name: "Dispatch — Terminal 4",
      sender_role: "agent",
      content: "Merci pour la mise à jour.",
      created_date: addHours(-1),
    },
  ],
  MaintenanceHistory: [
    {
      id: "mnt-001",
      vehicle_id: "veh-001",
      type: "Révision",
      description: "Vidange + filtres",
      cost: 850,
      date: addDays(-45),
    },
  ],
  VehicleCost: [
    {
      id: "cost-001",
      vehicle_id: "veh-001",
      cost_type: "Carburant",
      amount: 420,
      date: addDays(-2),
      description: "Plein gasoil",
    },
  ],
  OperationEvent: [
    {
      id: "evt-001",
      operation_id: "op-001",
      type: "created",
      title: "Dossier créé",
      description: "OP-2024-0892 — Baltic Trade OÜ (Paris → Lyon)",
      actor: "Dispatch — Terminal 4",
      created_date: addDays(-2),
    },
    {
      id: "evt-002",
      operation_id: "op-001",
      type: "assigned",
      title: "Chauffeur affecté",
      description: "Viktor Rostov — véhicule AB-123-CD",
      actor: "Planner — Riga",
      created_date: addHours(-50),
    },
    {
      id: "evt-003",
      operation_id: "op-001",
      type: "document_added",
      title: "Pièce jointe — Nota",
      description: "Nota_reservation.pdf — déposé par Exploitation",
      actor: "Exploitation",
      created_date: addHours(-6),
    },
    {
      id: "evt-004",
      operation_id: "op-001",
      type: "status_change",
      title: "Statut : confirmé → en transit",
      description: "Changement de statut du dossier.",
      actor: "Dispatch — Terminal 4",
      created_date: addHours(-2),
    },
    {
      id: "evt-005",
      operation_id: "op-001",
      type: "message",
      title: "Message sur le dossier",
      description: "« Merci pour la mise à jour. »",
      actor: "Dispatch — Terminal 4",
      created_date: addHours(-1),
    },
  ],
  CustomsCheckpoint: [
    {
      id: "cc-seed-001",
      operation_id: "op-001",
      checkpoint_kind: "customs_office",
      label: "Bureau des douanes — contrôle fret (exemple)",
      address: "Zone fret, métropole de Lyon",
      country_code: "FR",
      customs_reference: "",
      lat: 45.6712,
      lng: 4.9825,
      sequence_order: 0,
      scheduled_window_start: addHours(1),
      scheduled_window_end: null,
      status: "pending",
      radius_meters: 500,
      arrived_at: null,
      arrived_by_name: null,
      arrived_lat: null,
      arrived_lng: null,
    },
  ],
  TransitNotification: [],
  /** Règles automation IF → THEN (éditables via JSON dans l’admin futur ; seed ici). */
  WorkflowRule: [
    {
      id: "wf-rule-op-created",
      enabled: true,
      trigger: "operation.created",
      name: "Nouvelle opération — notifier l’exploitation",
      actions: [
        {
          type: "platform_notify",
          target_roles: ["admin", "manager", "exploitation_manager", "agent"],
          title: "Nouvelle opération",
          body_template: "Dossier {{reference}} — {{client_name}} ({{pickup_city}} → {{delivery_city}})",
        },
      ],
      created_date: addDays(-10),
    },
    {
      id: "wf-rule-doc-validated",
      enabled: true,
      trigger: "document.validated",
      name: "Document validé",
      actions: [
        {
          type: "platform_notify",
          target_roles: ["admin", "manager", "agent", "client"],
          title: "Document validé",
          body_template: "Pièce « {{document_name}} » — dossier {{dossier_reference}}.",
        },
      ],
      created_date: addDays(-10),
    },
    {
      id: "wf-rule-delay",
      enabled: true,
      trigger: "delay.detected",
      name: "Risque / retard",
      actions: [
        {
          type: "platform_notify",
          target_roles: ["manager", "exploitation_manager", "client", "agent"],
          title: "Alerte retard",
          body_template: "{{reference}} : {{message}}",
        },
      ],
      created_date: addDays(-10),
    },
    {
      id: "wf-rule-inactive",
      enabled: true,
      trigger: "vehicle.inactive",
      name: "Véhicule immobile",
      actions: [
        {
          type: "platform_notify",
          target_roles: ["admin", "agent", "support"],
          title: "Véhicule sans mouvement prolongé",
          body_template: "{{plate_number}} — {{message}}",
        },
      ],
      created_date: addDays(-10),
    },
  ],
  /** Historique des décisions sur documents (audit). */
  DocumentAuditLog: [],
  /** Notifications filtrables par rôle (en plus des TransitNotification douane). */
  PlatformNotification: [],
  /** Devis commerciaux (ERP — cycle avant facturation). */
  SalesQuote: [
    {
      id: "sq-001",
      reference: "DEV-2026-0042",
      client_company: "Baltic Trade OÜ",
      commercial_owner: "Nadia Volkov",
      contact_name: "Procurement desk",
      contact_email: "ops@baltic-trade.demo",
      title: "Transport national — Paris → Lyon (24 palettes)",
      amount_ht: 4200,
      vat_rate: 20,
      amount_ttc: 5040,
      currency: "EUR",
      valid_until: addDays(14),
      status: "sent",
      notes: "Valable 14 jours — conditions standards.",
      created_date: addDays(-3),
    },
    {
      id: "sq-002",
      reference: "DEV-2026-0041",
      client_company: "Kwantum Labs GmbH",
      commercial_owner: "James Okoro",
      contact_name: "Inbound logistics",
      contact_email: "dock@kwantum-labs.demo",
      title: "Messagerie express — 3 rotations / semaine",
      amount_ht: 8900,
      vat_rate: 20,
      amount_ttc: 10680,
      currency: "EUR",
      valid_until: addDays(-2),
      status: "accepted",
      notes: "Accepté — bon de commande BC-8891.",
      created_date: addDays(-12),
    },
    {
      id: "sq-003",
      reference: "DEV-2026-0038",
      client_company: "Atlas Heavy Works SA",
      commercial_owner: "Kenji Takano",
      contact_name: "Fleet desk Casablanca",
      contact_email: "fleet@atlas-heavy.demo",
      title: "Affrètement FTL — tournées régionales Q2",
      amount_ht: 28500,
      vat_rate: 20,
      amount_ttc: 34200,
      currency: "EUR",
      valid_until: addDays(5),
      status: "draft",
      notes: "",
      created_date: addDays(-1),
    },
  ],
  /** Fichier client maître (import CSV / JSON — référentiel CRM). */
  Client: [
    {
      id: "cli-seed-001",
      company_name: "Baltic Trade OÜ",
      external_code: "CLI-BALTIC",
      legal_id: "",
      sector: "Industrie",
      contact_name: "Procurement desk",
      contact_email: "ops@baltic-trade.demo",
      contact_phone: "",
      address_line1: "Parc d'activités Nord",
      city: "Lyon",
      postal_code: "69000",
      country: "France",
      payment_terms: "30 jours fin de mois",
      notes: "Exemple fichier maître — modifiable par import.",
      created_date: addDays(-20),
    },
    {
      id: "cli-seed-002",
      company_name: "Kwantum Labs GmbH",
      external_code: "CLI-KWANT",
      legal_id: "DE88990011223",
      sector: "Technologie",
      contact_name: "Inbound logistics",
      contact_email: "dock@kwantum-labs.demo",
      contact_phone: "+33140000000",
      address_line1: "10 rue de la Paix",
      city: "Paris",
      postal_code: "75002",
      country: "France",
      payment_terms: "45 jours date de facture",
      notes: "",
      created_date: addDays(-15),
    },
    {
      id: "cli-seed-003",
      company_name: "Atlas Heavy Works SA",
      external_code: "CLI-ATLAS",
      legal_id: "",
      sector: "Industrie",
      contact_name: "Export control",
      contact_email: "export@atlas-heavy.demo",
      contact_phone: "+212522000000",
      address_line1: "Zone industrielle",
      city: "Casablanca",
      postal_code: "20000",
      country: "Maroc",
      payment_terms: "60 jours",
      notes: "Client export / FTL.",
      created_date: addDays(-8),
    },
  ],
  /** Journal des actions sensibles (administration comptes) — traçabilité par nom d’acteur. */
  SecurityAuditLog: [],
  /** Départements / directions — affectation des utilisateurs (gestion admin). */
  Department: [
    {
      id: "dept-exp-nat",
      name: "Exploitation nationale",
      code: "EXP-NAT",
      scope_label: "National",
      description: "Planification et suivi des flux domestiques.",
      created_date: addDays(-400),
    },
    {
      id: "dept-intl",
      name: "International & douane",
      code: "INTL",
      scope_label: "International",
      description: "MRN, corridors, conformité transfrontalière.",
      created_date: addDays(-400),
    },
    {
      id: "dept-support",
      name: "Support client & TMS",
      code: "SUP",
      scope_label: "Transverse",
      description: "Assistance et coordination système.",
      created_date: addDays(-200),
    },
  ],
  /**
   * Paramètres globaux pilotés par l’administrateur.
   * `role_module_grants` : null = jeux par défaut du code ; sinon objet { [role]: string[] } (liste complète des ids module par rôle).
   */
  AppControlSettings: [
    {
      id: "app-control",
      role_module_grants: null,
      updated_date: null,
    },
  ],
};

function migrateLegacyStorage() {
  if (typeof window === "undefined") return;
  try {
    if (!localStorage.getItem(STORAGE_KEYS.dataStore) && localStorage.getItem(LEGACY_KEYS.dataStore)) {
      localStorage.setItem(STORAGE_KEYS.dataStore, localStorage.getItem(LEGACY_KEYS.dataStore));
    }
    if (!localStorage.getItem(STORAGE_KEYS.sessionUser) && localStorage.getItem(LEGACY_KEYS.sessionUser)) {
      localStorage.setItem(STORAGE_KEYS.sessionUser, localStorage.getItem(LEGACY_KEYS.sessionUser));
    }
    if (!localStorage.getItem(STORAGE_KEYS.users) && localStorage.getItem(LEGACY_KEYS.users)) {
      localStorage.setItem(STORAGE_KEYS.users, localStorage.getItem(LEGACY_KEYS.users));
    }
  } catch {
    /* ignore */
  }
}

migrateLegacyStorage();

const buildSeedStore = () =>
  Object.fromEntries(Object.entries(seedData).map(([key, value]) => [key, [...value]]));

const normalizeStore = (raw) => {
  const seed = buildSeedStore();
  if (!raw || typeof raw !== "object") {
    return seed;
  }
  return Object.fromEntries(
    Object.keys(seed).map((key) => [key, Array.isArray(raw[key]) ? raw[key] : seed[key]])
  );
};

const readStore = () => {
  if (typeof window === "undefined") {
    return buildSeedStore();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.dataStore);
    const parsed = raw ? JSON.parse(raw) : null;
    return normalizeStore(parsed);
  } catch (error) {
    console.error("Erreur lecture stockage local:", error);
    return buildSeedStore();
  }
};

const writeStore = (nextStore) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEYS.dataStore, JSON.stringify(nextStore));
  } catch (error) {
    console.error("Erreur écriture stockage local:", error);
  }
};

let store = readStore();

function splitUserDisplayNameForDriver(fullName) {
  const s = String(fullName || "").trim();
  if (!s) return { first_name: "Chauffeur", last_name: "Compte" };
  const parts = s.split(/\s+/);
  if (parts.length === 1) return { first_name: parts[0], last_name: "—" };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}

function newProvisionedDriverId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `drv-u${crypto.randomUUID().replace(/-/g, "").slice(0, 9)}`;
  }
  return `drv-u${String(nextLocalEntityId()).replace(/^id_/, "")}`;
}

/** Crée une fiche Driver (liste chauffeurs) et retourne son id — pour comptes profil « chauffeur » sans liaison. */
function appendDriverFromUserAccount({ full_name, email, phone }) {
  store = readStore();
  const id = newProvisionedDriverId();
  const { first_name, last_name } = splitUserDisplayNameForDriver(full_name);
  const phoneOk = String(phone || "").trim() || "+33000000000";
  const driver = {
    id,
    first_name,
    last_name,
    phone: phoneOk,
    email: normalizeEmail(email),
    status: "available",
    rating: 4.5,
    total_deliveries: 0,
    on_time_rate: 100,
    certifications: [],
    current_location: "Base régionale",
    work_visa_expiry: null,
    created_date: new Date().toISOString(),
  };
  store.Driver = [driver, ...(store.Driver || [])];
  writeStore(store);
  return id;
}

/** Journal sécurité / administration — acteur identifié par nom et e-mail de session. */
function appendSecurityAuditEntry({ session, action, summary, targetUser, metadata }) {
  store = readStore();
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `sec-${nextLocalEntityId()}`;
  const row = {
    id,
    created_date: new Date().toISOString(),
    action: String(action || "event"),
    summary: String(summary || "").slice(0, 500),
    actor_user_id: session?.id ?? null,
    actor_name: String(session?.full_name || "").trim() || String(session?.email || "").trim() || "Inconnu",
    actor_email: String(session?.email || "").trim(),
    target_user_id: targetUser?.id ?? null,
    target_user_name: String(targetUser?.full_name || "").trim(),
    target_user_email: String(targetUser?.email || "").trim(),
    metadata_json: metadata != null ? JSON.stringify(metadata).slice(0, 2000) : null,
  };
  const list = store.SecurityAuditLog || [];
  store.SecurityAuditLog = [row, ...list].slice(0, 400);
  writeStore(store);
}

const toSortable = (value) => {
  if (value instanceof Date) {
    return value.getTime();
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return value ?? "";
};

const sortByOrder = (items, order) => {
  if (!order) {
    return [...items];
  }
  const isDesc = order.startsWith("-");
  const key = isDesc ? order.slice(1) : order;
  const direction = isDesc ? -1 : 1;

  return [...items].sort((a, b) => {
    const aValue = toSortable(a[key]);
    const bValue = toSortable(b[key]);
    if (aValue < bValue) return -1 * direction;
    if (aValue > bValue) return 1 * direction;
    return 0;
  });
};

const createEntityApi = (entityName) => ({
  list: async (order, limit) => {
    const items = sortByOrder(store[entityName] || [], order);
    return typeof limit === "number" ? items.slice(0, limit) : items;
  },
  filter: async (query = {}, order) => {
    const filtered = (store[entityName] || []).filter((item) =>
      Object.entries(query).every(([key, value]) => item[key] === value)
    );
    return sortByOrder(filtered, order);
  },
  create: async (data) => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : nextLocalEntityId();
    const record = {
      id,
      created_date: new Date().toISOString(),
      ...data,
    };
    store[entityName] = [record, ...(store[entityName] || [])];
    writeStore(store);
    return record;
  },
  update: async (id, data) => {
    const items = store[entityName] || [];
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }
    const updated = { ...items[index], ...data };
    items[index] = updated;
    store[entityName] = items;
    writeStore(store);
    return updated;
  },
  delete: async (id) => {
    store = readStore();
    const items = store[entityName] || [];
    const next = items.filter((item) => item.id !== id);
    if (next.length === items.length) {
      return false;
    }
    store[entityName] = next;
    writeStore(store);
    return true;
  },
});

const operationEntityApi = createEntityApi("Operation");
const documentEntityApi = createEntityApi("Document");
const messageEntityApi = createEntityApi("Message");

const defaultAdminUser = {
  id: "user-admin-iksatech",
  full_name: "Administrateur IksaTech",
  email: CANONICAL_ADMIN_EMAIL,
  user_role: "admin",
  password: "12345",
  is_active: true,
};

/** Compte chauffeur type terrain (seed) — lié à drv-001 pour connexion immédiate après installation. */
const defaultDriverUser = {
  id: "user-driver-jean-demo",
  full_name: "Viktor Rostov",
  email: "viktor.rostov@fleet.demo",
  user_role: "driver",
  password: "12345",
  linked_driver_id: "drv-001",
  is_active: true,
};

const readAuthUser = () => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.sessionUser);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Erreur lecture utilisateur:", error);
    return null;
  }
};

const writeAuthUser = (user) => {
  if (typeof window === "undefined") {
    return;
  }
  if (!user) {
    window.localStorage.removeItem(STORAGE_KEYS.sessionUser);
    return;
  }
  window.localStorage.setItem(STORAGE_KEYS.sessionUser, JSON.stringify(user));
};

function sessionActorLabel() {
  const u = readAuthUser();
  return String(u?.full_name || "").trim() || String(u?.email || "").trim() || "Système";
}

const OPERATION_STATUS_LABEL_FR = {
  draft: "Brouillon",
  confirmed: "Confirmé",
  assigned: "Affecté",
  in_transit: "En transit",
  loading: "Chargement",
  unloading: "Déchargement",
  delivered: "Livré",
  completed: "Terminé",
  cancelled: "Annulé",
  incident: "Incident",
};

function operationStatusLabelFr(code) {
  return OPERATION_STATUS_LABEL_FR[String(code || "")] || String(code || "—");
}

const DOCUMENT_TYPE_LABEL_FR = {
  nota: "Nota",
  commercial_invoice: "Facture commerciale",
  cmr: "CMR",
  loading_sheet: "Fiche chargement",
  mrn: "MRN",
  t1: "T1",
  salida: "Salida",
  eur1: "EUR1",
  mlv: "MLV",
  bl: "BL",
  invoice: "Facture",
  pod: "POD",
  packing_list: "Packing list",
  customs: "Douane",
  photo: "Photo",
  other: "Autre",
};

function documentTypeLabelFr(t) {
  return DOCUMENT_TYPE_LABEL_FR[String(t || "")] || String(t || "Pièce");
}

/**
 * Écrit une entrée dans la timeline du dossier (écran détail opération).
 * Exportée pour les flux qui ajoutent un événement hors entité (ex. arrivée douane).
 */
export function appendOperationTimelineEvent({
  operation_id,
  type,
  title,
  description,
  actor,
  metadata,
  created_date,
}) {
  if (!operation_id) return null;
  store = readStore();
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `evt-${nextLocalEntityId()}`;
  const ts = created_date || new Date().toISOString();
  const row = {
    id,
    operation_id,
    type: type || "status_change",
    title: String(title || "Événement").slice(0, 200),
    description: String(description || "").slice(0, 2000),
    actor: String(actor || sessionActorLabel()).slice(0, 200),
    ...(metadata != null && typeof metadata === "object" ? { metadata } : {}),
    created_date: ts,
  };
  const list = store.OperationEvent || [];
  store.OperationEvent = [row, ...list].slice(0, 800);
  writeStore(store);
  return row;
}

const normalizeEmail = (email) => (email || "").trim().toLowerCase();

/** Gestion des comptes (agents, chauffeurs, clients, etc.) : réservée à l’administrateur uniquement. */
function requireAdminSession() {
  const session = readAuthUser();
  if (!session || String(session.user_role || "").trim().toLowerCase() !== "admin") {
    throw new Error(
      "Accès refusé : seul un administrateur peut gérer les comptes utilisateurs (agents d’exploitation, chauffeurs, clients, etc.)."
    );
  }
  return session;
}

const writeUsers = (users) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
};

/** Corrige le rôle si le compte principal a été rétrogradé par erreur dans localStorage. */
function ensureCanonicalAdminUsers(users) {
  let changed = false;
  const next = users.map((user) => {
    if (normalizeEmail(user.email) === normalizeEmail(CANONICAL_ADMIN_EMAIL)) {
      if (user.user_role !== "admin") {
        changed = true;
        return { ...user, user_role: "admin" };
      }
    }
    return user;
  });
  if (changed) {
    writeUsers(next);
  }
  return next;
}

const readUsers = () => {
  if (typeof window === "undefined") {
    return [defaultAdminUser];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.users);
    const parsed = raw ? JSON.parse(raw) : [];
    let users = Array.isArray(parsed) ? parsed : [];
    const hasAdmin = users.some(
      (user) => normalizeEmail(user.email) === normalizeEmail(defaultAdminUser.email)
    );
    if (!hasAdmin) {
      users = [defaultAdminUser, ...users];
      window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    }
    const hasDemoDriver = users.some(
      (user) => normalizeEmail(user.email) === normalizeEmail(defaultDriverUser.email)
    );
    if (!hasDemoDriver) {
      users = [...users, defaultDriverUser];
      window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    }
    return ensureCanonicalAdminUsers(users);
  } catch (error) {
    console.error("Erreur lecture utilisateurs:", error);
    return [defaultAdminUser];
  }
};

/** Taille max pour intégrer le fichier en base64 dans le store local (évite QuotaExceeded + reste ouvrable en aperçu). */
const UPLOAD_INLINE_MAX_BYTES = 450 * 1024;

/**
 * Upload local — en production : stockage objet (S3, Azure, Supabase, etc.).
 * Petits fichiers : data URL (aperçu / téléchargement OK). Gros fichiers : URL technique + nom (démo).
 */
export async function uploadLocalFile({ file }) {
  if (!file || !(file instanceof Blob)) {
    throw new Error("Aucun fichier sélectionné.");
  }
  if (file.size > UPLOAD_INLINE_MAX_BYTES) {
    const name = file.name ? encodeURIComponent(file.name) : "file";
    return {
      file_url: `local-upload://${name}`,
      storage: "placeholder",
    };
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Lecture du fichier impossible."));
        return;
      }
      resolve({ file_url: result, storage: "inline" });
    };
    reader.onerror = () => reject(new Error("Lecture du fichier impossible."));
    reader.readAsDataURL(file);
  });
}

export async function simulateAiReply({ prompt }) {
  const excerpt = String(prompt || "").trim().slice(0, 200);
  return [
    "FR — Aucun moteur IA distant n’est configuré : réponse placeholder basée sur votre saisie. Branchez votre API (OpenAI, Azure OpenAI, modèle interne) pour des réponses complètes.",
    "EN — No remote LLM is configured: this is a placeholder echo of your input. Connect your AI API for full answers.",
    excerpt ? `« ${excerpt} »` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

/**
 * Droits modules personnalisés par l’administrateur (null = défauts du code dans accessModules).
 * Export synchrone pour le menu et les garde-routes de routes.
 */
export function getRoleModuleGrantsOverride() {
  if (typeof window === "undefined") return null;
  store = readStore();
  const row = (store.AppControlSettings || []).find((r) => r.id === "app-control");
  if (!row || row.role_module_grants == null) return null;
  return row.role_module_grants;
}

export const appApi = {
  auth: {
    me: async () => {
      const user = readAuthUser();
      if (!user) {
        throw new Error("User not logged in");
      }
      return user;
    },
    login: async (payload) => {
      const users = readUsers();
      const email = normalizeEmail(payload.email);
      const user = users.find((item) => normalizeEmail(item.email) === email);
      if (!user) {
        throw new Error("User not found");
      }
      if (!payload.password || payload.password !== user.password) {
        throw new Error("Invalid password");
      }
      if (user.is_active === false) {
        throw new Error("Compte désactivé — contactez votre administrateur.");
      }
      writeAuthUser(user);
      return user;
    },
    logout: async () => {
      writeAuthUser(null);
      return true;
    },
  },
  entities: {
    Operation: {
      ...operationEntityApi,
      create: async (data) => {
        const record = await operationEntityApi.create(data);
        const ref = String(record.reference || "").trim() || record.id;
        const route = [record.pickup_city, record.delivery_city].filter(Boolean).join(" → ");
        appendOperationTimelineEvent({
          operation_id: record.id,
          type: "created",
          title: "Dossier créé",
          description: route ? `${ref} — ${record.client_name || "Client"} (${route})` : `${ref} — ${record.client_name || "Client"}`,
          actor: sessionActorLabel(),
          metadata: { reference: record.reference },
        });
        return record;
      },
      update: async (id, data) => {
        store = readStore();
        const items = store.Operation || [];
        const index = items.findIndex((item) => item.id === id);
        if (index === -1) return null;
        const prev = { ...items[index] };
        const record = await operationEntityApi.update(id, data);
        if (!record) return null;
        const actor = sessionActorLabel();
        if (Object.prototype.hasOwnProperty.call(data, "status") && data.status !== prev.status) {
          const frPrev = operationStatusLabelFr(prev.status);
          const frNext = operationStatusLabelFr(data.status);
          const done = data.status === "delivered" || data.status === "completed";
          appendOperationTimelineEvent({
            operation_id: id,
            type: done ? "completed" : "status_change",
            title: `Statut : ${frPrev} → ${frNext}`,
            description: `Changement de statut du dossier (${prev.status} → ${data.status}).`,
            actor,
            metadata: { from: prev.status, to: data.status },
          });
        }
        if (
          Object.prototype.hasOwnProperty.call(data, "driver_id") &&
          String(data.driver_id || "") !== String(prev.driver_id || "")
        ) {
          const dname = String(data.driver_name || data.driver_id || "").trim() || "—";
          appendOperationTimelineEvent({
            operation_id: id,
            type: "assigned",
            title: "Chauffeur / affectation",
            description: `Chauffeur : ${dname}`,
            actor,
            metadata: { driver_id: data.driver_id || null },
          });
        }
        if (
          Object.prototype.hasOwnProperty.call(data, "vehicle_plate") &&
          String(data.vehicle_plate || "").trim() !== String(prev.vehicle_plate || "").trim()
        ) {
          appendOperationTimelineEvent({
            operation_id: id,
            type: "status_change",
            title: "Véhicule mis à jour",
            description: `Immatriculation / tracteur : ${String(data.vehicle_plate || "").trim() || "—"}`,
            actor,
            metadata: { vehicle_plate: data.vehicle_plate },
          });
        }
        return record;
      },
    },
    Vehicle: createEntityApi("Vehicle"),
    Driver: createEntityApi("Driver"),
    Document: {
      ...documentEntityApi,
      create: async (data) => {
        const record = await documentEntityApi.create(data);
        const opId = record.operation_id;
        if (opId) {
          const typeLabel = documentTypeLabelFr(record.type);
          const who = String(record.uploaded_by || sessionActorLabel()).trim();
          appendOperationTimelineEvent({
            operation_id: opId,
            type: "document_added",
            title: `Pièce jointe — ${typeLabel}`,
            description: `${record.name || "Fichier"} — déposé par ${who}`,
            actor: who,
            metadata: { document_id: record.id, document_type: record.type },
          });
        }
        return record;
      },
      update: async (id, data) => {
        store = readStore();
        const items = store.Document || [];
        const index = items.findIndex((item) => item.id === id);
        if (index === -1) return null;
        const prev = { ...items[index] };
        const record = await documentEntityApi.update(id, data);
        if (!record?.operation_id) return record;
        const opId = record.operation_id;
        const actorDefault = sessionActorLabel();
        if (Object.prototype.hasOwnProperty.call(data, "status") && data.status !== prev.status) {
          const name = record.name || prev.name || "Document";
          const typeLabel = documentTypeLabelFr(record.type || prev.type);
          if (data.status === "validated") {
            appendOperationTimelineEvent({
              operation_id: opId,
              type: "status_change",
              title: "Document validé",
              description: `${typeLabel} — ${name}`,
              actor: String(data.validated_by || actorDefault).trim() || actorDefault,
              metadata: { document_id: id, document_type: record.type },
            });
          } else if (data.status === "rejected") {
            appendOperationTimelineEvent({
              operation_id: opId,
              type: "status_change",
              title: "Document rejeté",
              description: `${typeLabel} — ${name}${data.notes ? ` — ${String(data.notes).slice(0, 180)}` : ""}`,
              actor: String(data.rejected_by || actorDefault).trim() || actorDefault,
              metadata: { document_id: id, document_type: record.type },
            });
          } else {
            appendOperationTimelineEvent({
              operation_id: opId,
              type: "document_added",
              title: "Document — mise à jour",
              description: `${typeLabel} — ${name} (statut : ${data.status})`,
              actor: actorDefault,
              metadata: { document_id: id, document_type: record.type },
            });
          }
        }
        return record;
      },
    },
    Incident: createEntityApi("Incident"),
    Message: {
      ...messageEntityApi,
      create: async (data) => {
        const record = await messageEntityApi.create(data);
        if (record.operation_id) {
          const raw = String(record.content || "").trim();
          const excerpt = raw.slice(0, 220);
          appendOperationTimelineEvent({
            operation_id: record.operation_id,
            type: "message",
            title: "Message sur le dossier",
            description: excerpt
              ? `« ${excerpt}${raw.length > excerpt.length ? "…" : ""} »`
              : "(message vide)",
            actor: String(record.sender_name || sessionActorLabel()).trim() || sessionActorLabel(),
            metadata: { message_id: record.id },
          });
        }
        return record;
      },
    },
    MaintenanceHistory: createEntityApi("MaintenanceHistory"),
    VehicleCost: createEntityApi("VehicleCost"),
    OperationEvent: createEntityApi("OperationEvent"),
    CustomsCheckpoint: createEntityApi("CustomsCheckpoint"),
    TransitNotification: createEntityApi("TransitNotification"),
    WorkflowRule: createEntityApi("WorkflowRule"),
    DocumentAuditLog: createEntityApi("DocumentAuditLog"),
    SecurityAuditLog: {
      list: async (order) => {
        requireAdminSession();
        store = readStore();
        return sortByOrder(store.SecurityAuditLog || [], order || "-created_date");
      },
    },
    PlatformNotification: createEntityApi("PlatformNotification"),
    SalesQuote: createEntityApi("SalesQuote"),
    Client: createEntityApi("Client"),
    Department: {
      ...createEntityApi("Department"),
      delete: async (id) => {
        requireAdminSession();
        const users = readUsers();
        if (users.some((u) => String(u.department_id || "") === String(id))) {
          throw new Error("Impossible de supprimer : des utilisateurs sont encore affectés à ce département.");
        }
        store = readStore();
        const items = store.Department || [];
        const next = items.filter((item) => item.id !== id);
        if (next.length === items.length) {
          return false;
        }
        store.Department = next;
        writeStore(store);
        return true;
      },
    },
    AppControlSettings: {
      get: async () => {
        requireAdminSession();
        store = readStore();
        const rows = store.AppControlSettings || [];
        return rows.find((r) => r.id === "app-control") || null;
      },
      updateGrants: async (role_module_grants) => {
        const session = requireAdminSession();
        store = readStore();
        const rows = [...(store.AppControlSettings || [])];
        let idx = rows.findIndex((r) => r.id === "app-control");
        const prev = idx >= 0 ? rows[idx].role_module_grants : null;
        const nextRow = {
          id: "app-control",
          role_module_grants,
          updated_date: new Date().toISOString(),
        };
        if (idx >= 0) rows[idx] = nextRow;
        else rows.unshift(nextRow);
        store.AppControlSettings = rows;
        writeStore(store);
        const actorLabel = String(session.full_name || "").trim() || session.email;
        appendSecurityAuditEntry({
          session,
          action: "settings.module_grants",
          summary: `${actorLabel} a mis à jour les droits modules par rôle (configuration administrateur).`,
          targetUser: null,
          metadata: { previous: prev, next: role_module_grants },
        });
        return nextRow;
      },
      resetGrants: async () => {
        const session = requireAdminSession();
        store = readStore();
        const rows = [...(store.AppControlSettings || [])];
        let idx = rows.findIndex((r) => r.id === "app-control");
        const nextRow = {
          id: "app-control",
          role_module_grants: null,
          updated_date: new Date().toISOString(),
        };
        if (idx >= 0) rows[idx] = nextRow;
        else rows.unshift(nextRow);
        store.AppControlSettings = rows;
        writeStore(store);
        const actorLabel = String(session.full_name || "").trim() || session.email;
        appendSecurityAuditEntry({
          session,
          action: "settings.module_grants_reset",
          summary: `${actorLabel} a réinitialisé les modules aux valeurs par défaut du système.`,
          targetUser: null,
          metadata: {},
        });
        return nextRow;
      },
    },
    User: {
      list: async () => {
        requireAdminSession();
        return readUsers();
      },
      create: async (data) => {
        const session = requireAdminSession();
        const users = readUsers();
        const email = normalizeEmail(data.email);
        if (!email) {
          throw new Error("Email requis");
        }
        if (!data.password) {
          throw new Error("Mot de passe requis");
        }
        const exists = users.some((user) => normalizeEmail(user.email) === email);
        if (exists) {
          throw new Error("Email déjà utilisé");
        }
        const record = {
          id:
            typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `user_${nextLocalEntityId()}`,
          full_name: data.full_name?.trim() || "Utilisateur",
          email,
          user_role: data.user_role || "agent",
          password: String(data.password),
          is_active: data.is_active === undefined ? true : Boolean(data.is_active),
        };
        if (data.department_id != null && String(data.department_id).trim() !== "") {
          record.department_id = String(data.department_id).trim();
        }
        const role = String(record.user_role || "").toLowerCase();
        const rawLink =
          data.linked_driver_id != null && String(data.linked_driver_id).trim() !== ""
            ? String(data.linked_driver_id).trim()
            : "";
        if (role === "driver") {
          if (rawLink) {
            record.linked_driver_id = rawLink;
          } else {
            record.linked_driver_id = appendDriverFromUserAccount({
              full_name: record.full_name,
              email: record.email,
              phone: data.driver_phone,
            });
          }
        }
        const nextUsers = [record, ...users];
        writeUsers(nextUsers);
        const actorLabel = String(session.full_name || "").trim() || session.email;
        appendSecurityAuditEntry({
          session,
          action: "user.create",
          summary: `${actorLabel} a créé le compte « ${record.full_name} » (${record.email}) — profil ${record.user_role}.`,
          targetUser: record,
          metadata: { user_role: record.user_role, linked_driver_id: record.linked_driver_id || null },
        });
        return record;
      },
      update: async (id, data) => {
        const session = requireAdminSession();
        const users = readUsers();
        const index = users.findIndex((user) => user.id === id);
        if (index === -1) {
          throw new Error("Utilisateur introuvable");
        }
        const target = users[index];
        const isCanon = normalizeEmail(target.email) === normalizeEmail(CANONICAL_ADMIN_EMAIL);
        if (isCanon && data.user_role != null && data.user_role !== "admin") {
          throw new Error(
            "Le compte administrateur principal ne peut pas être rétrogradé (gestion des comptes)."
          );
        }
        if (isCanon && data.email != null && normalizeEmail(data.email) !== normalizeEmail(CANONICAL_ADMIN_EMAIL)) {
          throw new Error("L’e-mail du compte administrateur principal ne peut pas être modifié.");
        }
        if (isCanon && Object.prototype.hasOwnProperty.call(data, "is_active") && data.is_active === false) {
          throw new Error("Impossible de désactiver le compte administrateur principal.");
        }

        const next = { ...target };
        const changes = [];

        if (Object.prototype.hasOwnProperty.call(data, "full_name")) {
          const fn = String(data.full_name ?? "").trim() || "Utilisateur";
          if (fn !== String(target.full_name || "").trim()) {
            changes.push(`nom affiché : « ${target.full_name || ""} » → « ${fn} »`);
          }
          next.full_name = fn;
        }

        if (data.email != null && String(data.email).trim() !== "") {
          const ne = normalizeEmail(data.email);
          if (ne && ne !== normalizeEmail(target.email)) {
            const taken = users.some((u, i) => i !== index && normalizeEmail(u.email) === ne);
            if (taken) {
              throw new Error("Email déjà utilisé");
            }
            changes.push(`e-mail : ${target.email} → ${ne}`);
            next.email = ne;
          }
        }

        if (data.password != null && String(data.password).trim() !== "") {
          next.password = String(data.password);
          changes.push("mot de passe réinitialisé");
        }

        if (Object.prototype.hasOwnProperty.call(data, "is_active")) {
          const was = target.is_active !== false;
          const now = Boolean(data.is_active);
          next.is_active = now;
          if (was !== now) {
            changes.push(now ? "compte réactivé" : "compte désactivé");
          }
        }

        if (data.user_role != null) {
          const nr = String(data.user_role).toLowerCase();
          const pr = String(target.user_role || "").toLowerCase();
          if (nr !== pr) {
            changes.push(`rôle : ${pr} → ${nr}`);
          }
          next.user_role = data.user_role;
        }

        if (Object.prototype.hasOwnProperty.call(data, "department_id")) {
          const raw = data.department_id;
          const nextDept = raw == null || raw === "" ? null : String(raw).trim();
          const prevDept = target.department_id || null;
          if (nextDept !== prevDept) {
            changes.push(
              nextDept
                ? `département : ${prevDept || "—"} → ${nextDept}`
                : "département retiré de la fiche"
            );
          }
          if (nextDept) next.department_id = nextDept;
          else delete next.department_id;
        }

        const nextRole = String(next.user_role || "").toLowerCase();
        if (nextRole !== "driver") {
          if (target.linked_driver_id) {
            changes.push("liaison fiche chauffeur retirée (profil non chauffeur)");
          }
          delete next.linked_driver_id;
        } else {
          const rawLink =
            data.linked_driver_id != null && String(data.linked_driver_id).trim() !== ""
              ? String(data.linked_driver_id).trim()
              : null;
          if (rawLink) {
            if (String(target.linked_driver_id || "").trim() !== rawLink) {
              changes.push(`fiche chauffeur liée : ${rawLink}`);
            }
            next.linked_driver_id = rawLink;
          } else if (
            Object.prototype.hasOwnProperty.call(data, "linked_driver_id") &&
            (data.linked_driver_id === "" || data.linked_driver_id === null)
          ) {
            delete next.linked_driver_id;
            const reuseId =
              String(target.user_role || "").toLowerCase() === "driver" && target.linked_driver_id
                ? target.linked_driver_id
                : null;
            next.linked_driver_id =
              reuseId ||
              appendDriverFromUserAccount({
                full_name: next.full_name,
                email: next.email,
                phone: data.driver_phone,
              });
            if (!reuseId) {
              changes.push(`fiche chauffeur créée (${next.linked_driver_id})`);
            }
          } else if (!next.linked_driver_id) {
            const reuseId =
              String(target.user_role || "").toLowerCase() === "driver" && target.linked_driver_id
                ? target.linked_driver_id
                : null;
            next.linked_driver_id =
              reuseId ||
              appendDriverFromUserAccount({
                full_name: next.full_name,
                email: next.email,
                phone: data.driver_phone,
              });
            if (!reuseId) {
              changes.push(`fiche chauffeur créée (${next.linked_driver_id})`);
            }
          }
        }

        users[index] = next;
        writeUsers(users);

        if (changes.length > 0) {
          const actorLabel = String(session.full_name || "").trim() || session.email;
          appendSecurityAuditEntry({
            session,
            action: "user.update",
            summary: `${actorLabel} a modifié le compte « ${next.full_name} » (${next.email}) : ${changes.join(" ; ")}.`,
            targetUser: next,
            metadata: { changes },
          });
        }

        return next;
      },
    },
  },
  uploadFile: uploadLocalFile,
  simulateAiReply,
};
