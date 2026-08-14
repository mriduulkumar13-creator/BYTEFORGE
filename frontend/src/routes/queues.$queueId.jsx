import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader, RoleGate } from "@/components/layout/AppShell";
import { Badge, Button, Meter, SectionHeading, StatCard, Surface } from "@/components/ui/primitives";
import { Resource } from "@/components/ui/states";
import { useApp } from "@/context/AppProvider";
import { useResource } from "@/hooks/useResource";
import { byteforgeService } from "@/services/byteforge-service";

export const Route = createFileRoute("/queues/$queueId")({
  head: () => ({
    meta: [
      { title: "Queue detail — BYTEFORGE" },
      { name: "description", content: "Throughput, wait trend and counter actions for one queue." },
      { property: "og:title", content: "Queue detail — BYTEFORGE" },
      {
        property: "og:description",
        content: "Throughput, wait trend and counter actions for one queue.",
      },
    ],
  }),
  component: QueueDetailRoute,
});

function QueueDetailRoute() {
  return (
    <AppShell>
      <RoleGate allow={["staff", "admin"]}>
        <QueueDetail />
      </RoleGate>
    </AppShell>
  );
}

function QueueDetail() {
  const { queueId } = Route.useParams();
  const { scenarioId } = useApp();
  const state = useResource(
    () => byteforgeService.getQueue(scenarioId, queueId),
    [scenarioId, queueId],
  );

  return (
    <>
      <Link
        to="/queues"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All queues
      </Link>
      <Resource state={state}>
        {(queue) => (
          <>
            <PageHeader
              title={queue.name}
              description={`${queue.zone} · target ${queue.slaMin} minutes`}
              actions={
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => toast.success("Next visitor called")}>
                    Call next
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.info("Request sent to open an extra counter")}
                  >
                    Open counter
                  </Button>
                </div>
              }
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Waiting" value={queue.waiting} />
              <StatCard label="Average wait" value={queue.avgWaitMin} unit="min" />
              <StatCard label="Counters open" value={`${queue.serving}/${queue.counters}`} />
              <StatCard label="Status" value={queue.status === "healthy" ? "On target" : "At risk"} />
            </div>

            <section className="mt-8">
              <SectionHeading title="Today's wait curve" description="Average minutes per hour." />
              <Surface className="p-5">
                <div className="flex h-48 items-end gap-2">
                  {queue.hourly.map((point) => {
                    const max = Math.max(...queue.hourly.map((p) => p.wait));
                    return (
                      <div key={point.hour} className="flex flex-1 flex-col items-center gap-2">
                        <div
                          className="w-full rounded-t-lg bg-primary/80"
                          style={{ height: `${(point.wait / max) * 100}%` }}
                          title={`${point.wait} min`}
                        />
                        <span className="text-[10px] text-muted-foreground">{point.hour}</span>
                      </div>
                    );
                  })}
                </div>
              </Surface>
            </section>

            <section className="mt-8">
              <SectionHeading title="Load against target" />
              <Surface className="space-y-3 p-5">
                <div className="flex items-center justify-between text-sm">
                  <span>Current average</span>
                  <Badge tone={queue.status === "healthy" ? "healthy" : queue.status}>
                    {queue.avgWaitMin} min
                  </Badge>
                </div>
                <Meter
                  value={queue.avgWaitMin}
                  max={Math.max(queue.slaMin * 1.6, queue.avgWaitMin)}
                  tone={queue.status === "healthy" ? "healthy" : queue.status}
                />
                <p className="text-xs text-muted-foreground">
                  Service-level target is {queue.slaMin} minutes for this service point.
                </p>
              </Surface>
            </section>
          </>
        )}
      </Resource>
    </>
  );
}
