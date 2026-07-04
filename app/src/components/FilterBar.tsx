import type { DoraSummary, Filters } from "../types";

interface FilterBarProps {
  summary: DoraSummary;
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const selectClass =
  "h-10 rounded border border-line bg-white px-3 text-sm text-ink shadow-subtle outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/15";

export function FilterBar({ summary, filters, onChange }: FilterBarProps) {
  const update = (key: keyof Filters, value: string) => onChange({ ...filters, [key]: value });

  return (
    <section className="border-y border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-3 px-4 py-4 sm:grid-cols-2 lg:grid-cols-6 lg:px-6">
        <label className="grid gap-1 text-xs font-medium uppercase tracking-wide text-muted">
          Team
          <select className={selectClass} value={filters.team} onChange={(event) => update("team", event.target.value)}>
            <option value="all">All teams</option>
            {summary.filters.teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-medium uppercase tracking-wide text-muted">
          Repository
          <select
            className={selectClass}
            value={filters.repository}
            onChange={(event) => update("repository", event.target.value)}
          >
            <option value="all">All repositories</option>
            {summary.filters.repositories.map((repository) => (
              <option key={repository} value={repository}>
                {repository}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-medium uppercase tracking-wide text-muted">
          Service
          <select
            className={selectClass}
            value={filters.service}
            onChange={(event) => update("service", event.target.value)}
          >
            <option value="all">All services</option>
            {summary.filters.services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-medium uppercase tracking-wide text-muted">
          Environment
          <select
            className={selectClass}
            value={filters.environment}
            onChange={(event) => update("environment", event.target.value)}
          >
            <option value="all">All environments</option>
            {summary.filters.environments.map((environment) => (
              <option key={environment} value={environment}>
                {environment}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-medium uppercase tracking-wide text-muted">
          From
          <input className={selectClass} type="date" value={filters.from} onChange={(event) => update("from", event.target.value)} />
        </label>
        <label className="grid gap-1 text-xs font-medium uppercase tracking-wide text-muted">
          To
          <input className={selectClass} type="date" value={filters.to} onChange={(event) => update("to", event.target.value)} />
        </label>
      </div>
    </section>
  );
}
