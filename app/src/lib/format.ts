export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric"
  }).format(new Date(`${value}T00:00:00Z`));
}

export function formatTrend(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}%`;
}

export function statusLabel(status: string): string {
  return status.replace(/_/g, " ");
}
