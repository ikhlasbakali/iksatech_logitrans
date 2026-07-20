/**
 * OCR / extraction simulée — en production : appel service AWS Textract, Google Vision, etc.
 */

function hashString(s) {
  let h = 0;
  const str = String(s || "");
  for (let i = 0; i < str.length; i += 1) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function mockExtractMetadata(fileName) {
  const name = String(fileName || "");
  const ref = name.match(/OP-\d{4}-\d+/i)?.[0] ?? null;
  let detected_type = "other";
  if (/\bnota\b|reservation|booking/i.test(name)) detected_type = "nota";
  else if (/cmr/i.test(name)) detected_type = "cmr";
  else if (/chargement|decharg|loading|unload/i.test(name)) detected_type = "loading_sheet";
  else if (/\bmrn\b|movement.ref/i.test(name)) detected_type = "mrn";
  else if (/\bt1\b|transit.*douan/i.test(name)) detected_type = "t1";
  else if (/salida/i.test(name)) detected_type = "salida";
  else if (/eur[\s_-]?1|certificat.*origine/i.test(name)) detected_type = "eur1";
  else if (/\bmlv\b|bon.*livraison|proof.*deliver/i.test(name)) detected_type = "mlv";
  else if (/facture|invoice|commercial/i.test(name)) detected_type = "commercial_invoice";
  else if (/bl|livraison|waybill/i.test(name)) detected_type = "bl";
  else if (/pod|preuve/i.test(name)) detected_type = "pod";

  const h = hashString(name.toLowerCase());
  const confidence = Math.round((0.72 + (h % 19) / 100) * 100) / 100;

  return {
    file_name: name,
    detected_type,
    confidence: Math.min(0.92, confidence),
    reference_guess: ref,
    hints: ref ? [`Référence dossier probable : ${ref}`] : ["Aucune référence OP- détectée dans le nom"],
  };
}

export function suggestOperationFromExtract(fileName, operations) {
  const { reference_guess } = mockExtractMetadata(fileName);
  if (!reference_guess) return { operation: null, reason: "Pas de correspondance auto" };
  const op = operations.find((o) => o.reference === reference_guess);
  return op
    ? { operation: op, reason: `Rattaché via motif ${reference_guess}` }
    : { operation: null, reason: `Référence ${reference_guess} sans opération en base` };
}
