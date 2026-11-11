import json
import joblib
import pandas as pd

from app.config import (
    MODEL_PATH,
    THRESHOLD_PATH,
)


class ChurnModelService:

    def __init__(self):
        self.model = joblib.load(MODEL_PATH)

        with open(THRESHOLD_PATH, "r") as f:
            config = json.load(f)

        self.threshold = config["production_threshold"]

    # ============================================
    # PREDICTION
    # ============================================

    def predict(self, data):

        # Convert incoming data to DataFrame
        df = pd.DataFrame([data])

        # ============================================
        # RECREATE TRAINING-TIME FEATURE
        # ============================================

        if "TotalChargesMissing" not in df.columns:
            df["TotalChargesMissing"] = (
                df["TotalCharges"].isna().astype(int)
            )

        # Replace missing TotalCharges with 0
        df["TotalCharges"] = df["TotalCharges"].fillna(0)

        # ============================================
        # MODEL PREDICTION
        # ============================================

        probability = self.model.predict_proba(df)[0][1]

        prediction = int(
            probability >= self.threshold
        )

        # ============================================
        # RISK LEVEL
        # ============================================

        risk_level = self.get_risk_level(
            probability
        )

        # ============================================
        # RETENTION ACTION
        # ============================================

        retention_action = self.get_retention_action(
            probability
        )

        # ============================================
        # RESPONSE
        # ============================================

        return {
            "churn_probability": round(
                float(probability), 4
            ),
            "churn_prediction": prediction,
            "risk_level": risk_level,
            "retention_action": retention_action,
        }

    # ============================================
    # RISK LEVEL
    # ============================================

    @staticmethod
    def get_risk_level(probability: float):

        if probability >= 0.70:
            return "High"

        if probability >= 0.40:
            return "Medium"

        return "Low"

    # ============================================
    # RETENTION ACTION
    # ============================================

    @staticmethod
    def get_retention_action(probability: float):

        if probability >= 0.70:
            return (
                "Immediate retention intervention"
            )

        if probability >= 0.40:
            return (
                "Proactive retention campaign"
            )

        return (
            "Continue regular engagement"
        )


model_service = ChurnModelService()