import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, RoleGate } from "@/components/layout/AppShell";
import { Meter, SectionHeading, Surface } from "@/components/ui/primitives";
import { Resource } from "@/components/ui/states";
import { useApp } from "@/context/AppProvider";
import { useResource } from "@/hooks/useResource";
import { byteforgeService } from "@/services/byteforge-service";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — BYTEFORGE" },
      { name: "description", content: "Demand curves, throughput and SLA adherence over the day." },
      { property: "og:title", content: "Analytics — BYTEFORGE" },
      {
        property: "og:description",
        content: "Demand curves, throughput and SLA adherence over the day.",
      },
    ],
  }),
  component: AnalyticsRoute,
});

function AnalyticsRoute() {
  return (
    <AppShell>
      <RoleGate allow={["admin"]}>
        <Analytics />
      </RoleGate>
    </AppShell>
  );
}

function Analytics() {
  const { scenarioId } = useApp();
  const state = useResource(() => byteforgeService.getAnalytics(scenarioId), [scenarioId]);

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Understand demand patterns and plan staffing with confidence."
      />
      <Resource state={state}>
        {(data) => {
          const maxServed = Math.max(...data.hourly.map((h) => h.served));
          return (
            <div className="space-y-8">
              <section>
                <SectionHeading title="Throughput by hour" description="Visitors served per hour." />
                <Surface className="p-5">
                  <div className="flex h-56 items-end gap-2">
                    {data.hourly.map((point) => (
                      <div key={point.hour} className="flex flex-1 flex-col items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">{point.served}</span>
                        <div
                          className="w-full rounded-t-lg bg-primary/75"
                          style={{ height: `${(point.served / maxServed) * 100}%` }}
                        />
                        <span className="text-[10px] text-muted-foreground">{point.hour}</span>
                      </div>
                    ))}
                  </div>
                </Surface>
              </section>

              <section>
                <SectionHeading title="Wait vs target" description="Average wait against SLA per service point." />
                <Surface className="space-y-4 p-5">
                  {data.byQueue.map((row) => (
                    <div key={row.name}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{row.name}</span>
                        <span className="text-muted-foreground">
                          {row.wait} min · target {row.target}
                        </span>
                      </div>
                      <div className="mt-2">
                        <Meter
                          value={row.wait}
                          max={Math.max(row.target * 1.6, row.wait)}
                          tone={row.wait > row.target ? "critical" : "healthy"}
                        />
                      </div>
                    </div>
                  ))}
                </Surface>
              </section>

              <section>
                <SectionHeading title="Visit outcomes" />
                <div className="grid gap-4 sm:grid-cols-3">
                  {data.retention.map((item) => (
                    <Surface key={item.label} className="p-5">
                      <p className="text-3xl font-semibold tracking-tight">{item.value}%</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
                    </Surface>
                  ))}
                </div>
              </section>
            </div>
          );
        }}
      </Resource>
    </>
  );
}
