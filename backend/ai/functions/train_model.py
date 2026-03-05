"""Training entrypoint scaffold for LukaScope leukemia models.

Expected next step: integrate PyTorch/Ultralytics training pipeline and model
tracking (metrics + checkpoints).
"""

from hooks.dataset_hook import resolve_dataset_root
from functions.preprocess_images import preprocess_dataset


def main() -> None:
    dataset_root = resolve_dataset_root("./datasets")
    processed, skipped = preprocess_dataset(str(dataset_root), "./artifacts/preprocessed")

    print("[LukaScope AI] preprocessing complete")
    print(f"processed={processed} skipped={skipped}")
    print("next: plug in training loop and checkpoint export")


if __name__ == "__main__":
    main()
