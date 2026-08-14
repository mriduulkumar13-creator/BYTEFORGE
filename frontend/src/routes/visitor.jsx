import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, MapPin } from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { Badge, Meter, SectionHeading, Surface } from "@/components/ui/primitives";
import { GetTokenPanel } from "@/components/queues/GetTokenPanel";
import { TokenTicket } from "@/components/queues/TokenTicket";
import { EmptyState, Resource } from "@/components/ui/states";
import { useApp } from "@/context/AppProvider";
import { useResource } from "@/hooks/useResource";
import { byteforgeService } from "@/services/byteforge-service";

export const Route = createFileRoute("/visitor")({
  head: () => ({
    meta: [
      { title: "My visit — BYTEFORGE" },
      { name: "description", content: "Track your place in line and your estimated waiting time." },
      { property: "og:title", content: "My visit — BYTEFORGE" },
      {
        property: "og:description",
        content: "Track your place in line and your estimated waiting time.",
      },
    ],
  }),
  component: VisitorRoute,
});

const stateTone = { waiting: "brand", called: "healthy", served: "neutral" };

function VisitorRoute() {
  return (
    <AppShell>
      <Visitor />
    </AppShell>
  );
}

function Visitor() {
  const { scenarioId, scenario } = useApp();
  const state = useResource(() => byteforgeService.getTickets(scenarioId), [scenarioId]);
  const [issued, setIssued] = useState([]);

  return (
    <>
      <PageHeader
        title="My visit"
        description={`${scenario.name} · your tickets and live estimates`}
      />

      <section className="mb-8">
        <SectionHeading
          title="Join a queue"
          description="Pick a service point and get a token — no paperwork, no crowding."
        />
        <GetTokenPanel onTokenIssued={(token) => setIssued((prev) => [token, ...prev])} />
      </section>

      {issued.length > 0 ? (
        <section className="mb-8">
          <SectionHeading title="Tokens issued now" />
          <div className="grid gap-4 sm:grid-cols-2">
            {issued.map((token) => (
              <TokenTicket key={token.tokenId} token={token} />
            ))}
          </div>
        </section>
      ) : null}

      <Resource

        state={state}
        emptyProps={{
          title: "No active tickets",
          description: "Scan a kiosk QR code to join a queue and track your wait here.",
        }}
      >
        {(tickets) => {
          const active = tickets.filter((t) => t.state !== "served");
          const history = tickets.filter((t) => t.state === "served");
          return (
            <div className="space-y-8">
              <section>
                <SectionHeading title="Active tickets" />
                {active.length === 0 ? (
                  <EmptyState title="Nothing in progress" description="You are all done for today." />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {active.map((ticket) => (
                      <Surface key={ticket.id} className="p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-display text-3xl font-semibold tracking-tight">
                              {ticket.id}
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" /> {ticket.label}
                            </p>
                          </div>
                          <Badge tone={stateTone[ticket.state]}>{ticket.state}</Badge>
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">People ahead</p>
                            <p className="mt-1 text-2xl font-semibold">{ticket.position}</p>
                          </div>
                          <div>
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" /> Estimated wait
                            </p>
                            <p className="mt-1 text-2xl font-semibold">
                              {ticket.etaMin}
                              <span className="ml-1 text-xs font-normal text-muted-foreground">
                                min
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="mt-5">
                          <Meter
                            value={Math.max(5, 100 - ticket.position * 8)}
                            tone={ticket.state === "called" ? "healthy" : "brand"}
                          />
                          <p className="mt-2 text-xs text-muted-foreground">
                            Issued at {ticket.issuedAt} · you'll be notified before your turn
                          </p>
                        </div>
                      </Surface>
                    ))}
                  </div>
                )}
              </section>

              {history.length > 0 ? (
                <section>
                  <SectionHeading title="Earlier today" />
                  <Surface className="divide-y divide-border">
                    {history.map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between gap-3 p-4">
                        <div>
                          <p className="text-sm font-medium">{ticket.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {ticket.id} · issued {ticket.issuedAt}
                          </p>
                        </div>
                        <Badge tone="neutral">completed</Badge>
                      </div>
                    ))}
                  </Surface>
                </section>
              ) : null}
            </div>
          );
        }}
      </Resource>
    </>
  );
}
