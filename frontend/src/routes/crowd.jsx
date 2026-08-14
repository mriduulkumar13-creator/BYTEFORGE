import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, RoleGate } from "@/components/layout/AppShell";
import { Badge, Meter, Surface } from "@/components/ui/primitives";
import { Resource } from "@/components/ui/states";
import { useApp } from "@/context/AppProvider";
import { useResource } from "@/hooks/useResource";
import { byteforgeService } from "@/services/byteforge-service";

export const Route = createFileRoute("/crowd")({
  head: () => ({
    meta: [
      { title: "Crowd & zones — BYTEFORGE" },
      { name: "description", content: "Anonymous occupancy per zone with capacity thresholds." },
      { property: "og:title", content: "Crowd & zones — BYTEFORGE" },
      {
        property: "og:description",
        content: "Anonymous occupancy per zone with capacity thresholds.",
      },
    ],
  }),
  component: CrowdRoute,
});

const densityTone = { low: "healthy", moderate: "warning", high: "critical" };

function CrowdRoute() {
  return (
    <AppShell>
      <RoleGate allow={["staff", "admin"]}>
        <Crowd />
      </RoleGate>
    </AppShell>
  );
}

function Crowd() {
  const { scenarioId } = useApp();
  const state = useResource(() => byteforgeService.getZones(scenarioId), [scenarioId]);

  return (
    <>
      <PageHeader
        title="Crowd & zones"
        description="Occupancy is derived from anonymised sensor counts — never from identifying individuals."
      />
      <Resource state={state}>
        {(zones) => (
          <div className="grid gap-4 sm:grid-cols-2">
            {zones.map((zone) => {
              const pct = Math.round((zone.occupancy / zone.capacity) * 100);
              return (
                <Surface key={zone.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold">{zone.name}</h2>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {zone.occupancy} of {zone.capacity} capacity
                      </p>
                    </div>
                    <Badge tone={densityTone[zone.density]}>{zone.density} density</Badge>
                  </div>
                  <p className="mt-4 text-3xl font-semibold tracking-tight">{pct}%</p>
                  <div className="mt-3">
                    <Meter value={pct} tone={densityTone[zone.density] ?? "brand"} />
                  </div>
                </Surface>
              );
            })}
          </div>
        )}
      </Resource>
    </>
  );
}
