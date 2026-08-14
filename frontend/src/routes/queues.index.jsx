import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, RoleGate } from "@/components/layout/AppShell";
import { QueueCard } from "@/components/queues/QueueCard";
import { Button } from "@/components/ui/primitives";
import { EmptyState, Resource } from "@/components/ui/states";
import { useApp } from "@/context/AppProvider";
import { useResource } from "@/hooks/useResource";
import { byteforgeService } from "@/services/byteforge-service";

export const Route = createFileRoute("/queues/")({
  head: () => ({
    meta: [
      { title: "Queues — BYTEFORGE" },
      { name: "description", content: "Every service point, its waiting load and SLA status." },
      { property: "og:title", content: "Queues — BYTEFORGE" },
      {
        property: "og:description",
        content: "Every service point, its waiting load and SLA status.",
      },
    ],
  }),
  component: QueuesRoute,
});

const FILTERS = [
  { id: "all", label: "All" },
  { id: "critical", label: "Over SLA" },
  { id: "warning", label: "Watch" },
  { id: "healthy", label: "Healthy" },
];

function QueuesRoute() {
  return (
    <AppShell>
      <RoleGate allow={["staff", "admin"]}>
        <Queues />
      </RoleGate>
    </AppShell>
  );
}

function Queues() {
  const { scenarioId } = useApp();
  const [filter, setFilter] = useState("all");
  const state = useResource(() => byteforgeService.getQueues(scenarioId), [scenarioId]);

  return (
    <>
      <PageHeader
        title="Queues"
        description="Monitor load per service point and rebalance counters."
        actions={
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Button
                key={f.id}
                size="sm"
                variant={filter === f.id ? "primary" : "outline"}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </Button>
            ))}
          </div>
        }
      />
      <Resource state={state}>
        {(queues) => {
          const visible = queues.filter((q) => filter === "all" || q.status === filter);
          if (visible.length === 0) {
            return (
              <EmptyState
                title="No queues match this filter"
                description="Try a different status filter to see other service points."
                action={
                  <Button size="sm" variant="outline" onClick={() => setFilter("all")}>
                    Show all
                  </Button>
                }
              />
            );
          }
          return (
            <div className="grid gap-4 md:grid-cols-2">
              {visible.map((queue) => (
                <QueueCard key={queue.id} queue={queue} />
              ))}
            </div>
          );
        }}
      </Resource>
    </>
  );
}
