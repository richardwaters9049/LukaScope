from datetime import UTC, datetime
from enum import Enum
from uuid import uuid4

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def new_id() -> str:
    return str(uuid4())


def now_utc() -> datetime:
    return datetime.now(UTC)


class JobStatus(str, Enum):
    queued = "queued"
    running = "running"
    completed = "completed"
    failed = "failed"


class Classification(str, Enum):
    positive = "positive"
    negative = "negative"
    suspicious = "suspicious"


class ReviewStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class Sample(Base):
    __tablename__ = "samples"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=new_id)
    original_filename: Mapped[str] = mapped_column(String, nullable=False)
    content_type: Mapped[str] = mapped_column(String, nullable=False)
    storage_path: Mapped[str] = mapped_column(String, nullable=False)
    uploaded_by: Mapped[str] = mapped_column(String, nullable=False, default="clinician")
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=now_utc)

    jobs: Mapped[list["AnalysisJob"]] = relationship(back_populates="sample")
    results: Mapped[list["Result"]] = relationship(back_populates="sample")


class AnalysisJob(Base):
    __tablename__ = "analysis_jobs"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=new_id)
    sample_id: Mapped[str] = mapped_column(ForeignKey("samples.id"), nullable=False)
    status: Mapped[JobStatus] = mapped_column(String, nullable=False, default=JobStatus.queued.value)
    result_id: Mapped[str | None] = mapped_column(ForeignKey("results.id"), nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=now_utc)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=now_utc)

    sample: Mapped[Sample] = relationship(back_populates="jobs")
    result: Mapped["Result | None"] = relationship(back_populates="job", foreign_keys=[result_id])


class Result(Base):
    __tablename__ = "results"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=new_id)
    sample_id: Mapped[str] = mapped_column(ForeignKey("samples.id"), nullable=False)
    classification: Mapped[Classification] = mapped_column(String, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
    model_version: Mapped[str] = mapped_column(String, nullable=False)
    heatmap_path: Mapped[str] = mapped_column(String, nullable=False)
    review_status: Mapped[ReviewStatus] = mapped_column(String, nullable=False, default=ReviewStatus.pending.value)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=now_utc)

    sample: Mapped[Sample] = relationship(back_populates="results")
    job: Mapped[AnalysisJob | None] = relationship(back_populates="result", foreign_keys=[AnalysisJob.result_id])
    review: Mapped["Review | None"] = relationship(back_populates="result")


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=new_id)
    result_id: Mapped[str] = mapped_column(ForeignKey("results.id"), nullable=False, unique=True)
    reviewer: Mapped[str] = mapped_column(String, nullable=False)
    label: Mapped[Classification] = mapped_column(String, nullable=False)
    approved_for_training: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=now_utc)

    result: Mapped[Result] = relationship(back_populates="review")


class TrainingRun(Base):
    __tablename__ = "training_runs"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=new_id)
    status: Mapped[JobStatus] = mapped_column(String, nullable=False, default=JobStatus.queued.value)
    candidate_model_version: Mapped[str | None] = mapped_column(String, nullable=True)
    approved_sample_count: Mapped[int] = mapped_column(nullable=False, default=0)
    metrics_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=now_utc)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=now_utc)
