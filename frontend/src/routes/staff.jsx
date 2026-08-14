import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell, PageHeader, RoleGate } from "@/components/layout/AppShell";
import { Badge, Button, Surface } from "@/components/ui/primitives";
import { Resource } from "@/components/ui/states";
import { useApp } from "@/context/AppProvider";
import { useResource } from "@/hooks/useResource";
import { byteforgeService } from "@/services/byteforge-service";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Team — BYTEFORGE" },
      { name: "description", content: "Desk assignments, availability and service volume by team member." },
      { property: "og:title", content: "Team — BYTEFORGE" },
      {
        property: "og:description",
        content: "Desk assignments, availability and service volume by team member.",
      },
    ],
  }),
  component: StaffRoute,
});

const statusTone = { active: "healthy", break: "warning", offline: "neutral" };

function StaffRoute() {
  return (
    <AppShell>
      <RoleGate allow={["staff", "admin"]}>
        <Team />
      </RoleGate>
    </AppShell>
  );
}

function Team() {
  const { scenarioId, role } = useApp();
  const state = useResource(() => byteforgeService.getStaff(scenarioId), [scenarioId]);

  return (
    <>
      <PageHeader title="Team" description="Who is serving where, right now." />
      <Resource state={state}>
        {(staff) => (
          <Surface className="divide-y divide-border overflow-hidden">
            {staff.map((person) => (
              <div key={person.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-muted text-sm font-semibold">
                  {person.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{person.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {person.role} · {person.desk}
                  </p>
                </div>
                <Badge tone={statusTone[person.status]}>{person.status}</Badge>
                <span className="text-sm text-muted-foreground">{person.servedToday} served</span>
                {role === "admin" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success(`Reassignment request sent for ${person.name}`)}
                  >
                    Reassign
                  </Button>
                ) : null}
              </div>
            ))}
          </Surface>
        )}
      </Resource>
    </>
  );
}
