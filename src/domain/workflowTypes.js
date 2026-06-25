/**
 * Types métier (documentation / JSDoc) — moteur de workflow et notifications.
 * @typedef {'operation.created'|'document.validated'|'delay.detected'|'vehicle.inactive'} WorkflowTrigger
 * @typedef {{ type: 'platform_notify', target_roles: string[], title: string, body_template: string }} PlatformNotifyAction
 * @typedef {{ type: 'update_operation_field', field: string, value: unknown }} UpdateOperationAction
 */

export {};
