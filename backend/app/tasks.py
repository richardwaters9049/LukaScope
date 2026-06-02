from app.config import get_settings
from app.database import SessionLocal
from app.ml.inference import generate_heatmap, run_model_inference
from app.ml.training import approved_training_count, write_candidate_artifact
from app.models import AnalysisJob, JobStatus, Result, TrainingRun, now_utc


def run_inference(job_id: str) -> str:
    settings = get_settings()
    db = SessionLocal()
    try:
        job = db.get(AnalysisJob, job_id)
        if job is None:
            raise ValueError(f"Analysis job not found: {job_id}")
        job.status = JobStatus.running.value
        job.updated_at = now_utc()
        db.commit()

        classification, confidence = run_model_inference(job.sample.storage_path, settings)
        result = Result(
            sample_id=job.sample_id,
            classification=classification.value,
            confidence=round(confidence * 100, 2),
            model_version=settings.active_model_version,
            heatmap_path="pending",
        )
        db.add(result)
        db.flush()

        heatmap_path = generate_heatmap(job.sample.storage_path, result.id, settings)
        result.heatmap_path = str(heatmap_path)
        job.result_id = result.id
        job.status = JobStatus.completed.value
        job.updated_at = now_utc()
        db.commit()
        return result.id
    except Exception as exc:
        job = db.get(AnalysisJob, job_id)
        if job is not None:
            job.status = JobStatus.failed.value
            job.error_message = str(exc)
            job.updated_at = now_utc()
            db.commit()
        raise
    finally:
        db.close()


def run_retraining(training_run_id: str) -> str:
    db = SessionLocal()
    try:
        run = db.get(TrainingRun, training_run_id)
        if run is None:
            raise ValueError(f"Training run not found: {training_run_id}")
        run.status = JobStatus.running.value
        run.updated_at = now_utc()
        db.commit()

        count = approved_training_count(db)
        version, metrics_json = write_candidate_artifact(training_run_id, count)
        run.status = JobStatus.completed.value
        run.approved_sample_count = count
        run.candidate_model_version = version
        run.metrics_json = metrics_json
        run.updated_at = now_utc()
        db.commit()
        return version
    finally:
        db.close()
