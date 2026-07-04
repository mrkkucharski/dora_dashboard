import type { ReactNode } from "react";
import { EmptyState } from "./EmptyState";

interface TablePanelProps {
  title: string;
  subtitle: string;
  isEmpty: boolean;
  children: ReactNode;
}

export function TablePanel({ title, subtitle, isEmpty, children }: TablePanelProps) {
  return (
    <section className="min-w-0 rounded border border-line bg-white shadow-subtle">
      <div className="border-b border-line p-4">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </div>
      <div className="overflow-x-auto p-4">
        {isEmpty ? <EmptyState title="No rows match" message="Try a broader filter set." /> : children}
      </div>
    </section>
  );
}
