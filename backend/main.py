from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import text

from database import SessionLocal
from routers.auth import router as auth_router

from routers.reports import router as reports_router
from routers.stations import router as stations_router
from routers.alerts import router as alerts_router
from routers.collaborations import router as collaborations_router
from routers.predictive_alerts import router as predictive_alerts_router

app = FastAPI(title="Water Quality Monitor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Water Quality Monitor API running"}

@app.get("/test-db")
def test_db():
    db = SessionLocal()
    try:
        db.execute(text("SELECT 1"))
        return {"status": "Database connected successfully"}
    finally:
        db.close()



app.include_router(auth_router)
app.include_router(reports_router, prefix="/reports")
app.include_router(stations_router, prefix="/stations")
app.include_router(alerts_router, prefix="/alerts")
app.include_router(collaborations_router, prefix="/collaborations")
app.include_router(predictive_alerts_router, prefix="/predict")
