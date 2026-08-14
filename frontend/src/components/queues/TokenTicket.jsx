import { Clock, MapPin, Users } from "lucide-react";
import { Badge, Meter, Surface } from "@/components/ui/primitives";

const statusTone = { waiting: "brand", called: "healthy", served: "neutral" };

/** Read-only display of an issued token. */
export function TokenTicket({ token, className }) {
  return (
    <Surface className={className ?? "p-6"}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Your token
          </p>
          <p className="mt-1 font-display text-4xl font-semibold tracking-tight text-primary">
            {token.tokenNumber}
          </p>
          <p className="mt-2 text-sm font-medium">{token.queueName}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {token.zone} · issued {token.issuedAt}
          </p>
        </div>
        <Badge tone={statusTone[token.status] ?? "neutral"}>{token.status}</Badge>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Position</p>
          <p className="mt-1 text-2xl font-semibold">{token.position}</p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" /> Ahead
          </p>
          <p className="mt-1 text-2xl font-semibold">{token.peopleAhead}</p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> Est. wait
          </p>
          <p className="mt-1 text-2xl font-semibold">
            {token.etaMin}
            <span className="ml-1 text-xs font-normal text-muted-foreground">min</span>
          </p>
        </div>
      </div>

      <div className="mt-5">
        <Meter
          value={Math.max(5, 100 - token.peopleAhead * 8)}
          tone={token.status === "called" ? "healthy" : "brand"}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Keep this token number handy — you'll be notified before your turn.
        </p>
      </div>
    </Surface>
  );
}
