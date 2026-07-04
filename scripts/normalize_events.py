"""Normalize raw collector output into an internal event shape.

The first mock version does not call external APIs. It exists to define the
pipeline boundary where GitHub, Jenkins, and Spinnaker events will be joined.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"


def load_metric_config() -> dict[str, Any]:
    summary_path = DATA_DIR / "dora-summary.json"
    if not summary_path.exists():
        return {}
    with summary_path.open("r", encoding="utf-8") as handle:
        return json.load(handle).get("metricDefinitions", {})


def normalize_events() -> dict[str, Any]:
    return {
        "metricDefinitions": load_metric_config(),
        "sources": {
            "github": "PR merge timestamp is the default change start time",
            "jenkins": "Build health context",
            "spinnaker": "Production deployment source of truth"
        }
    }


def main() -> None:
    normalized = normalize_events()
    output_path = DATA_DIR / "normalized-events.preview.json"
    with output_path.open("w", encoding="utf-8") as handle:
        json.dump(normalized, handle, indent=2)
        handle.write("\n")
    print(f"Wrote {output_path}")


if __name__ == "__main__":
    main()
