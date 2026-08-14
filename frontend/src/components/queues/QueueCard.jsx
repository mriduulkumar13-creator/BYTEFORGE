import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock, Users } from "lucide-react";
import { Badge, Meter, Sparkline, Surface } from "@/components/ui/primitives";

const statusTone = { healthy: "healthy", warning: "warning", critical: "critical" };
const statusLabel = { healthy: "Within target", warning: "Watch", critical: "Over SLA" };

export function QueueCard({ queue }) {
  return (
    <Surface className="p-5 transition-shadow hover:shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{queue.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{queue.zone}</p>
        </div>
        <Badge tone={statusTone[queue.status]}>{statusLabel[queue.status]}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" /> Waiting
          </p>
          <p className="mt-1 text-xl font-semibold">{queue.waiting}</p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> Avg wait
          </p>
          <p className="mt-1 text-xl font-semibold">
            {queue.avgWaitMin}
            <span className="ml-1 text-xs font-normal text-muted-foreground">min</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Counters</p>
          <p className="mt-1 text-xl font-semibold">
            {queue.serving}
            <span className="text-xs font-normal text-muted-foreground">/{queue.counters}</span>
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Sparkline points={queue.trend} />
        <Meter
          value={queue.avgWaitMin}
          max={Math.max(queue.slaMin * 1.6, queue.avgWaitMin)}
          tone={queue.status === "healthy" ? "healthy" : queue.status}
        />
        <p className="mt-2 text-xs text-muted-foreground">Target {queue.slaMin} min</p>
      </div>

      <Link
        to="/queues/$queueId"
        params={{ queueId: queue.id }}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        Open queue <ArrowUpRight className="h-4 w-4" />
      </Link>
    </Surface>
  );
}
