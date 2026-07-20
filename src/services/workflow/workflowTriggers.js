import { processWorkflowTrigger } from "@/services/workflow/workflowEngine";

/** Fire-and-forget côté UI pour ne pas bloquer les mutations React Query. */
export function dispatchWorkflowEvent(trigger, payload) {
  return processWorkflowTrigger(trigger, payload).catch((err) =>
    console.error("[workflow]", trigger, err)
  );
}
