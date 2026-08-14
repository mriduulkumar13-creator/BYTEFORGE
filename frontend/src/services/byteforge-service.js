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
    if (!USE_MOCK) return request("/scenarios");
    return mockResponse(() => SCENARIOS, { latency: 200 });
  },

  getOverview(scenarioId) {
    if (!USE_MOCK) return request(`/facilities/${scenarioId}/overview`);
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

  getQueues(scenarioId) {
    if (!USE_MOCK) return request(`/facilities/${scenarioId}/queues`);
    return mockResponse(() => dataset(scenarioId).queues);
  },

  getQueue(scenarioId, queueId) {
    if (!USE_MOCK) return request(`/facilities/${scenarioId}/queues/${queueId}`);
    return mockResponse(() => {
      const queue = dataset(scenarioId).queues.find((q) => q.id === queueId);
      if (!queue) throw new ApiError("Queue not found", 404);
      return { ...queue, hourly: dataset(scenarioId).hourly };
    });
  },

  /**
   * Join a queue and receive a token.
   * Backend contract (when ready): POST /api/queues/{queueId}/join
   *   body    -> { scenarioId, ...payload }
   *   returns -> { tokenId, tokenNumber, queueId, queueName, zone, status,
   *                position, peopleAhead, etaMin, slaMin, issuedAt }
   */
  joinQueue(scenarioId, queueId, payload = {}) {
    if (!USE_MOCK) {
      return request(`/api/queues/${queueId}/join`, {
        method: "POST",
        body: JSON.stringify({ scenarioId, ...payload }),
      });
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

  getZones(scenarioId) {
    if (!USE_MOCK) return request(`/facilities/${scenarioId}/zones`);
    return mockResponse(() => dataset(scenarioId).zones);
  },

  getStaff(scenarioId) {
    if (!USE_MOCK) return request(`/facilities/${scenarioId}/staff`);
    return mockResponse(() => dataset(scenarioId).staff);
  },

  getTickets(scenarioId) {
    if (!USE_MOCK) return request(`/facilities/${scenarioId}/tickets`);
    return mockResponse(() => dataset(scenarioId).tickets);
  },

  getAnalytics(scenarioId) {
    if (!USE_MOCK) return request(`/facilities/${scenarioId}/analytics`);
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
};
