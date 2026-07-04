import { statusLabel } from "../lib/format";

const statusClass = {
  success: "bg-mint/10 text-mint",
  rolled_back: "bg-rose/10 text-rose",
  failed_verification: "bg-amber/10 text-amber",
  rollback_candidate: "bg-amber/10 text-amber"
} as Record<string, string>;

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={`whitespace-nowrap rounded px-2 py-1 text-xs font-semibold uppercase ${statusClass[status] ?? "bg-slate-100 text-slate-700"}`}>
      {statusLabel(status)}
    </span>
  );
}
