import type {
  DashboardData,
  Deployment,
  FailedDeploymentCandidate,
  Filters,
  HealthPoint,
  LeadTimePoint,
  RepositoryLeadTimeRanking
} from "../types";

export function defaultFilters(data: DashboardData): Filters {
  return {
    team: "all",
    repository: "all",
    service: "all",
    environment: "production",
    from: data.summary.period.from,
    to: data.summary.period.to
  };
}

export function inDateRange(date: string, from: string, to: string): boolean {
  return date.slice(0, 10) >= from && date.slice(0, 10) <= to;
}

export function matchesFilters(
  item: { team?: string; repository?: string; service?: string; environment?: string; date?: string; completedAt?: string },
  filters: Filters
): boolean {
  const date = item.date ?? item.completedAt;
  return (
    (filters.team === "all" || item.team === filters.team) &&
    (filters.repository === "all" || item.repository === filters.repository) &&
    (filters.service === "all" || item.service === filters.service) &&
    (filters.environment === "all" || item.environment === filters.environment) &&
    (!date || inDateRange(date, filters.from, filters.to))
  );
}

export function filterDeployments(deployments: Deployment[], filters: Filters): Deployment[] {
  return deployments.filter((deployment) => matchesFilters(deployment, filters));
}

export function filterRepositoryRankings(
  rankings: RepositoryLeadTimeRanking[],
  filters: Filters
): RepositoryLeadTimeRanking[] {
  return rankings.filter((ranking) => matchesFilters(ranking, { ...filters, environment: "all" }));
}

export function filterFailedCandidates(
  candidates: FailedDeploymentCandidate[],
  filters: Filters
): FailedDeploymentCandidate[] {
  return candidates.filter((candidate) => matchesFilters(candidate, filters));
}

export function filterDateSeries<T extends HealthPoint | LeadTimePoint | { date: string }>(points: T[], filters: Filters): T[] {
  return points.filter((point) => inDateRange(point.date, filters.from, filters.to));
}
