from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from redis import Redis
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db, init_db
from app.job_queue import enqueue_inference, enqueue_retraining
from app.models import AnalysisJob, JobStatus, Result, Review, ReviewStatus, Sample, TrainingRun, now_utc
from app.schemas import AnalysisJobRead, HealthRead, ResultRead, ReviewCreate, ReviewRead, SampleCreated
from app.storage import asset_url, ensure_storage, promote_for_training, save_upload


settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    ensure_storage(settings)
    init_db()
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.frontend_url.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ensure_storage(settings)
app.mount(settings.asset_url_path, StaticFiles(directory=settings.storage_root), name="assets")

def result_to_schema(result: Result) -> ResultRead:
    return ResultRead(
        id=result.id,
        sample_id=result.sample_id,
        sample_name=result.sample.original_filename,
        uploaded_by=result.sample.uploaded_by,
        uploaded_at=result.sample.created_at,
        image_url=asset_url(result.sample.storage_path),
        classification=result.classification,
        confidence=result.confidence,
        model_version=result.model_version,
        heatmap_url=asset_url(result.heatmap_path),
        review_status=result.review_status,
        created_at=result.created_at,
    )


@app.get("/health", response_model=HealthRead)
def health(db: Session = Depends(get_db)) -> HealthRead:
    database = "ok"
    redis_status = "ok"
    try:
        db.execute(text("select 1"))
    except Exception:
        database = "unavailable"
    try:
        Redis.from_url(settings.redis_url).ping()
    except Exception:
        redis_status = "unavailable"
    return HealthRead(
        status="ok" if database == "ok" else "degraded",
        environment=settings.environment,
        database=database,
        redis=redis_status,
        model_available=Path(settings.active_model_path).exists(),
        active_model_version=settings.active_model_version,
    )


@app.post("/api/samples", response_model=SampleCreated, status_code=202)
async def create_sample(
    file: UploadFile = File(...),
    uploaded_by: str = Form("clinician"),
    db: Session = Depends(get_db),
) -> SampleCreated:
    path = await save_upload(file, settings)
    sample = Sample(
        original_filename=file.filename or path.name,
        content_type=file.content_type or "application/octet-stream",
        storage_path=str(path),
        uploaded_by=uploaded_by or "clinician",
    )
    db.add(sample)
    db.flush()
    job = AnalysisJob(sample_id=sample.id, status=JobStatus.queued.value)
    db.add(job)
    db.commit()
    enqueue_inference(job.id)
    db.refresh(job)
    return SampleCreated(job_id=job.id, sample_id=sample.id, status=job.status, result_id=job.result_id)


@app.get("/api/analysis-jobs/{job_id}", response_model=AnalysisJobRead)
def get_analysis_job(job_id: str, db: Session = Depends(get_db)) -> AnalysisJob:
    job = db.get(AnalysisJob, job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Analysis job not found.")
    return job


@app.get("/api/results", response_model=list[ResultRead])
def list_results(db: Session = Depends(get_db)) -> list[ResultRead]:
    results = db.query(Result).order_by(Result.created_at.desc()).all()
    return [result_to_schema(result) for result in results]


@app.get("/api/results/{result_id}", response_model=ResultRead)
def get_result(result_id: str, db: Session = Depends(get_db)) -> ResultRead:
    result = db.get(Result, result_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Result not found.")
    return result_to_schema(result)


@app.post("/api/results/{result_id}/review", response_model=ReviewRead)
def review_result(result_id: str, payload: ReviewCreate, db: Session = Depends(get_db)) -> ReviewRead:
    result = db.get(Result, result_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Result not found.")

    existing = db.query(Review).filter(Review.result_id == result_id).one_or_none()
    review = existing or Review(result_id=result_id, reviewer=payload.reviewer, label=payload.label.value)
    review.reviewer = payload.reviewer
    review.label = payload.label.value
    review.approved_for_training = payload.approved_for_training
    review.notes = payload.notes
    review.created_at = now_utc()
    db.add(review)

    result.review_status = ReviewStatus.approved.value if payload.approved_for_training else ReviewStatus.rejected.value
    if payload.approved_for_training:
        promote_for_training(result.sample.storage_path, payload.label.value, result.id, settings)
    db.commit()
    db.refresh(review)
    return ReviewRead(
        result_id=result.id,
        reviewer=review.reviewer,
        label=review.label,
        approved_for_training=review.approved_for_training,
        review_status=result.review_status,
        created_at=review.created_at,
    )


@app.post("/api/training-runs", response_model=dict[str, str], status_code=202)
def create_training_run(db: Session = Depends(get_db)) -> dict[str, str]:
    training_run = TrainingRun(status=JobStatus.queued.value)
    db.add(training_run)
    db.commit()
    enqueue_retraining(training_run.id)
    return {"training_run_id": training_run.id, "status": training_run.status}
