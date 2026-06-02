from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile

from app.config import Settings, get_settings

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".tif", ".tiff"}
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/tiff", "application/octet-stream"}


def ensure_storage(settings: Settings | None = None) -> None:
    settings = settings or get_settings()
    for name in ("uploads", "heatmaps", "datasets/approved", "models"):
        (settings.storage_root / name).mkdir(parents=True, exist_ok=True)


def validate_image_upload(file: UploadFile) -> str:
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported format. Use JPG, PNG, or TIFF.")
    if file.content_type and file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported image content type.")
    return suffix


async def save_upload(file: UploadFile, settings: Settings | None = None) -> Path:
    settings = settings or get_settings()
    ensure_storage(settings)
    suffix = validate_image_upload(file)
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Uploaded image is empty.")
    if len(data) > settings.max_upload_bytes:
        raise HTTPException(status_code=413, detail="Uploaded image exceeds the 10MB limit.")
    path = settings.storage_root / "uploads" / f"{uuid4()}{suffix}"
    path.write_bytes(data)
    return path


def asset_url(path: str | Path, settings: Settings | None = None) -> str:
    settings = settings or get_settings()
    absolute = Path(path).resolve()
    root = settings.storage_root.resolve()
    relative = absolute.relative_to(root)
    return f"{settings.asset_url_path}/{relative.as_posix()}"


def promote_for_training(source_path: str, label: str, result_id: str, settings: Settings | None = None) -> Path:
    settings = settings or get_settings()
    ensure_storage(settings)
    source = Path(source_path)
    target_dir = settings.storage_root / "datasets" / "approved" / label
    target_dir.mkdir(parents=True, exist_ok=True)
    target = target_dir / f"{result_id}{source.suffix.lower()}"
    target.write_bytes(source.read_bytes())
    return target
