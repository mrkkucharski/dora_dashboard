import type {
  BuildHealthData,
  DashboardData,
  DeploymentsData,
  DoraSummary,
  LeadTimeData,
  PipelineHealthData
} from "../types";

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`Unable to load ${path}: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function loadDashboardData(): Promise<DashboardData> {
  const [summary, deployments, leadTime, buildHealth, pipelineHealth] = await Promise.all([
    fetchJson<DoraSummary>("./data/dora-summary.json"),
    fetchJson<DeploymentsData>("./data/deployments.json"),
    fetchJson<LeadTimeData>("./data/lead-time.json"),
    fetchJson<BuildHealthData>("./data/build-health.json"),
    fetchJson<PipelineHealthData>("./data/pipeline-health.json")
  ]);

  return { summary, deployments, leadTime, buildHealth, pipelineHealth };
}
