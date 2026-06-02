import json
from pathlib import Path

from sqlalchemy.orm import Session

from app.config import Settings, get_settings
from app.models import Review


def approved_training_count(db: Session) -> int:
    return db.query(Review).filter(Review.approved_for_training.is_(True)).count()


def write_candidate_artifact(run_id: str, approved_count: int, settings: Settings | None = None) -> tuple[str, str]:
    settings = settings or get_settings()
    version = f"candidate-{run_id[:8]}"
    target = settings.storage_root / "models" / f"{version}.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    metrics = {
        "approved_sample_count": approved_count,
        "sensitivity": None,
        "specificity": None,
        "status": "candidate_requires_approval",
    }
    target.write_text(json.dumps(metrics, indent=2))
    return version, json.dumps(metrics)
