import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, RoleGate } from "@/components/layout/AppShell";
import { QueueCard } from "@/components/queues/QueueCard";
import { Badge, SectionHeading, StatCard, Surface } from "@/components/ui/primitives";
import { LoadingState, Resource, Skeleton } from "@/components/ui/states";
import { useApp } from "@/context/AppProvider";
import { useResource } from "@/hooks/useResource";
import { byteforgeService } from "@/services/byteforge-service";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Operations dashboard — BYTEFORGE" },
      {
        name: "description",
        content: "Live waiting times, SLA breaches and crowd pressure across your facility.",
      },
      { property: "og:title", content: "Operations dashboard — BYTEFORGE" },
      {
        property: "og:description",
        content: "Live waiting times, SLA breaches and crowd pressure across your facility.",
      },
    ],
  }),
  component: DashboardRoute,
});

const severityTone = { critical: "critical", warning: "warning", info: "info" };

function DashboardRoute() {
  return (
    <AppShell>
      <RoleGate allow={["staff", "admin"]}>
        <Dashboard />
      </RoleGate>
    </AppShell>
  );
}

function Dashboard() {
  const { scenarioId, scenario } = useApp();
  const state = useResource(() => byteforgeService.getOverview(scenarioId), [scenarioId]);

  return (
    <>
      <PageHeader
        title="Operations dashboard"
        description={`${scenario.name} · ${scenario.description}`}
      />
      <Resource
        state={state}
        loading={
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <LoadingState rows={2} />
          </div>
        }
      >
        {(data) => (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.kpis.map((kpi) => (
                <StatCard key={kpi.id} {...kpi} />
              ))}
            </div>

            <section>
              <SectionHeading
                title="Service points"
                description="Ranked by pressure against their service-level target."
              />
              <div className="grid gap-4 md:grid-cols-2">
                {[...data.queues]
                  .sort((a, b) => b.avgWaitMin - b.slaMin - (a.avgWaitMin - a.slaMin))
                  .map((queue) => (
                    <QueueCard key={queue.id} queue={queue} />
                  ))}
              </div>
            </section>

            <section>
              <SectionHeading title="Alerts" description="Threshold events from the last hour." />
              <div className="space-y-3">
                {data.alerts.map((alert) => (
                  <Surface key={alert.id} className="flex flex-wrap items-center gap-3 p-4">
                    <Badge tone={severityTone[alert.severity]}>{alert.severity}</Badge>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.detail}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{alert.at}</span>
                  </Surface>
                ))}
              </div>
            </section>
          </div>
        )}
      </Resource>
    </>
  );
}
