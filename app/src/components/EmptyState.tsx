import { AlertCircle } from "lucide-react";

interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded border border-dashed border-line bg-white p-6 text-center">
      <div>
        <AlertCircle className="mx-auto mb-3 h-6 w-6 text-muted" aria-hidden="true" />
        <p className="font-medium text-ink">{title}</p>
        <p className="mt-1 text-sm text-muted">{message}</p>
      </div>
    </div>
  );
}
