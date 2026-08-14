import { cn } from "@/lib/utils";

export function Surface({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[var(--shadow-soft)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SectionHeading({ title, description, action }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

const toneMap = {
  neutral: "bg-muted text-muted-foreground",
  brand: "bg-primary/10 text-primary",
  healthy: "bg-success/12 text-success",
  warning: "bg-warning/15 text-warning",
  critical: "bg-destructive/12 text-destructive",
  info: "bg-accent/15 text-accent-foreground",
};

export function Badge({ tone = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        toneMap[tone] ?? toneMap.neutral,
        className,
      )}
    >
      {children}
    </span>
  );
}

const buttonTones = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "text-foreground hover:bg-muted",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted",
};

export function Button({ variant = "primary", size = "md", className, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
        size === "sm" ? "h-9 px-3 text-sm" : size === "lg" ? "h-12 px-6 text-base" : "h-10 px-4 text-sm",
        buttonTones[variant],
        className,
      )}
      {...props}
    />
  );
}

export function StatCard({ label, value, unit, delta, hint }) {
  const positive = typeof delta === "number" && delta > 0;
  return (
    <Surface className="p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-semibold tracking-tight">{value}</span>
        {unit ? <span className="text-sm text-muted-foreground">{unit}</span> : null}
      </div>
      {typeof delta === "number" ? (
        <p
          className={cn(
            "mt-2 text-xs font-medium",
            positive ? "text-warning" : "text-success",
          )}
        >
          {positive ? "▲" : "▼"} {Math.abs(delta)}% vs last hour
        </p>
      ) : null}
      {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
    </Surface>
  );
}

export function Meter({ value, max = 100, tone = "brand" }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const bar = {
    brand: "bg-primary",
    healthy: "bg-success",
    warning: "bg-warning",
    critical: "bg-destructive",
  }[tone];
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className={cn("h-full rounded-full transition-all", bar)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Sparkline({ points = [], tone = "primary" }) {
  if (points.length < 2) return null;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const d = points
    .map((p, i) => `${(i / (points.length - 1)) * 100},${28 - ((p - min) / span) * 24}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-8 w-full">
      <polyline
        points={d}
        fill="none"
        stroke={`var(--${tone})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
 * Form controls
 * ------------------------------------------------------------------------ */

const fieldBase =
  "w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring disabled:opacity-50";

export function Input({ className, ...props }) {
  return <input className={cn(fieldBase, "h-10", className)} {...props} />;
}

export function Textarea({ className, ...props }) {
  return <textarea className={cn(fieldBase, "min-h-24 py-2.5", className)} {...props} />;
}

export function Select({ className, children, ...props }) {
  return (
    <select className={cn(fieldBase, "h-10", className)} {...props}>
      {children}
    </select>
  );
}

export function Field({ label, hint, error, children, className }) {
  return (
    <label className={cn("grid gap-1.5", className)}>
      {label ? <span className="text-sm font-medium text-foreground">{label}</span> : null}
      {children}
      {error ? (
        <span className="text-xs font-medium text-destructive">{error}</span>
      ) : hint ? (
        <span className="text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}

/* ---------------------------------------------------------------------------
 * Alerts
 * ------------------------------------------------------------------------ */

const alertTones = {
  info: "border-primary/25 bg-primary/8 text-foreground",
  success: "border-success/30 bg-success/10 text-foreground",
  warning: "border-warning/35 bg-warning/12 text-foreground",
  critical: "border-destructive/30 bg-destructive/10 text-foreground",
};

const alertAccent = {
  info: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  critical: "bg-destructive",
};

export function Alert({ tone = "info", title, children, action, className }) {
  return (
    <div
      role="status"
      className={cn(
        "relative flex gap-3 overflow-hidden rounded-xl border px-4 py-3",
        alertTones[tone] ?? alertTones.info,
        className,
      )}
    >
      <span className={cn("absolute inset-y-0 left-0 w-1", alertAccent[tone])} aria-hidden />
      <div className="min-w-0 flex-1 pl-1">
        {title ? <p className="text-sm font-semibold">{title}</p> : null}
        {children ? <div className="mt-0.5 text-sm text-muted-foreground">{children}</div> : null}
      </div>
      {action}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Status indicator
 * ------------------------------------------------------------------------ */

const statusTones = {
  healthy: { dot: "bg-success", text: "text-success" },
  warning: { dot: "bg-warning", text: "text-warning" },
  critical: { dot: "bg-destructive", text: "text-destructive" },
  idle: { dot: "bg-muted-foreground", text: "text-muted-foreground" },
  brand: { dot: "bg-primary", text: "text-primary" },
};

export function StatusDot({ tone = "healthy", label, pulse = false, className }) {
  const t = statusTones[tone] ?? statusTones.healthy;
  return (
    <span className={cn("inline-flex items-center gap-2 text-xs font-medium", t.text, className)}>
      <span className="relative flex h-2 w-2">
        {pulse ? (
          <span
            className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", t.dot)}
            aria-hidden
          />
        ) : null}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", t.dot)} />
      </span>
      {label}
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * Modal
 * ------------------------------------------------------------------------ */

export function Modal({ open, onClose, title, description, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div
        className="absolute inset-0 bg-foreground/40"
        onClick={onClose}
        aria-hidden
      />
      <Surface
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 w-full max-w-lg p-6"
      >
        {title ? <h2 className="text-lg font-semibold tracking-tight">{title}</h2> : null}
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
        {children ? <div className="mt-4">{children}</div> : null}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          {footer ?? (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </Surface>
    </div>
  );
}
