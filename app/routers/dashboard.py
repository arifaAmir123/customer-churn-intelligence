from fastapi import APIRouter
import pandas as pd

from app.config import BASE_DIR
from app.model_service import model_service

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


DATA_PATH = (
    BASE_DIR
    / "data"
    / "processed"
    / "customer_churn_eda.csv"
)


def load_data():
    return pd.read_csv(DATA_PATH)


@router.get("/summary")
def dashboard_summary():

    df = load_data()

    total_customers = len(df)

    churned = int(
        (df["Churn"] == "Yes").sum()
    )

    active = int(
        (df["Churn"] == "No").sum()
    )

    churn_rate = (
        churned / total_customers
        if total_customers > 0
        else 0
    )

    return {
        "total_customers": total_customers,
        "churned_customers": churned,
        "active_customers": active,
        "churn_rate": round(
            churn_rate * 100, 2
        ),
        "average_monthly_charges": round(
            float(df["MonthlyCharges"].mean()),
            2
        ),
        "average_tenure": round(
            float(df["tenure"].mean()),
            2
        ),
    }


@router.get("/churn-by-contract")
def churn_by_contract():

    df = load_data()

    result = (
        df.groupby("Contract")["Churn"]
        .apply(
            lambda x: round(
                (x == "Yes").mean() * 100,
                2
            )
        )
        .reset_index()
    )

    result.columns = [
        "contract",
        "churn_rate"
    ]

    return result.to_dict(
        orient="records"
    )


@router.get("/churn-by-tenure")
def churn_by_tenure():

    df = load_data()

    df["TenureGroup"] = pd.cut(
        df["tenure"],
        bins=[-1, 12, 24, 48, 72],
        labels=[
            "0-12 months",
            "13-24 months",
            "25-48 months",
            "49-72 months"
        ]
    )

    result = (
        df.groupby(
            "TenureGroup",
            observed=True
        )["Churn"]
        .apply(
            lambda x: round(
                (x == "Yes").mean() * 100,
                2
            )
        )
        .reset_index()
    )

    result.columns = [
        "tenure_group",
        "churn_rate"
    ]

    return result.to_dict(
        orient="records"
    )



@router.get("/risk-customers")
def risk_customers():

    df = load_data()

    # ============================================
    # CUSTOMER IDs
    # ============================================

    customer_ids = df["customerID"].tolist()

    # ============================================
    # PREPARE FEATURES
    # ============================================

    features = df.drop(
        columns=["customerID", "Churn"],
        errors="ignore"
    ).copy()

    # ============================================
    # RECREATE TRAINING-TIME FEATURE
    # ============================================

    if "TotalChargesMissing" not in features.columns:

        features["TotalChargesMissing"] = (
            features["TotalCharges"]
            .isna()
            .astype(int)
        )

    # ============================================
    # HANDLE MISSING TOTAL CHARGES
    # ============================================

    features["TotalCharges"] = (
        features["TotalCharges"]
        .fillna(0)
    )

    # ============================================
    # MODEL PREDICTION
    # ============================================

    probabilities = (
        model_service.model
        .predict_proba(features)[:, 1]
    )

    predictions = (
        probabilities >= model_service.threshold
    ).astype(int)

    # ============================================
    # BUILD RESULT
    # ============================================

    result = pd.DataFrame({

        "customerID":
            customer_ids,

        "MonthlyCharges":
            df["MonthlyCharges"].values,

        "TotalCharges":
            df["TotalCharges"].fillna(0).values,

        "tenure":
            df["tenure"].values,

        "churn_probability":
            probabilities,

        "churn_prediction":
            predictions

    })

    # ============================================
    # RISK LEVEL
    # ============================================

    result["risk_level"] = (
        result["churn_probability"]
        .apply(
            model_service.get_risk_level
        )
    )

    # ============================================
    # RETENTION ACTION
    # ============================================

    result["retention_action"] = (
        result["churn_probability"]
        .apply(
            model_service.get_retention_action
        )
    )

    # ============================================
    # SORT HIGHEST RISK FIRST
    # ============================================

    result = result.sort_values(
        "churn_probability",
        ascending=False
    )

    # ============================================
    # ROUND VALUES
    # ============================================

    result["churn_probability"] = (
        result["churn_probability"]
        .round(4)
    )

    result["MonthlyCharges"] = (
        result["MonthlyCharges"]
        .round(2)
    )

    result["TotalCharges"] = (
        result["TotalCharges"]
        .round(2)
    )

    return result.to_dict(
        orient="records"
    )