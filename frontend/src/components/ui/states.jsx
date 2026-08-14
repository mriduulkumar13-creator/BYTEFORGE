import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import { Button, Surface } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-xl bg-muted", className)} />;
}

export function LoadingState({ rows = 3, label = "Loading data" }) {
  return (
    <div className="space-y-3" role="status" aria-label={label}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <Surface className="flex flex-col items-center gap-3 p-10 text-center">
      <AlertTriangle className="h-7 w-7 text-destructive" aria-hidden />
      <div>
        <h3 className="text-base font-semibold">We couldn't load this</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {error?.message ?? "Something went wrong. Please try again."}
        </p>
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      ) : null}
    </Surface>
  );
}

export function EmptyState({ title = "Nothing here yet", description, action }) {
  return (
    <Surface className="flex flex-col items-center gap-3 p-10 text-center">
      <Inbox className="h-7 w-7 text-muted-foreground" aria-hidden />
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </Surface>
  );
}

/** Uniform renderer for the useResource contract. */
export function Resource({ state, children, loading, empty, emptyProps }) {
  if (state.status === "loading") return loading ?? <LoadingState />;
  if (state.status === "error") return <ErrorState error={state.error} onRetry={state.reload} />;
  if (state.status === "empty") return empty ?? <EmptyState {...emptyProps} />;
  return children(state.data);
}
