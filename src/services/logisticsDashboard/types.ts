/**
 * DTO « une ligne mission » pour un tableau de bord logistique / flotte (format tabulaire).
 * Les clés peuvent être alignées sur l’export JSON du dashboard Express (ex. alias courts).
 *
 * Source de vérité côté app LogiTrans : voir `mapOperationToDashboardMission.ts` et entité Operation.
 */

/** Ligne normalisée — champs optionnels si le backend ne les fournit pas encore */
export interface FleetDashboardMissionRow {
  /** Identifiant dossier (SoT : Operation.id) */
  id: string;
  /** Référence dossier (SoT : Operation.reference) */
  REFERENCE?: string;
  /** Client (SoT : Operation.client_name) */
  CLIENT?: string;
  /**
   * Interlocuteur / responsable dossier côté exploitation.
   * SoT recommandé : Operation.assigned_agent ; à défaut chaîne vide (à ajouter en base si besoin).
   */
  "Int.Resp"?: string;
  /** Immatriculation tracteur (SoT : Operation.vehicle_plate ; déprécié si doublon avec vehicle_id non résolu) */
  TRACTEUR?: string;
  /** Position / état texte dérivé du statut + villes (pas de second champ redondant avec status brut) */
  POSITION?: string;
  /** Sens : import | export | national | … (SoT : Operation.type_operation) */
  IMPORT?: string;
  /** Statut technique (SoT : Operation.status) */
  status?: string;
  /** Chauffeur affichage — dérivé de driver_id + annuaire ; ne pas persister comme SoT si driver_id existe */
  CHAUFFEUR?: string;
  /** ID chauffeur (SoT : Operation.driver_id) */
  driver_id?: string | null;
  /** Enlèvement / livraison courtes (SoT : villes Operation) */
  TRAJET?: string;
  /** Retard minutes (SoT : Operation.delay_minutes) */
  RETARD_MIN?: number;
  /** Priorité (SoT : Operation.priority) */
  PRIORITE?: string;
  /** JSON libre pour colonnes futures du dashboard sans casser le typage */
  meta?: Record<string, unknown>;
}

export interface LogisticsApiMissionsResponse {
  missions?: FleetDashboardMissionRow[];
  data?: FleetDashboardMissionRow[];
  rows?: FleetDashboardMissionRow[];
}

export interface LogisticsStatisticsDto {
  [key: string]: unknown;
}
