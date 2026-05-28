import pytest
from pathlib import Path
from hooks.dataset_hook import resolve_dataset_root


def test_resolve_dataset_root_valid(tmp_path: Path):
    result = resolve_dataset_root(str(tmp_path))
    assert result == tmp_path.resolve()


def test_resolve_dataset_root_missing():
    with pytest.raises(FileNotFoundError):
        resolve_dataset_root("/nonexistent/path/abc123")
