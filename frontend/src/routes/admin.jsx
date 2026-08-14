import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell, PageHeader, RoleGate } from "@/components/layout/AppShell";
import { Button, SectionHeading, Surface } from "@/components/ui/primitives";
import { Resource } from "@/components/ui/states";
import { useApp } from "@/context/AppProvider";
import { useResource } from "@/hooks/useResource";
import { byteforgeService } from "@/services/byteforge-service";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration — BYTEFORGE" },
      { name: "description", content: "Service-level targets, alerting thresholds and privacy controls." },
      { property: "og:title", content: "Administration — BYTEFORGE" },
      {
        property: "og:description",
        content: "Service-level targets, alerting thresholds and privacy controls.",
      },
    ],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  return (
    <AppShell>
      <RoleGate allow={["admin"]}>
        <Admin />
      </RoleGate>
    </AppShell>
  );
}

function Toggle({ label, description, defaultOn = true }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn((v) => !v)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all ${on ? "left-5.5" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

function Admin() {
  const { scenarioId, scenario } = useApp();
  const state = useResource(() => byteforgeService.getQueues(scenarioId), [scenarioId]);

  return (
    <>
      <PageHeader
        title="Administration"
        description={`Configuration for ${scenario.name}.`}
        actions={
          <Button size="sm" onClick={() => toast.success("Configuration saved")}>
            Save changes
          </Button>
        }
      />

      <div className="space-y-8">
        <section>
          <SectionHeading
            title="Service-level targets"
            description="Maximum acceptable average wait per service point."
          />
          <Resource state={state}>
            {(queues) => (
              <Surface className="divide-y divide-border">
                {queues.map((queue) => (
                  <div key={queue.id} className="flex flex-wrap items-center gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{queue.name}</p>
                      <p className="text-xs text-muted-foreground">{queue.zone}</p>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Target</span>
                      <input
                        type="number"
                        defaultValue={queue.slaMin}
                        min={1}
                        className="h-9 w-20 rounded-xl border border-border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <span className="text-muted-foreground">min</span>
                    </label>
                  </div>
                ))}
              </Surface>
            )}
          </Resource>
        </section>

        <section>
          <SectionHeading title="Alerting" description="When operations teams get notified." />
          <Surface className="divide-y divide-border px-5">
            <Toggle label="SLA breach alerts" description="Notify supervisors when a queue exceeds its target." />
            <Toggle label="Capacity alerts" description="Notify when a zone passes 85% of capacity." />
            <Toggle
              label="Daily digest"
              description="Email a summary of yesterday's performance."
              defaultOn={false}
            />
          </Surface>
        </section>

        <section>
          <SectionHeading title="Privacy controls" description="BYTEFORGE is aggregate-only by default." />
          <Surface className="divide-y divide-border px-5">
            <Toggle label="Anonymous counting only" description="Store counts, never identities or biometrics." />
            <Toggle label="Automatic data retention" description="Delete raw counts after 30 days." />
            <Toggle
              label="Share anonymised benchmarks"
              description="Contribute aggregate metrics to sector benchmarks."
              defaultOn={false}
            />
          </Surface>
        </section>
      </div>
    </>
  );
}
