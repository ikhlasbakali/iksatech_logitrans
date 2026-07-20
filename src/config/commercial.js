/**
 * Paramètres « go-to-market » : à adapter au client final (marque blanche, support, conformité).
 * Toute l’application peut importer ces constantes pour rester cohérente.
 */

/** URL site vitrine / prise de contact (boutons login, footer). */
export const COMMERCIAL_WEB_URL = "https://docs.orionflow.invalid";

/** E-mail support affiché (remplacer par celui du déploiement client). */
export const COMMERCIAL_SUPPORT_EMAIL = "support@orionflow.invalid";

/** Phrase courte sous le manifeste / footer (FR + visibilité internationale). */
export const COMMERCIAL_EDITION_LABEL = "Enterprise — international logistics & fleet";

/**
 * Mention conformité / déploiement (affichée footer + écrans sensibles).
 * Cette édition navigateur : données en local jusqu’à branchement API.
 */
export const COMMERCIAL_DATA_NOTICE_FR =
  "Données en stockage local navigateur — connectez votre API et appliquez vos règles RGPD pour la production.";

export const COMMERCIAL_DATA_NOTICE_EN =
  "Browser-local storage in this build — connect your API and GDPR policies for production.";

/** URL politique confidentialité (optionnel). */
export const COMMERCIAL_PRIVACY_URL = `${COMMERCIAL_WEB_URL}/privacy`;

/** Fichier PDF neutre pour pièces jointes seed (hébergement public fiable). */
export const NEUTRAL_PDF_SAMPLE_URL =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
