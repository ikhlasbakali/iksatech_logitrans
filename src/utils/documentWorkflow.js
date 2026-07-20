/**
 * Contrôle documentaire : qui peut valider / rejeter après dépôt.
 * Les rôles « back-office » valident ; chauffeur / client déposent en général en « en attente ».
 */

export const DOCUMENT_VALIDATOR_ROLES = [
  "admin",
  "manager",
  "exploitation_manager",
  "agent",
  "support",
];

/** @param {{ user_role?: string } | null | undefined} user */
export function canValidateDocuments(user) {
  return Boolean(user?.user_role && DOCUMENT_VALIDATOR_ROLES.includes(user.user_role));
}

export function validatorRolesLabelFr() {
  return "administrateur, manager exploitation, opérateur flux, support technique";
}
