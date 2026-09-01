import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, RoleGate } from "@/components/layout/AppShell";
import { QueueCard } from "@/components/queues/QueueCard";
import { Badge, SectionHeading, StatCard, Surface } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

function DynamicAIPrediction() {
  const [prediction, setPrediction] = useState(null);
  const [crowd, setCrowd] = useState(150);

  useEffect(() => {
    // Poll the AI service every 3 seconds for dynamic updates
    const fetchLiveCountAndPrediction = async () => {
      try {
        // Fetch live crowd count from AI service
        const countRes = await fetch("http://localhost:8000/live-count");
        if (countRes.ok) {
          const countData = await countRes.json();
          const currentCrowd = countData.live_head_count || 0;
          setCrowd(currentCrowd);
          
          // Fetch prediction based on live crowd
          const res = await byteforgeService.getPrediction(currentCrowd);
          setPrediction(res);
        }
      } catch (e) {
        console.error("AI Service Error:", e);
      }
    };
    
    fetchLiveCountAndPrediction();
    const interval = setInterval(fetchLiveCountAndPrediction, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Surface className="p-6 mb-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-indigo-400">✨ AI Dynamic Prediction Engine</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time ETAs powered by Machine Learning and Live Computer Vision
          </p>
          <div className="mt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-400">
                  <span className="mr-2 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                  View Live Camera
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] bg-black/95 border-indigo-500/30">
                <DialogHeader>
                  <DialogTitle className="flex items-center text-indigo-400">
                    <span className="mr-2 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                    Live AI Head Tracking
                  </DialogTitle>
                </DialogHeader>
                <div className="relative mt-2 overflow-hidden rounded-md border border-indigo-500/20 bg-black aspect-video flex items-center justify-center">
                  <img 
                    src="http://localhost:8000/video-feed" 
                    alt="Live AI Camera Feed" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex space-x-6 text-right">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Live Crowd Count</p>
            <p className="text-3xl font-bold font-mono">{crowd}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Est. Clearance Time</p>
            <p className="text-3xl font-bold font-mono text-indigo-400">
              {prediction ? `~${prediction.predicted_eta_minutes} mins` : "Loading..."}
            </p>
          </div>
        </div>
      </div>
    </Surface>
  );
}

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
      
      <DynamicAIPrediction />

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
