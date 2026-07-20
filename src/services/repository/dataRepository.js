/**
 * Couche d’accès aux données — point unique pour brancher une API REST plus tard.
 * Aujourd’hui : délègue à appApi (localStorage). Remplacer les implémentations par fetch() sans toucher aux écrans.
 */
import { appApi } from "@/api/appApi";

export const dataRepository = {
  auth: appApi.auth,
  uploadFile: appApi.uploadFile,
  operations: appApi.entities.Operation,
  vehicles: appApi.entities.Vehicle,
  drivers: appApi.entities.Driver,
  documents: appApi.entities.Document,
  incidents: appApi.entities.Incident,
  messages: appApi.entities.Message,
  operationEvents: appApi.entities.OperationEvent,
  customs: appApi.entities.CustomsCheckpoint,
  transitNotifications: appApi.entities.TransitNotification,
  workflowRules: appApi.entities.WorkflowRule,
  documentAuditLog: appApi.entities.DocumentAuditLog,
  platformNotifications: appApi.entities.PlatformNotification,
  salesQuotes: appApi.entities.SalesQuote,
  users: appApi.entities.User,
};

/** Futur : export const dataRepository = createRestRepository(baseUrl) */
