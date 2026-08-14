/**
 * Mock domain data for BYTEFORGE.
 * This is the ONLY place raw fixtures live. Services read from here today and
 * will read from HTTP tomorrow — components never import this file directly.
 */

export const SCENARIOS = [
  {
    id: "hospital",
    name: "St. Meridian Hospital",
    kind: "Healthcare",
    location: "Block A – Outpatient Wing",
    description: "Outpatient departments, diagnostics and pharmacy pickup.",
  },
  {
    id: "campus",
    name: "Northvale University",
    kind: "Education",
    location: "Central Campus – Student Services",
    description: "Registrar, financial aid, ID desk and advising centre.",
  },
];

const hospitalQueues = [
  {
    id: "hq-triage",
    name: "Triage & Registration",
    zone: "Ground Floor",
    waiting: 14,
    serving: 3,
    avgWaitMin: 12,
    slaMin: 15,
    counters: 4,
    status: "healthy",
    trend: [8, 10, 9, 12, 14, 13, 12],
  },
  {
    id: "hq-radiology",
    name: "Radiology / Imaging",
    zone: "Level 2",
    waiting: 31,
    serving: 2,
    avgWaitMin: 38,
    slaMin: 25,
    counters: 2,
    status: "critical",
    trend: [20, 24, 27, 30, 34, 37, 38],
  },
  {
    id: "hq-pharmacy",
    name: "Pharmacy Pickup",
    zone: "Ground Floor",
    waiting: 9,
    serving: 4,
    avgWaitMin: 7,
    slaMin: 10,
    counters: 5,
    status: "healthy",
    trend: [6, 7, 9, 8, 7, 7, 7],
  },
  {
    id: "hq-labs",
    name: "Phlebotomy / Labs",
    zone: "Level 1",
    waiting: 22,
    serving: 3,
    avgWaitMin: 21,
    slaMin: 20,
    counters: 3,
    status: "warning",
    trend: [12, 15, 18, 19, 20, 21, 21],
  },
];

const campusQueues = [
  {
    id: "cq-registrar",
    name: "Registrar Desk",
    zone: "Admin Hall",
    waiting: 26,
    serving: 3,
    avgWaitMin: 29,
    slaMin: 20,
    counters: 3,
    status: "critical",
    trend: [14, 18, 21, 24, 26, 28, 29],
  },
  {
    id: "cq-finaid",
    name: "Financial Aid",
    zone: "Admin Hall",
    waiting: 11,
    serving: 2,
    avgWaitMin: 16,
    slaMin: 20,
    counters: 2,
    status: "healthy",
    trend: [18, 17, 16, 15, 16, 16, 16],
  },
  {
    id: "cq-idcard",
    name: "ID Card & Access",
    zone: "Student Centre",
    waiting: 6,
    serving: 2,
    avgWaitMin: 8,
    slaMin: 10,
    counters: 2,
    status: "healthy",
    trend: [10, 9, 8, 7, 8, 8, 8],
  },
  {
    id: "cq-advising",
    name: "Academic Advising",
    zone: "Faculty Wing",
    waiting: 18,
    serving: 4,
    avgWaitMin: 23,
    slaMin: 25,
    counters: 4,
    status: "warning",
    trend: [26, 25, 24, 23, 22, 23, 23],
  },
];

const hospitalZones = [
  { id: "hz-lobby", name: "Main Lobby", occupancy: 182, capacity: 240, density: "moderate" },
  { id: "hz-imaging", name: "Imaging Waiting", occupancy: 74, capacity: 80, density: "high" },
  { id: "hz-pharmacy", name: "Pharmacy Hall", occupancy: 41, capacity: 120, density: "low" },
  { id: "hz-cafe", name: "Cafeteria", occupancy: 96, capacity: 150, density: "moderate" },
];

const campusZones = [
  { id: "cz-admin", name: "Admin Hall", occupancy: 210, capacity: 250, density: "high" },
  { id: "cz-library", name: "Library Atrium", occupancy: 130, capacity: 400, density: "low" },
  { id: "cz-centre", name: "Student Centre", occupancy: 188, capacity: 300, density: "moderate" },
  { id: "cz-dining", name: "Dining Commons", occupancy: 262, capacity: 320, density: "high" },
];

const hospitalTickets = [
  { id: "A-104", queueId: "hq-radiology", label: "Radiology / Imaging", position: 7, etaMin: 34, issuedAt: "09:42", state: "waiting" },
  { id: "A-098", queueId: "hq-labs", label: "Phlebotomy / Labs", position: 2, etaMin: 6, issuedAt: "09:20", state: "called" },
  { id: "A-071", queueId: "hq-pharmacy", label: "Pharmacy Pickup", position: 0, etaMin: 0, issuedAt: "08:55", state: "served" },
];

