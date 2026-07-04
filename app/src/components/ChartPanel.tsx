import type { ReactNode } from "react";
import { EmptyState } from "./EmptyState";

interface ChartPanelProps {
  title: string;
  subtitle: string;
  isEmpty: boolean;
  children: ReactNode;
}

export function ChartPanel({ title, subtitle, isEmpty, children }: ChartPanelProps) {
  return (
    <section className="min-w-0 rounded border border-line bg-white p-4 shadow-subtle">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>
      {isEmpty ? <EmptyState title="No chart data" message="Try widening the date range or changing filters." /> : children}
    </section>
  );
}
