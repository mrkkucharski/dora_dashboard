"""Generate DORA dashboard JSON files.

This mock implementation keeps the checked-in sample data intact and mirrors it
to the Vite public directory. Future versions should replace the mock pass with
calculations over normalized GitHub, Jenkins, and Spinnaker events.
"""

from __future__ import annotations

import json
import shutil
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
PUBLIC_DATA_DIR = ROOT / "dashboard" / "public" / "data"

DATA_FILES = [
    "dora-summary.json",
    "deployments.json",
    "lead-time.json",
    "build-health.json",
    "pipeline-health.json"
]


def read_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def validate_mock_data() -> None:
    missing = [name for name in DATA_FILES if not (DATA_DIR / name).exists()]
    if missing:
        raise FileNotFoundError(f"Missing generated data files: {', '.join(missing)}")

    for name in DATA_FILES:
        read_json(DATA_DIR / name)


def publish_dashboard_data() -> None:
    PUBLIC_DATA_DIR.mkdir(parents=True, exist_ok=True)
    for name in DATA_FILES:
        shutil.copyfile(DATA_DIR / name, PUBLIC_DATA_DIR / name)


def main() -> None:
    validate_mock_data()
    publish_dashboard_data()
    print(f"Published {len(DATA_FILES)} data files to {PUBLIC_DATA_DIR}")


if __name__ == "__main__":
    main()
