import { toast } from "sonner";

/**
 * Ouvre ou télécharge un document selon son URL (démo locale vs URL réelle).
 * @param {{ file_url?: string, name?: string }} doc
 * @param {'preview' | 'download'} mode
 */
export function openDocumentFile(doc, mode = "preview") {
  const url = doc?.file_url;
  if (!url || typeof url !== "string") {
    toast.error("Aucun fichier associé à ce document.");
    return;
  }

  if (url.startsWith("local-upload://")) {
    const rawName = url.slice("local-upload://".length);
    let label = doc?.name || "document";
    try {
      label = decodeURIComponent(rawName) || label;
    } catch {
      // ignore
    }
    toast.message("Fichier non conservé en local (trop volumineux)", {
      description: `« ${label} » — en démo, seuls les fichiers sous environ 450 Ko sont enregistrés en entier. Réduisez la taille ou branchez un stockage cloud.`,
    });
    return;
  }

  if (url.startsWith("data:")) {
    if (mode === "preview") {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = doc?.name || "document";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  }

  try {
    if (mode === "preview") {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = doc?.name || "document";
    a.rel = "noopener noreferrer";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch {
    toast.error("Impossible d’ouvrir le fichier.");
  }
}
