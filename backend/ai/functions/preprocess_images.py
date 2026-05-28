"""Preprocessing utility for blood smear images.

This is a minimal scaffold to keep preprocessing logic in one place.
"""

from pathlib import Path

SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".tif", ".tiff"}


def preprocess_dataset(input_dir: str, output_dir: str) -> tuple[int, int]:
    source = Path(input_dir).expanduser().resolve()
    target = Path(output_dir).expanduser().resolve()
    target.mkdir(parents=True, exist_ok=True)

    processed = 0
    skipped = 0

    for image_path in source.rglob("*"):
        if not image_path.is_file():
            continue

        if image_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            skipped += 1
            continue

        # Placeholder: add stain normalization / augmentation pipeline here.
        destination = target / image_path.name
        destination.write_bytes(image_path.read_bytes())
        processed += 1

    return processed, skipped
