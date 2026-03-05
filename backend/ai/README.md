# AI Training (Python)

This directory contains the Python training side of LukaScope.

## Structure

- `hooks/`: dataset hooks and source-specific loading logic
- `functions/`: reusable preprocessing/training functions
- `requirements.txt`: Python packages for model training

## Planned Workflow

1. Ingest leukemia datasets (C-NMC 2019, ALL-IDB, Raabin-WBC)
2. Normalize/preprocess blood smear images
3. Train detection/classification models in Python (PyTorch/Ultralytics)
4. Evaluate recall/sensitivity-first metrics for earlier suspicious-case flagging
5. Export model artifacts for backend inference integration

## Quick Start

```bash
cd backend/ai
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python functions/train_model.py
```

