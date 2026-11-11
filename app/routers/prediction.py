from fastapi import APIRouter

from app.schemas import CustomerPredictionRequest
from app.model_service import model_service


router = APIRouter(
    prefix="/predict",
    tags=["Prediction"]
)


@router.post("/")
def predict_churn(
    customer: CustomerPredictionRequest
):

    result = model_service.predict(
        customer.model_dump()
    )

    return result