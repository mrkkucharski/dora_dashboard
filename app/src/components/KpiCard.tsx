import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Kpi } from "../types";
import { formatTrend } from "../lib/format";

interface KpiCardProps {
  kpi: Kpi;
}

const statusClasses: Record<Kpi["status"], string> = {
  elite: "bg-mint/10 text-mint",
  high: "bg-ocean/10 text-ocean",
  medium: "bg-amber/10 text-amber",
  low: "bg-rose/10 text-rose"
};

export function KpiCard({ kpi }: KpiCardProps) {
  const trendIsGood = kpi.id === "deploymentFrequency" ? kpi.trend >= 0 : kpi.trend <= 0;
  const TrendIcon = trendIsGood ? ArrowDownRight : ArrowUpRight;

  return (
    <article className="min-w-0 rounded border border-line bg-white p-4 shadow-subtle">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted">{kpi.label}</p>
          <p className="mt-2 flex items-baseline gap-2 text-3xl font-semibold text-ink">
            {kpi.value}
            <span className="text-sm font-medium text-muted">{kpi.unit}</span>
          </p>
        </div>
        <span className={`rounded px-2 py-1 text-xs font-semibold uppercase ${statusClasses[kpi.status]}`}>{kpi.status}</span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-sm">
        <span className="min-w-0 text-muted">{kpi.description}</span>
        <span className={`inline-flex shrink-0 items-center gap-1 font-semibold ${trendIsGood ? "text-mint" : "text-rose"}`}>
          <TrendIcon className="h-4 w-4" aria-hidden="true" />
          {formatTrend(kpi.trend)}
        </span>
      </div>
    </article>
  );
}
