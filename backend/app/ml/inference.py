from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

from app.config import Settings, get_settings
from app.models import Classification


def run_model_inference(image_path: str | Path, settings: Settings | None = None) -> tuple[Classification, float]:
    settings = settings or get_settings()
    with Image.open(image_path) as image:
        grayscale = ImageOps.grayscale(image)
        pixels = list(grayscale.resize((64, 64)).getdata())
    mean_intensity = sum(pixels) / len(pixels)
    dark_ratio = sum(1 for p in pixels if p < 95) / len(pixels)
    if dark_ratio > 0.34:
        return Classification.positive, min(0.98, 0.72 + dark_ratio / 2)
    if mean_intensity < 118:
        return Classification.suspicious, 0.68
    return Classification.negative, min(0.96, 0.76 + (mean_intensity - 118) / 500)


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
