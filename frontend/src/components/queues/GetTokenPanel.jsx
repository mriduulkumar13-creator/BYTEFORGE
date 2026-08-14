import { useState } from "react";
import { Loader2, Ticket } from "lucide-react";
import { toast } from "sonner";
import { Alert, Badge, Button, Modal, StatusDot, Surface } from "@/components/ui/primitives";
import { LoadingState, Resource } from "@/components/ui/states";
import { TokenTicket } from "@/components/queues/TokenTicket";
import { useApp } from "@/context/AppProvider";
import { useAction } from "@/hooks/useAction";
import { useResource } from "@/hooks/useResource";
import { byteforgeService } from "@/services/byteforge-service";

const statusTone = { healthy: "healthy", warning: "warning", critical: "critical" };
const statusLabel = { healthy: "Within target", warning: "Busy", critical: "Over SLA" };

/**
 * Visitor flow: pick a queue -> Get Token -> loading -> token generated -> token display.
 * All data goes through byteforgeService.joinQueue, which will later call
 * POST /api/queues/{queueId}/join without any change here.
 */
export function GetTokenPanel({ onTokenIssued }) {
  const { scenarioId } = useApp();
  const queues = useResource(() => byteforgeService.getQueues(scenarioId), [scenarioId]);
  const join = useAction((queueId) => byteforgeService.joinQueue(scenarioId, queueId));

  const [pendingId, setPendingId] = useState(null);

  async function handleGetToken(queue) {
    setPendingId(queue.id);
    const token = await join.run(queue.id);
    if (token) {
      toast.success(`Token ${token.tokenNumber} issued for ${token.queueName}`);
      onTokenIssued?.(token);
    }
  }

  return (
    <>
      <Resource
        state={queues}
        loading={<LoadingState rows={2} label="Loading queues" />}
        emptyProps={{
          title: "No queues open right now",
          description: "Check back shortly — service points open through the day.",
        }}
      >
        {(list) => (
          <div className="grid gap-4 md:grid-cols-2">
            {list.map((queue) => {
              const busy = join.status === "loading" && pendingId === queue.id;
              return (
                <Surface key={queue.id} className="flex flex-col gap-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold">{queue.name}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{queue.zone}</p>
                    </div>
                    <Badge tone={statusTone[queue.status]}>{statusLabel[queue.status]}</Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{queue.waiting}</span> waiting
                    </span>
                    <span className="text-muted-foreground">
                      ~<span className="font-semibold text-foreground">{queue.avgWaitMin}</span> min
                      wait
                    </span>
                    <StatusDot
                      tone={queue.status === "healthy" ? "healthy" : queue.status}
                      label={`${queue.serving}/${queue.counters} counters open`}
                      pulse={queue.status !== "healthy"}
                    />
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    disabled={join.status === "loading"}
                    onClick={() => handleGetToken(queue)}
                  >
                    {busy ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Generating token…
                      </>
                    ) : (
                      <>
                        <Ticket className="h-4 w-4" /> Get Token
                      </>
                    )}
                  </Button>
                </Surface>
              );
            })}
          </div>
        )}
      </Resource>

      <Modal
        open={join.status === "loading" || join.status === "success" || join.status === "error"}
        onClose={join.reset}
        title={
          join.status === "loading"
            ? "Generating your token"
            : join.status === "error"
              ? "Couldn't issue a token"
              : "Token generated"
        }
        description={
          join.status === "loading"
            ? "Reserving your place in line…"
            : join.status === "error"
              ? undefined
              : "You're in line. Track your position live below."
        }
        footer={
          join.status === "loading" ? (
            <span className="text-xs text-muted-foreground">Please wait…</span>
          ) : (
            <Button size="sm" onClick={join.reset}>
              Done
            </Button>
          )
        }
      >
        {join.status === "loading" ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Loading" />
          </div>
        ) : join.status === "error" ? (
          <Alert tone="critical" title="Something went wrong">
            {join.error?.message ?? "Please try again in a moment."}
          </Alert>
        ) : join.data ? (
          <TokenTicket token={join.data} className="p-5" />
        ) : null}
      </Modal>
    </>
  );
}
