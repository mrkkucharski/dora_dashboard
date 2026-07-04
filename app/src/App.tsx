import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { RefreshCw } from "lucide-react";
import { ChartPanel } from "./components/ChartPanel";
import { EmptyState } from "./components/EmptyState";
import { FilterBar } from "./components/FilterBar";
import { KpiCard } from "./components/KpiCard";
import { StatusPill } from "./components/StatusPill";
import { TablePanel } from "./components/TablePanel";
import { loadDashboardData } from "./lib/data";
import { defaultFilters, filterDateSeries, filterDeployments, filterFailedCandidates, filterRepositoryRankings } from "./lib/filters";
import { formatDate, formatDateTime } from "./lib/format";
import type { DashboardData, Filters } from "./types";

const axisStyle = { fontSize: 12, fill: "#5f6f7a" };
const chartLabel = (value: unknown) => formatDate(String(value));

export default function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [filters, setFilters] = useState<Filters | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData()
      .then((dashboardData) => {
        setData(dashboardData);
        setFilters(defaultFilters(dashboardData));
      })
      .catch((loadError: Error) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!data || !filters) {
      return null;
    }

    return {
      deployments: filterDeployments(data.deployments.deployments, filters),
      deploymentFrequency: filterDateSeries(data.deployments.deploymentFrequencyTrend, filters),
      leadTime: filterDateSeries(data.leadTime.leadTimeTrend, filters),
      buildHealth: filterDateSeries(data.buildHealth.buildHealthTrend, filters),
      pipelineHealth: filterDateSeries(data.pipelineHealth.pipelineHealthTrend, filters),
      repositories: filterRepositoryRankings(data.summary.repositoryLeadTimeRankings, filters),
      failedCandidates: filterFailedCandidates(data.pipelineHealth.failedDeploymentCandidates, filters)
    };
  }, [data, filters]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f7f9] text-ink">
        <div className="inline-flex items-center gap-3 text-sm font-medium">
          <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
          Loading dashboard data
        </div>
      </main>
    );
  }

  if (error || !data || !filters || !filtered) {
    return (
      <main className="min-h-screen bg-[#f4f7f9] p-6">
        <EmptyState title="Dashboard data failed to load" message={error ?? "The generated JSON files are unavailable."} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f7f9] text-ink">
      <header className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 lg:flex-row lg:items-end lg:justify-between lg:px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ocean">DORA KPIs</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal text-ink">Engineering delivery health</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted">
            Static read-only dashboard generated from Spinnaker deployment events, GitHub merge timestamps, and Jenkins build context.
          </p>
        </div>
        <div className="rounded border border-line bg-white px-3 py-2 text-sm shadow-subtle">
          <span className="text-muted">Last refreshed</span>
          <span className="ml-2 font-semibold text-ink">{formatDateTime(data.summary.lastRefreshed)}</span>
        </div>
      </header>

      <FilterBar summary={data.summary} filters={filters} onChange={setFilters} />

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 lg:px-6">
        <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {data.summary.kpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} />
          ))}
        </section>

        <section className="grid min-w-0 gap-4 xl:grid-cols-2">
          <ChartPanel
            title="Deployment frequency trend"
            subtitle="Daily deployment count, with production deployments highlighted"
            isEmpty={filtered.deploymentFrequency.length === 0}
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={filtered.deploymentFrequency}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8e1e8" />
                <XAxis dataKey="date" tickFormatter={formatDate} tick={axisStyle} />
                <YAxis tick={axisStyle} allowDecimals={false} />
                <Tooltip labelFormatter={chartLabel} />
                <Legend />
                <Area type="monotone" dataKey="deployments" name="All deploys" stroke="#19647e" fill="#19647e" fillOpacity={0.14} />
                <Area type="monotone" dataKey="production" name="Production" stroke="#2a9d8f" fill="#2a9d8f" fillOpacity={0.18} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel title="Lead time trend" subtitle="Median and p95 hours from PR merge to production" isEmpty={filtered.leadTime.length === 0}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={filtered.leadTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8e1e8" />
                <XAxis dataKey="date" tickFormatter={formatDate} tick={axisStyle} />
                <YAxis tick={axisStyle} unit="h" />
                <Tooltip labelFormatter={chartLabel} />
                <Legend />
                <Line type="monotone" dataKey="medianHours" name="Median" stroke="#19647e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="p95Hours" name="P95" stroke="#d18b27" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel title="Jenkins build health" subtitle="Successful and failed build counts by day" isEmpty={filtered.buildHealth.length === 0}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={filtered.buildHealth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8e1e8" />
                <XAxis dataKey="date" tickFormatter={formatDate} tick={axisStyle} />
                <YAxis tick={axisStyle} allowDecimals={false} />
                <Tooltip labelFormatter={chartLabel} />
                <Legend />
                <Bar dataKey="success" name="Success" stackId="builds" fill="#2a9d8f" />
                <Bar dataKey="failure" name="Failure" stackId="builds" fill="#c84c61" />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel
            title="Spinnaker pipeline health"
            subtitle="Pipeline executions feeding deployment source-of-truth"
            isEmpty={filtered.pipelineHealth.length === 0}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={filtered.pipelineHealth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d8e1e8" />
                <XAxis dataKey="date" tickFormatter={formatDate} tick={axisStyle} />
                <YAxis tick={axisStyle} allowDecimals={false} />
                <Tooltip labelFormatter={chartLabel} />
                <Legend />
                <Bar dataKey="success" name="Success" stackId="pipelines" fill="#19647e" />
                <Bar dataKey="failure" name="Failure" stackId="pipelines" fill="#d18b27" />
              </BarChart>
            </ResponsiveContainer>
          </ChartPanel>
        </section>

        <section className="grid min-w-0 gap-4 xl:grid-cols-2">
          <TablePanel
            title="Recent production deployments"
            subtitle="Latest Spinnaker production deployment events"
            isEmpty={filtered.deployments.length === 0}
          >
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="pb-3 pr-4">Completed</th>
                  <th className="pb-3 pr-4">Service</th>
                  <th className="pb-3 pr-4">Version</th>
                  <th className="pb-3 pr-4">Changes</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.deployments.map((deployment) => (
                  <tr key={deployment.id}>
                    <td className="py-3 pr-4 text-muted">{formatDateTime(deployment.completedAt)}</td>
                    <td className="py-3 pr-4 font-medium text-ink">{deployment.service}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-muted">{deployment.version}</td>
                    <td className="py-3 pr-4">{deployment.changes}</td>
                    <td className="py-3">
                      <StatusPill status={deployment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TablePanel>

          <TablePanel
            title="Slowest lead time repositories"
            subtitle="Median and p95 PR merge to production duration"
            isEmpty={filtered.repositories.length === 0}
          >
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="pb-3 pr-4">Repository</th>
                  <th className="pb-3 pr-4">Team</th>
                  <th className="pb-3 pr-4">Median</th>
                  <th className="pb-3 pr-4">P95</th>
                  <th className="pb-3">Open</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.repositories.map((repository) => (
                  <tr key={repository.repository}>
                    <td className="py-3 pr-4 font-medium text-ink">{repository.repository}</td>
                    <td className="py-3 pr-4 text-muted">{repository.team}</td>
                    <td className="py-3 pr-4">{repository.medianLeadTimeHours}h</td>
                    <td className="py-3 pr-4">{repository.p95LeadTimeHours}h</td>
                    <td className="py-3">{repository.openChanges}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TablePanel>
        </section>

        <TablePanel
          title="Recent failed deployments or rollback candidates"
          subtitle="Production events that may contribute to change failure rate and recovery time"
          isEmpty={filtered.failedCandidates.length === 0}
        >
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="pb-3 pr-4">Completed</th>
                <th className="pb-3 pr-4">Service</th>
                <th className="pb-3 pr-4">Pipeline</th>
                <th className="pb-3 pr-4">Reason</th>
                <th className="pb-3 pr-4">Owner</th>
                <th className="pb-3 pr-4">Recovery</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.failedCandidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td className="py-3 pr-4 text-muted">{formatDateTime(candidate.completedAt)}</td>
                  <td className="py-3 pr-4 font-medium text-ink">{candidate.service}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-muted">{candidate.pipeline}</td>
                  <td className="max-w-md py-3 pr-4 text-muted">{candidate.reason}</td>
                  <td className="py-3 pr-4">{candidate.owner}</td>
                  <td className="py-3 pr-4">{candidate.recoveryMinutes}m</td>
                  <td className="py-3">
                    <StatusPill status={candidate.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TablePanel>
      </div>
    </main>
  );
}
