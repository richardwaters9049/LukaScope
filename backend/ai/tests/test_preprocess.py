from pathlib import Path
from functions.preprocess_images import preprocess_dataset


def test_preprocess_copies_images(tmp_path: Path):
    src = tmp_path / "input"
    src.mkdir()
    (src / "cell1.png").write_bytes(b"\x89PNG")
    (src / "cell2.jpg").write_bytes(b"\xff\xd8")

    out = tmp_path / "output"
    processed, skipped = preprocess_dataset(str(src), str(out))

    assert processed == 2
    assert skipped == 0
    assert (out / "cell1.png").exists()
    assert (out / "cell2.jpg").exists()


def test_preprocess_skips_non_images(tmp_path: Path):
    src = tmp_path / "input"
    src.mkdir()
    (src / "notes.txt").write_text("hello")
    (src / "data.csv").write_text("a,b")

    out = tmp_path / "output"
    processed, skipped = preprocess_dataset(str(src), str(out))

    assert processed == 0
    assert skipped == 2


def test_preprocess_empty_directory(tmp_path: Path):
    src = tmp_path / "empty"
    src.mkdir()
    out = tmp_path / "output"

    processed, skipped = preprocess_dataset(str(src), str(out))

    assert processed == 0
    assert skipped == 0
