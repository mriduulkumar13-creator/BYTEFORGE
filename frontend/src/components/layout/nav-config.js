import {
  BarChart3,
  LayoutDashboard,
  ListOrdered,
  Settings,
  Ticket,
  Users,
  Map,
} from "lucide-react";

/** Single source of truth for navigation + role-based access. */
export const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["staff", "admin"] },
  { to: "/queues", label: "Queues", icon: ListOrdered, roles: ["staff", "admin"] },
  { to: "/crowd", label: "Crowd & Zones", icon: Map, roles: ["staff", "admin"] },
  { to: "/analytics", label: "Analytics", icon: BarChart3, roles: ["admin"] },
  { to: "/staff", label: "Team", icon: Users, roles: ["staff", "admin"] },
  { to: "/visitor", label: "My visit", icon: Ticket, roles: ["visitor", "staff", "admin"] },
  { to: "/admin", label: "Administration", icon: Settings, roles: ["admin"] },
];

export function navForRole(role) {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}

export function canAccess(role, path) {
  const item = NAV_ITEMS.find((i) => i.to === path);
  return !item || item.roles.includes(role);
}
