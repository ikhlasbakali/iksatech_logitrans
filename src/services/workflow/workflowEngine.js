/**
 * Moteur d’automation : lit les WorkflowRule (JSON / objets) et exécute les actions.
 * Les règles sont stockées en local ; plus tard : GET /api/workflow-rules depuis le backend.
 */
import { dataRepository } from "@/services/repository/dataRepository";

/** Remplace {{champ}} par les clés du payload (une profondeur : a.b non géré sauf clé plate). */
export function renderTemplate(str, payload) {
  if (str == null) return "";
  return String(str).replace(/\{\{([\w]+)\}\}/g, (_, key) => {
    const v = payload?.[key];
    return v !== undefined && v !== null ? String(v) : "";
  });
}

async function executeAction(action, payload) {
  if (action.type === "platform_notify") {
    await dataRepository.platformNotifications.create({
      title: renderTemplate(action.title, payload),
      body: renderTemplate(action.body_template, payload),
      target_roles: Array.isArray(action.target_roles) ? action.target_roles : [],
      category: "workflow",
      read: false,
    });
    return;
  }

  if (action.type === "update_operation_field" && payload.operation_id && action.field) {
    await dataRepository.operations.update(payload.operation_id, {
      [action.field]: action.value,
    });
  }
}

/**
 * @param {string} trigger ex. operation.created
 * @param {Record<string, string|number|undefined>} payload contexte pour les templates
 */
export async function processWorkflowTrigger(trigger, payload = {}) {
  const rules = await dataRepository.workflowRules.list();
  for (const rule of rules) {
    if (rule.enabled === false) continue;
    if (rule.trigger !== trigger) continue;

    let actions = rule.actions;
    if (typeof actions === "string") {
      try {
        actions = JSON.parse(actions);
      } catch {
        actions = [];
      }
    }
    if (!Array.isArray(actions)) continue;

    for (const action of actions) {
      await executeAction(action, payload);
    }
  }
}

/**
 * Export / import JSON pour écran Admin futur — aujourd’hui utilitaire console / tests.
 */
export function serializeRulesForConfig(rules) {
  return JSON.stringify(rules, null, 2);
}
