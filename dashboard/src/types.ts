export type MetricStatus = "elite" | "high" | "medium" | "low";

export interface DatePeriod {
  from: string;
  to: string;
}

export interface MetricDefinition {
  sourceOfTruth: string;
  calculation: string;
}

export interface Kpi {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: number;
  status: MetricStatus;
  description: string;
}

export interface RepositoryLeadTimeRanking {
  repository: string;
  team: string;
  service: string;
  medianLeadTimeHours: number;
  p95LeadTimeHours: number;
  openChanges: number;
}

export interface DoraSummary {
  lastRefreshed: string;
  period: DatePeriod;
  metricDefinitions: Record<string, MetricDefinition>;
  filters: {
    teams: string[];
    repositories: string[];
    services: string[];
    environments: string[];
  };
  kpis: Kpi[];
  repositoryLeadTimeRankings: RepositoryLeadTimeRanking[];
}

export interface Deployment {
  id: string;
  completedAt: string;
  team: string;
  repository: string;
  service: string;
  environment: string;
  version: string;
  pipeline: string;
  status: string;
  changes: number;
  leadTimeHours: number;
  failureReason?: string;
  recoveredAt?: string;
}

export interface DeploymentFrequencyPoint {
  date: string;
  deployments: number;
  production: number;
}

export interface DeploymentsData {
  deployments: Deployment[];
  deploymentFrequencyTrend: DeploymentFrequencyPoint[];
}

export interface LeadTimePoint {
  date: string;
  medianHours: number;
  p95Hours: number;
}

export interface LeadTimeData {
  leadTimeTrend: LeadTimePoint[];
}

export interface HealthPoint {
  date: string;
  success: number;
  failure: number;
}

export interface BuildHealthData {
  buildHealthTrend: HealthPoint[];
}

export interface FailedDeploymentCandidate {
  id: string;
  completedAt: string;
  team: string;
  repository: string;
  service: string;
  environment: string;
  pipeline: string;
  status: string;
  reason: string;
  owner: string;
  recoveryMinutes: number;
}

export interface PipelineHealthData {
  pipelineHealthTrend: HealthPoint[];
  failedDeploymentCandidates: FailedDeploymentCandidate[];
}

export interface DashboardData {
  summary: DoraSummary;
  deployments: DeploymentsData;
  leadTime: LeadTimeData;
  buildHealth: BuildHealthData;
  pipelineHealth: PipelineHealthData;
}

export interface Filters {
  team: string;
  repository: string;
  service: string;
  environment: string;
  from: string;
  to: string;
}
