from fastapi import APIRouter

from app.model_service import model_service


router = APIRouter(
    prefix="/health",
    tags=["Health"]
)


@router.get("/")
def health_check():

    return {
        "status": "healthy",
        "model_loaded": model_service.model is not None,
        "threshold": model_service.threshold,
    }