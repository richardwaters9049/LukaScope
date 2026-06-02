from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models import Classification, JobStatus, ReviewStatus


class SampleCreated(BaseModel):
    job_id: str
    sample_id: str
    status: JobStatus
    result_id: str | None = None


class AnalysisJobRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    sample_id: str
    status: JobStatus
    result_id: str | None
    error_message: str | None
    created_at: datetime
    updated_at: datetime


class ResultRead(BaseModel):
    id: str
    sample_id: str
    sample_name: str
    uploaded_by: str
    uploaded_at: datetime
    image_url: str
    classification: Classification
    confidence: float
    model_version: str
    heatmap_url: str
    review_status: ReviewStatus
    created_at: datetime


class ReviewCreate(BaseModel):
    reviewer: str = Field(min_length=1, max_length=120)
    label: Classification
    approved_for_training: bool = False
    notes: str | None = Field(default=None, max_length=2000)


class ReviewRead(BaseModel):
    result_id: str
    reviewer: str
    label: Classification
    approved_for_training: bool
    review_status: ReviewStatus
    created_at: datetime


class HealthRead(BaseModel):
    status: str
    environment: str
    database: str
    redis: str
    model_available: bool
    active_model_version: str
