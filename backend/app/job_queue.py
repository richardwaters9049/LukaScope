from redis import Redis
from rq import Queue

from app.config import get_settings
from app.tasks import run_inference, run_retraining


QUEUE_NAME = "lukascope"


def enqueue_inference(job_id: str) -> None:
    settings = get_settings()
    if settings.run_jobs_inline:
        run_inference(job_id)
        return
    queue = Queue(QUEUE_NAME, connection=Redis.from_url(settings.redis_url))
    queue.enqueue(run_inference, job_id, job_timeout=600)


def enqueue_retraining(training_run_id: str) -> None:
    settings = get_settings()
    if settings.run_jobs_inline:
        run_retraining(training_run_id)
        return
    queue = Queue(QUEUE_NAME, connection=Redis.from_url(settings.redis_url))
    queue.enqueue(run_retraining, training_run_id, job_timeout=3600)
