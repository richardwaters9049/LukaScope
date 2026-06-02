from io import BytesIO

from PIL import Image


def image_bytes(color: tuple[int, int, int] = (230, 230, 230)) -> BytesIO:
    stream = BytesIO()
    Image.new("RGB", (32, 32), color).save(stream, format="PNG")
    stream.seek(0)
    return stream


def upload_sample(client, filename: str = "sample.png", color: tuple[int, int, int] = (230, 230, 230)):
    return client.post(
        "/api/samples",
        files={"file": (filename, image_bytes(color), "image/png")},
        data={"uploaded_by": "Dr. Rivera"},
    )


def test_health_reports_service_state(client):
    response = client.get("/health")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] in {"ok", "degraded"}
    assert body["database"] == "ok"
    assert body["active_model_version"] == "heuristic-v0.1"


def test_sample_upload_creates_completed_inline_analysis_result(client):
    upload = upload_sample(client)

    assert upload.status_code == 202
    created = upload.json()
    assert created["sample_id"]
    assert created["job_id"]
    assert created["status"] == "completed"
    assert created["result_id"]

    job = client.get(f"/api/analysis-jobs/{created['job_id']}")
    assert job.status_code == 200
    assert job.json()["result_id"] == created["result_id"]

    result = client.get(f"/api/results/{created['result_id']}")
    assert result.status_code == 200
    body = result.json()
    assert body["classification"] in {"negative", "positive", "suspicious"}
    assert 0 <= body["confidence"] <= 100
    assert body["heatmap_url"].startswith("/assets/heatmaps/")
    assert body["image_url"].startswith("/assets/uploads/")
    assert body["review_status"] == "pending"


def test_upload_rejects_non_image_extension(client):
    response = client.post(
        "/api/samples",
        files={"file": ("notes.txt", BytesIO(b"not an image"), "text/plain")},
    )

    assert response.status_code == 400


def test_results_list_returns_completed_results(client):
    upload = upload_sample(client)

    response = client.get("/api/results")

    assert response.status_code == 200
    results = response.json()
    assert len(results) == 1
    assert results[0]["id"] == upload.json()["result_id"]


def test_clinician_review_promotes_only_approved_samples(client):
    upload = upload_sample(client, color=(20, 20, 20))
    result_id = upload.json()["result_id"]

    rejected = client.post(
        f"/api/results/{result_id}/review",
        json={"reviewer": "Dr. Rivera", "label": "positive", "approved_for_training": False},
    )
    assert rejected.status_code == 200
    assert rejected.json()["review_status"] == "rejected"

    approved = client.post(
        f"/api/results/{result_id}/review",
        json={"reviewer": "Dr. Rivera", "label": "positive", "approved_for_training": True},
    )
    assert approved.status_code == 200
    assert approved.json()["review_status"] == "approved"


def test_training_run_uses_reviewed_data_only(client):
    upload = upload_sample(client)
    result_id = upload.json()["result_id"]
    client.post(
        f"/api/results/{result_id}/review",
        json={"reviewer": "Dr. Rivera", "label": "negative", "approved_for_training": True},
    )

    response = client.post("/api/training-runs")

    assert response.status_code == 202
    assert response.json()["training_run_id"]
