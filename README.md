# DORA KPI Dashboard

Static React + Vite dashboard for DORA delivery metrics. The first version uses mock JSON data and a clean data contract so GitHub PR, Jenkins, and Spinnaker collectors can be added later without adding a backend.

## What It Shows

- KPI cards for deployment frequency, lead time for changes, change failure rate, and failed deployment recovery time
- Daily deployment frequency, lead time, Jenkins build health, and Spinnaker pipeline health charts
- Recent production deployments, slowest lead-time repositories, and failed deployment or rollback candidate tables
- Team, repository, service, environment, and date range filters
- Last refreshed timestamp, responsive layout, and empty/error states

## Repository Layout

```text
dashboard/            React + Vite + TypeScript + Tailwind frontend
data/                 Generated dashboard JSON contract
scripts/              Future collectors and DORA metric generation
.github/workflows/    Scheduled data refresh and GitHub Pages deployment
```

## Local Development

Install dependencies:

```bash
npm install --prefix dashboard
```

Prepare the dashboard-readable data files:

```bash
npm run refresh:data
```

Run the dashboard:

```bash
npm run dev
```

Build the static site:

```bash
npm run build
```

## Data Contract

The frontend only reads generated JSON files from `dashboard/public/data/` at runtime. Source/generated data is kept in `data/`:

- `data/dora-summary.json`
- `data/deployments.json`
- `data/lead-time.json`
- `data/build-health.json`
- `data/pipeline-health.json`

`scripts/compute_dora.py` currently validates the mock JSON and mirrors it into `dashboard/public/data/`. Future implementations should compute these files from normalized events instead of calculating metrics in the browser.

## Metric Assumptions

- Spinnaker production deployment completion events are the deployment source of truth.
- GitHub PR merge timestamp is the default change start time.
- Jenkins provides build success/failure context.
- Metric definitions live in `data/dora-summary.json` and are intended to stay configurable.
- The dashboard is read-only and does not require auth, a backend server, or browser-side metric computation.

## Future Integration Notes

Collector placeholders are ready for environment variables and GitHub Actions secrets:

- `scripts/collect_github.py` can query merged PRs and emit change events.
- `scripts/collect_jenkins.py` can query jobs and build results.
- `scripts/collect_spinnaker.py` can query pipeline executions and rollback markers.
- `scripts/normalize_events.py` is the boundary for joining raw events into a common shape.
- `scripts/compute_dora.py` should calculate deployment frequency, lead time, change failure rate, and recovery time from normalized events.

Recommended secret and variable names are already referenced in `.github/workflows/refresh-data.yml`.

## GitHub Pages

Enable Pages in the repository settings and use GitHub Actions as the Pages source. The `deploy-pages.yml` workflow installs dependencies, prepares static JSON data, builds `dashboard/dist`, and publishes it with `actions/deploy-pages`.

The `refresh-data.yml` workflow runs manually and on this cron schedule:

```text
0 6,14,22 * * *
```

It runs three times per day, executes the placeholder collectors, regenerates JSON, and commits refreshed data when files change.
