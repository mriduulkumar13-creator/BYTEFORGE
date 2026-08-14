import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Gauge, LineChart, Lock, ShieldCheck, Users } from "lucide-react";
import { Badge, Button, Surface } from "@/components/ui/primitives";
import { useApp } from "@/context/AppProvider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BYTEFORGE — Calm queues for busy facilities" },
      {
        name: "description",
        content:
          "BYTEFORGE optimizes queues, crowd flow and service experience for hospitals, campuses, government centres and venues — using anonymised counts only.",
      },
      { property: "og:title", content: "BYTEFORGE — Calm queues for busy facilities" },
      {
        property: "og:description",
        content: "Live queue intelligence, crowd balance and SLA alerts without surveillance.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Gauge,
    title: "Live queue intelligence",
    body: "Wait times, counter load and SLA breaches across every service point, refreshed continuously.",
  },
  {
    icon: Users,
    title: "Crowd & zone balance",
    body: "Occupancy per zone with capacity thresholds so staff can redirect flow before pressure builds.",
  },
  {
    icon: LineChart,
    title: "Operational analytics",
    body: "Hourly demand curves, service throughput and target adherence for planning shifts.",
  },
  {
    icon: Lock,
    title: "Privacy by design",
    body: "Aggregated counts only. No facial recognition, no personal identifiers, no tracking of individuals.",
  },
];

function Landing() {
  const { setRole, setScenarioId } = useApp();

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">BYTEFORGE</span>
        </div>
        <Link to="/dashboard">
          <Button size="sm">Open console</Button>
        </Link>
      </header>

      <section className="hero-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <Badge tone="brand">
            <Activity className="h-3.5 w-3.5" /> Queue · Crowd · Service experience
          </Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Calm, predictable service for every person who walks in.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            BYTEFORGE gives hospitals, university campuses, government service centres, venues and
            retail teams a single operations console for waiting times, crowd density and staffing —
            built on anonymised measurements.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/dashboard" onClick={() => setScenarioId("hospital")}>
              <Button size="lg">Hospital demo</Button>
            </Link>
            <Link to="/dashboard" onClick={() => setScenarioId("campus")}>
              <Button size="lg" variant="outline">
                Campus demo
              </Button>
            </Link>
            <Link to="/visitor" onClick={() => setRole("visitor")}>
              <Button size="lg" variant="ghost">
                I'm a visitor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <Surface key={title} className="p-5">
              <Icon className="h-5 w-5 text-primary" aria-hidden />
              <h2 className="mt-4 text-base font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </Surface>
          ))}
        </div>

        <Surface className="mt-10 grid gap-6 p-8 sm:grid-cols-3">
          {[
            ["-34%", "average waiting time in pilot departments"],
            ["3 roles", "visitor, staff and admin workspaces out of the box"],
            ["0", "personal identifiers stored"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-3xl font-semibold text-primary">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </Surface>
      </section>
    </div>
  );
}
