"""from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Report
from schemas import ReportCreate, ReportResponse
from routers.dependencies import get_current_user


router = APIRouter()

@router.post("/", response_model=ReportResponse)
def create_report(
    report: ReportCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    new_report = Report(
        user_id=user.id,
        location=report.location,
        description=report.description,
        water_source=report.water_source,
        photo_url=report.photo_url
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report
@router.get("/me", response_model=list[ReportResponse])
def get_my_reports(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return db.query(Report).filter(Report.user_id == user.id).all()
@router.get("/", response_model=list[ReportResponse])
def get_all_reports(db: Session = Depends(get_db)):
    return db.query(Report).all() """
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Report, ReportStatus
from schemas import ReportCreate, ReportResponse
from routers.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=ReportResponse)
def create_report(
    report: ReportCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    new_report = Report(
        user_id=user.id,
        location=report.location,
        latitude=report.latitude,
        longitude=report.longitude,
        description=report.description,
        water_source=report.water_source,
        photo_url=report.photo_url,
        status="pending"
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

@router.get("/me", response_model=list[ReportResponse])
def get_my_reports(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    return db.query(Report).filter(Report.user_id == user.id).all()

@router.get("/", response_model=list[ReportResponse])
def get_all_reports(db: Session = Depends(get_db)):
    return db.query(Report).all()

@router.put("/{report_id}/status", response_model=ReportResponse)
def update_report_status(
    report_id: int,
    status: str,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    report.status = status
    db.commit()
    db.refresh(report)
    return report
