from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

from app.config import Settings, get_settings
from app.models import Classification
from app.ml.model_adapter import get_model_adapter


def run_model_inference(image_path: str | Path, settings: Settings | None = None) -> tuple[Classification, float]:
    settings = settings or get_settings()
    prediction = get_model_adapter(settings).predict(image_path)
    return prediction.classification, prediction.confidence


def generate_heatmap(image_path: str | Path, result_id: str, settings: Settings | None = None) -> Path:
    settings = settings or get_settings()
    target = settings.storage_root / "heatmaps" / f"{result_id}.png"
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(image_path) as image:
        base = image.convert("RGBA")
        grayscale = ImageOps.grayscale(base)
        heat = ImageOps.colorize(ImageOps.autocontrast(grayscale), black="#04111f", white="#ef4444").convert("RGBA")
        heat = ImageEnhance.Contrast(heat).enhance(1.3)
        blended = Image.blend(base, heat, 0.42)
        blended.save(target)
    return target
