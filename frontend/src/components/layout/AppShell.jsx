import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Moon, ShieldCheck, Sun, X } from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { navForRole } from "@/components/layout/nav-config";
import { Button, Surface } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
        <ShieldCheck className="h-5 w-5" aria-hidden />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">BYTEFORGE</span>
    </Link>
  );
}

function NavList({ onNavigate }) {
  const { role } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="space-y-1" aria-label="Primary">
      {navForRole(role).map(({ to, label, icon: Icon }) => {
        const active = pathname === to || pathname.startsWith(`${to}/`);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4.5 w-4.5" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Selectors({ compact = false }) {
  const { role, setRole, roles, scenarioId, setScenarioId, scenarios } = useApp();
  const selectClass =
    "h-9 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <div className={cn("grid gap-2", compact ? "grid-cols-1" : "sm:grid-cols-2")}>
      <label className="grid gap-1">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Facility</span>
        <select
          className={selectClass}
          value={scenarioId}
          onChange={(e) => setScenarioId(e.target.value)}
        >
          {scenarios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Role</span>
        <select className={selectClass} value={role} onChange={(e) => setRole(e.target.value)}>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useApp();
  return (
    <Button variant="outline" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
    </Button>
  );
}

export function AppShell({ children }) {
  const [open, setOpen] = useState(false);
  const { scenario, role, roles } = useApp();
  const roleMeta = roles.find((r) => r.id === role);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="hidden border-r border-sidebar-border bg-sidebar lg:flex lg:h-screen lg:flex-col lg:gap-6 lg:sticky lg:top-0 lg:p-5">
        <Brand />
        <NavList />
        <div className="mt-auto space-y-3">
          <Selectors compact />
          <Surface className="p-3">
            <p className="text-xs font-medium">{roleMeta?.label} view</p>
            <p className="mt-1 text-xs text-muted-foreground">{roleMeta?.blurb}</p>
          </Surface>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <button
              className="rounded-xl p-2 text-muted-foreground hover:bg-muted lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="lg:hidden">
              <Brand />
            </div>
            <div className="hidden min-w-0 lg:block">
              <p className="truncate text-sm font-semibold">{scenario.name}</p>
              <p className="truncate text-xs text-muted-foreground">{scenario.location}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden rounded-full bg-success/12 px-2.5 py-1 text-xs font-medium text-success sm:inline">
                Live · privacy-safe counts
              </span>
              <ThemeToggle />
            </div>
          </div>
          {open ? (
            <div className="space-y-4 border-t border-border/70 px-4 py-4 lg:hidden">
              <NavList onNavigate={() => setOpen(false)} />
              <Selectors />
            </div>
          ) : null}
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>

        <footer className="border-t border-border/70 px-4 py-5 text-xs text-muted-foreground sm:px-6">
          BYTEFORGE · Aggregated, anonymised measurements only. No facial recognition, no personal
          identifiers.
        </footer>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions}
    </div>
  );
}

export function RoleGate({ allow, children }) {
  const { role, setRole } = useApp();
  if (allow.includes(role)) return children;
  return (
    <Surface className="p-10 text-center">
      <h2 className="text-lg font-semibold">Restricted area</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        This workspace is available to {allow.join(" and ")} accounts. Switch role to preview it in
        the demo.
      </p>
      <Button className="mt-5" size="sm" onClick={() => setRole(allow[0])}>
        Switch to {allow[0]}
      </Button>
    </Surface>
  );
}
