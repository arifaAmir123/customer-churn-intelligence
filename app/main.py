from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path

from app.routers import health
from app.routers import prediction
from app.routers import dashboard


app = FastAPI(
    title="Customer Churn Intelligence API",
    description=(
        "Production-ready customer churn "
        "prediction and intelligence API."
    ),
    version="1.0.0",
)


# ============================================
# SERVE FRONTEND
# ============================================

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"


app.mount(
    "/frontend",
    StaticFiles(directory=str(FRONTEND_DIR)),
    name="frontend"
)


@app.get("/dashboard", include_in_schema=False)
def dashboard_page():
    return FileResponse(
        FRONTEND_DIR / "index.html"
    )


# ============================================
# API ROUTERS
# ============================================

app.include_router(
    dashboard.router
)

app.include_router(
    health.router
)

app.include_router(
    prediction.router
)


# ============================================
# API ROOT
# ============================================

@app.get("/")
def root():

    return {
        "message": "Customer Churn Intelligence API",
        "status": "running",
    }