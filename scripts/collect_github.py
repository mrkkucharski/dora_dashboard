"""Placeholder GitHub collector for future PR merge events.

Credentials are intentionally read from environment variables so GitHub Actions
secrets can be wired in later without changing code.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Iterable


@dataclass(frozen=True)
class PullRequestEvent:
    repository: str
    pull_request: int
    merged_at: str
    commit_sha: str
    team: str | None = None
    service: str | None = None


def collect_pull_request_events() -> list[PullRequestEvent]:
    token = os.getenv("GITHUB_TOKEN") or os.getenv("GH_TOKEN")
    organization = os.getenv("GITHUB_ORG")

    if not token or not organization:
      return []

    # Future implementation:
    # - Query merged pull requests through GitHub GraphQL or REST.
    # - Treat merged_at as the default DORA change start time.
    # - Persist normalized events for compute_dora.py.
    return []


def main() -> None:
    events: Iterable[PullRequestEvent] = collect_pull_request_events()
    print(f"Collected {len(list(events))} GitHub PR events")


if __name__ == "__main__":
    main()
