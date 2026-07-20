import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { trackingTick } from "@/services/tracking/trackingService";

/**
 * Boucle client : simule des points GPS et maintient les véhicules à jour dans le store local.
 */
export function useTrackingSimulation(enabled) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return undefined;

    const run = async () => {
      try {
        await trackingTick();
        await queryClient.invalidateQueries({ queryKey: ["vehicles"] });
        await queryClient.invalidateQueries({ queryKey: ["operations"] });
        await queryClient.invalidateQueries({ queryKey: ["liveFleet"] });
      } catch (e) {
        console.error("[tracking]", e);
      }
    };

    const id = setInterval(run, 4500);
    run();
    return () => clearInterval(id);
  }, [enabled, queryClient]);
}
