from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_DIR = BASE_DIR / "models"

MODEL_PATH = MODEL_DIR / "churn_model.joblib"
THRESHOLD_PATH = MODEL_DIR / "threshold.json"
FEATURE_NAMES_PATH = MODEL_DIR / "feature_names.json"