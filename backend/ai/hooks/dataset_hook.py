"""Dataset loading hooks used by the training scripts.

Hooks are kept separate so dataset-source logic can evolve without touching
core model training functions.
"""

from pathlib import Path


def resolve_dataset_root(dataset_root: str) -> Path:
    root = Path(dataset_root).expanduser().resolve()
    if not root.exists():
        raise FileNotFoundError(f"Dataset root not found: {root}")
    return root
