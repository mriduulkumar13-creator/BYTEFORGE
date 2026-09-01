import { DATASETS, SCENARIOS, issueToken } from "@/lib/mock-data";
import { ApiError, USE_MOCK, mockResponse, request } from "@/services/http";

/**
 * Domain service API. Components and hooks only ever talk to these functions.
 * Each function has a mock branch and a real-HTTP branch.
 */

function dataset(scenarioId) {
  const data = DATASETS[scenarioId];
  if (!data) throw new ApiError(`Unknown facility "${scenarioId}"`, 404);
  return data;
}

export const byteforgeService = {
  getScenarios() {
    if (!USE_MOCK) return request("/facilities");
    return mockResponse(() => SCENARIOS, { latency: 200 });
  },

  async getOverview(scenarioId) {
    if (!USE_MOCK) {
      const rawQueues = await request("/queues").then(res => res.filter(q => q.facilityId === scenarioId)).catch(() => []);
      const rawZones = await request("/zones").then(res => res.filter(z => z.facilityId === scenarioId)).catch(() => []);
      const rawAlerts = await request("/alerts").then(res => res.filter(a => a.facilityId === scenarioId)).catch(() => []);

      const queues = rawQueues.map(q => {
        const wait = q.avgServiceTime || 0;
        const sla = q.slaMin || 15;
        let status = "healthy";
        if (wait > sla) status = "critical";
        else if (wait > sla * 0.75) status = "warning";

        return {
          ...q,
          waiting: q.peopleWaiting || 0,
          avgWaitMin: wait,
          serving: 1,
          counters: 1,
          trend: [10, 15, 12, 18, 14, wait, wait],
          zone: q.zoneId || "Zone",
          status: status
        };
      });

      const zones = rawZones.map(z => ({
        ...z,
        occupancy: z.occupancy || 0,
        capacity: z.capacity || 100,
        density: "moderate"
      }));

      const waiting = queues.reduce((sum, q) => sum + q.waiting, 0);
      const avgWait = queues.length > 0 ? Math.round(queues.reduce((sum, q) => sum + q.avgWaitMin, 0) / queues.length) : 0;
      const breaching = queues.filter((q) => q.avgWaitMin > q.slaMin).length;

      const totalOccupancy = zones.reduce((s, z) => s + z.occupancy, 0);
      const totalCapacity = zones.reduce((s, z) => s + z.capacity, 0);
      const occupancy = zones.length > 0 ? Math.round((totalOccupancy / Math.max(1, totalCapacity)) * 100) : 0;

      const queueIds = new Set(queues.map(q => q.id));
      const alerts = rawAlerts.filter(a => queueIds.has(a.queueId)).map(a => ({
        ...a,
        severity: (a.severity || "info").toLowerCase(),
        title: a.message || "Alert",
        detail: a.detail || "",
        at: a.createdAt || "just now"
      }));

      return {
        kpis: [
          { id: "waiting", label: "People waiting", value: waiting, unit: "", delta: 0 },
          { id: "wait", label: "Average wait", value: avgWait, unit: "min", delta: 0 },
          { id: "sla", label: "Queues over SLA", value: breaching, unit: `/ ${queues.length}`, delta: 0 },
          { id: "occupancy", label: "Facility occupancy", value: occupancy, unit: "%", delta: 0 },
        ],
        queues,
        alerts,
        hourly: [],
      };
    }
    return mockResponse(() => {
      const d = dataset(scenarioId);
      const waiting = d.queues.reduce((sum, q) => sum + q.waiting, 0);
      const avgWait = Math.round(
        d.queues.reduce((sum, q) => sum + q.avgWaitMin, 0) / d.queues.length,
      );
      const breaching = d.queues.filter((q) => q.avgWaitMin > q.slaMin).length;
      const occupancy = Math.round(
        (d.zones.reduce((s, z) => s + z.occupancy, 0) /
          d.zones.reduce((s, z) => s + z.capacity, 0)) *
        100,
      );
      return {
        kpis: [
          { id: "waiting", label: "People waiting", value: waiting, unit: "", delta: +6 },
          { id: "wait", label: "Average wait", value: avgWait, unit: "min", delta: -3 },
          { id: "sla", label: "Queues over SLA", value: breaching, unit: `/ ${d.queues.length}`, delta: breaching ? 1 : 0 },
          { id: "occupancy", label: "Facility occupancy", value: occupancy, unit: "%", delta: +4 },
        ],
        queues: d.queues,
        alerts: d.alerts,
        hourly: d.hourly,
      };
    });
  },

  async getQueues(scenarioId) {
    if (!USE_MOCK) {
      const qs = await request("/queues");
      return qs.filter(q => q.facilityId === scenarioId).map(q => {
        const wait = q.avgServiceTime || 0;
        const sla = q.slaMin || 15;
        let status = "healthy";
        if (wait > sla) status = "critical";
        else if (wait > sla * 0.75) status = "warning";
        return {
          ...q,
          waiting: q.peopleWaiting || 0,
          avgWaitMin: wait,
          serving: 1,
          counters: 1,
          trend: [10, 15, 12, 18, 14, wait, wait],
          zone: q.zoneId || "Zone",
          status: status
        };
      });
    }
    return mockResponse(() => dataset(scenarioId).queues);
  },

  getQueue(scenarioId, queueId) {
    if (!USE_MOCK) return request(`/queues/${queueId}`).then(q => {
      const wait = q.avgServiceTime || 0;
      const sla = q.slaMin || 15;
      let status = "healthy";
      if (wait > sla) status = "critical";
      else if (wait > sla * 0.75) status = "warning";
      return {
        ...q,
        waiting: q.peopleWaiting || 0,
        avgWaitMin: wait,
        serving: 1,
        counters: 1,
        trend: [10, 15, 12, 18, 14, wait, wait],
        zone: q.zoneId || "Zone",
        status: status,
        hourly: []
      };
    });
    return mockResponse(() => {
      const queue = dataset(scenarioId).queues.find((q) => q.id === queueId);
      if (!queue) throw new ApiError("Queue not found", 404);
      return { ...queue, hourly: dataset(scenarioId).hourly };
    });
  },

  joinQueue(scenarioId, queueId, payload = {}) {
    if (!USE_MOCK) {
      // Backend expects Ticket creation for joining a queue
      return request(`/tickets`, {
        method: "POST",
        body: JSON.stringify({ scenarioId, queueId, ...payload, issuedAt: new Date().toISOString() }),
      }).then(t => ({
        ...t,
        tokenId: t.id,
        tokenNumber: t.tokenNumber,
        queueName: t.label,
        position: t.position,
        etaMin: t.etaMin,
        state: t.state
      }));
    }
    return mockResponse(
      () => {
        const queue = dataset(scenarioId).queues.find((q) => q.id === queueId);
        if (!queue) throw new ApiError("Queue not found", 404);
        return issueToken(queue);
      },
      { latency: 900 },
    );
  },

  async getZones(scenarioId) {
    if (!USE_MOCK) {
      const res = await request("/zones");
      return res.filter(z => z.facilityId === scenarioId).map(z => ({
        ...z,
        occupancy: z.occupancy || 0,
        capacity: z.capacity || 100,
        density: "moderate"
      }));
    }
    return mockResponse(() => dataset(scenarioId).zones);
  },

  async getStaff(scenarioId) {
    if (!USE_MOCK) {
      const res = await request("/staff");
      return res.filter(s => s.facilityId === scenarioId).map(s => ({
        ...s,
        servedToday: s.servedToday || 0,
        status: s.status || "active"
      }));
    }
    return mockResponse(() => dataset(scenarioId).staff);
  },

  async getTickets(scenarioId) {
    if (!USE_MOCK) {
      const res = await request("/tickets");
      return res.filter(t => t.facilityId === scenarioId).map(t => ({
        ...t,
        label: t.label || t.id,
        position: t.position || 0,
        etaMin: t.etaMin || 0,
        issuedAt: t.issuedAt || "00:00",
        state: t.state || "waiting"
      }));
    }
    return mockResponse(() => dataset(scenarioId).tickets);
  },

  async getAnalytics(scenarioId) {
    if (!USE_MOCK) {
      return request("/analytics").catch(() => ({ hourly: [], byQueue: [], retention: [] }));
    }
    return mockResponse(() => {
      const d = dataset(scenarioId);
      return {
        hourly: d.hourly,
        byQueue: d.queues.map((q) => ({ name: q.name, wait: q.avgWaitMin, target: q.slaMin })),
        retention: [
          { label: "Served within SLA", value: 78 },
          { label: "Walk-aways", value: 6 },
          { label: "Rescheduled", value: 16 },
        ],
      };
    });
  },

  async getPrediction(currentCrowd) {
    if (!USE_MOCK) {
      return request(`/queues/prediction?currentCrowd=${currentCrowd}`);
    }
    return mockResponse(() => ({
      current_crowd: currentCrowd,
      predicted_eta_minutes: Math.round(currentCrowd / 4.2)
    }));
  }
};
