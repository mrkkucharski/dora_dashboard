"""Placeholder Jenkins collector for build health context."""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Iterable


@dataclass(frozen=True)
class JenkinsBuildEvent:
    job_name: str
    build_number: int
    completed_at: str
    result: str
    repository: str | None = None
    commit_sha: str | None = None


def collect_build_events() -> list[JenkinsBuildEvent]:
    base_url = os.getenv("JENKINS_URL")
    username = os.getenv("JENKINS_USERNAME")
    api_token = os.getenv("JENKINS_API_TOKEN")

    if not base_url or not username or not api_token:
        return []

    # Future implementation:
    # - Query Jenkins jobs and build results.
    # - Normalize success/failure counts by repository, service, and day.
    # - Use this only as build health context, not deployment source-of-truth.
    return []


def main() -> None:
    events: Iterable[JenkinsBuildEvent] = collect_build_events()
    print(f"Collected {len(list(events))} Jenkins build events")


if __name__ == "__main__":
    main()
