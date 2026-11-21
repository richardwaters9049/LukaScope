from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageOps

from app.config import Settings, get_settings
from app.models import Classification


@dataclass(frozen=True)
class ModelPrediction:
    classification: Classification
    confidence: float
    model_version: str
    model_type: str


class HeuristicModelAdapter:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def predict(self, image_path: str | Path) -> ModelPrediction:
        with Image.open(image_path) as image:
            grayscale = ImageOps.grayscale(image)
            pixels = list(grayscale.resize((64, 64)).getdata())
        mean_intensity = sum(pixels) / len(pixels)
        dark_ratio = sum(1 for p in pixels if p < 95) / len(pixels)
        if dark_ratio > 0.34:
            classification = Classification.positive
            confidence = min(0.98, 0.72 + dark_ratio / 2)
        elif mean_intensity < 118:
            classification = Classification.suspicious
            confidence = 0.68
        else:
            classification = Classification.negative
            confidence = min(0.96, 0.76 + (mean_intensity - 118) / 500)
        return ModelPrediction(
            classification=classification,
            confidence=confidence,
            model_version=self.settings.active_model_version,
            model_type="heuristic",
        )


class ArtifactModelAdapter:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        if not settings.active_model_path.exists():
            raise FileNotFoundError(f"Active model artefact not found: {settings.active_model_path}")

    def predict(self, image_path: str | Path) -> ModelPrediction:
        return HeuristicModelAdapter(self.settings).predict(image_path)


def get_model_adapter(settings: Settings | None = None) -> HeuristicModelAdapter | ArtifactModelAdapter:
    settings = settings or get_settings()
    if settings.inference_mode == "artifact":
        return ArtifactModelAdapter(settings)
    return HeuristicModelAdapter(settings)
