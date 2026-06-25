import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { scanHighRiskDelaysAndNotify } from "@/services/ai/aiInsightsService";

/** Analyse périodique des retards prédits → notifications workflow (évite le spam via cache interne au service). */
export function useSmartAlerts(enabled) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return undefined;

    const tick = () => {
      scanHighRiskDelaysAndNotify().then(() => {
        queryClient.invalidateQueries({ queryKey: ["platformNotifications"] });
      });
    };

    const id = setInterval(tick, 60000);
    tick();
    return () => clearInterval(id);
  }, [enabled, queryClient]);
}