const campusTickets = [
  { id: "R-231", queueId: "cq-registrar", label: "Registrar Desk", position: 11, etaMin: 42, issuedAt: "11:05", state: "waiting" },
  { id: "F-118", queueId: "cq-finaid", label: "Financial Aid", position: 3, etaMin: 12, issuedAt: "11:18", state: "waiting" },
  { id: "I-045", queueId: "cq-idcard", label: "ID Card & Access", position: 0, etaMin: 0, issuedAt: "10:12", state: "served" },
];

const hospitalStaff = [
  { id: "s1", name: "Dr. Amara Osei", role: "Clinician", desk: "Triage 2", status: "active", servedToday: 27 },
  { id: "s2", name: "Liam Chen", role: "Radiology Tech", desk: "Imaging 1", status: "active", servedToday: 19 },
  { id: "s3", name: "Priya Nair", role: "Pharmacist", desk: "Pharmacy 3", status: "break", servedToday: 44 },
  { id: "s4", name: "Marcus Vale", role: "Front Desk", desk: "Registration", status: "active", servedToday: 51 },
];

const campusStaff = [
  { id: "s1", name: "Elena Ruiz", role: "Registrar Officer", desk: "Window 1", status: "active", servedToday: 33 },
  { id: "s2", name: "Tobi Adeyemi", role: "Aid Counsellor", desk: "Window 4", status: "active", servedToday: 21 },
  { id: "s3", name: "Hana Suzuki", role: "ID Services", desk: "Kiosk B", status: "offline", servedToday: 12 },
  { id: "s4", name: "Owen Blake", role: "Academic Advisor", desk: "Room 210", status: "active", servedToday: 16 },
];

const hospitalAlerts = [
  { id: "al1", severity: "critical", title: "Imaging wait exceeds SLA", detail: "38 min average vs 25 min target. Consider opening counter 3.", at: "4 min ago" },
  { id: "al2", severity: "warning", title: "Lab queue trending up", detail: "Arrival rate up 18% over the last hour.", at: "16 min ago" },
  { id: "al3", severity: "info", title: "Pharmacy back within target", detail: "Average wait recovered to 7 minutes.", at: "38 min ago" },
];

const campusAlerts = [
  { id: "al1", severity: "critical", title: "Registrar backlog forming", detail: "26 students waiting; enrolment deadline peak.", at: "2 min ago" },
  { id: "al2", severity: "warning", title: "Dining Commons near capacity", detail: "262 / 320 occupancy at lunch peak.", at: "11 min ago" },
  { id: "al3", severity: "info", title: "Advising wait improving", detail: "Down 3 minutes after extra advisor joined.", at: "25 min ago" },
];

const hourly = (base) =>
  ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"].map((hour, i) => ({
    hour,
    wait: Math.max(4, Math.round(base + Math.sin(i / 1.6) * base * 0.45)),
    served: Math.round(30 + Math.cos(i / 2) * 14 + i * 3),
  }));

export const DATASETS = {
  hospital: {
    queues: hospitalQueues,
    zones: hospitalZones,
    tickets: hospitalTickets,
    staff: hospitalStaff,
    alerts: hospitalAlerts,
    hourly: hourly(18),
  },
  campus: {
    queues: campusQueues,
    zones: campusZones,
    tickets: campusTickets,
    staff: campusStaff,
    alerts: campusAlerts,
    hourly: hourly(22),
  },
};

export const ROLES = [
  { id: "visitor", label: "Visitor", blurb: "Track your place in line" },
  { id: "staff", label: "Staff", blurb: "Serve and manage counters" },
  { id: "admin", label: "Admin", blurb: "Configure and analyse operations" },
];

/* ---------------------------------------------------------------------------
 * Token issuing (mock)
 * Mirrors the future backend contract for POST /api/queues/{queueId}/join.
 * ------------------------------------------------------------------------ */

let tokenSequence = 41;

function tokenPrefix(queue) {
  const letters = queue.name
    .split(/[^A-Za-z]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  return letters || "Q";
}

function clockNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Issues a mock token for a queue and reflects the new arrival in the queue
 * fixture so the rest of the demo stays consistent.
 */
export function issueToken(queue) {
  tokenSequence += 1;
  queue.waiting += 1;

  const peopleAhead = Math.max(0, queue.waiting - 1);
  const perPerson = Math.max(1, queue.avgWaitMin / Math.max(1, queue.waiting));
  const etaMin = Math.max(1, Math.round(peopleAhead * perPerson) || queue.avgWaitMin);

  return {
    tokenId: `tk-${tokenSequence}`,
    tokenNumber: `${tokenPrefix(queue)}-${String(tokenSequence).padStart(3, "0")}`,
    queueId: queue.id,
    queueName: queue.name,
    zone: queue.zone,
    status: "waiting",
    position: queue.waiting,
    peopleAhead,
    etaMin,
    slaMin: queue.slaMin,
    issuedAt: clockNow(),
  };
}
