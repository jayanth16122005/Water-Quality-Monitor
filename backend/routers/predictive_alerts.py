from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from database import get_db
from models import User, Alert, StationReading
from routers.dependencies import get_current_user

router = APIRouter()

def analyze_water_quality_trends(db: Session, station_id: int, lookback_days: int = 7):
    """
    Analyze historical water quality data to identify trends and predict alerts.
    Returns a list of predicted alerts based on threshold violations.
    """
    from datetime import datetime, timedelta
    
    # Get readings from the past N days
    start_date = datetime.utcnow() - timedelta(days=lookback_days)
    readings = db.query(StationReading).filter(
        StationReadings.station_id == station_id,
        StationReadings.recorded_at >= start_date
    ).order_by(StationReadings.recorded_at).all()
    
    if not readings:
        return []
    
    predicted_alerts = []
    
    # Define thresholds based on water quality standards
    thresholds = {
        'pH': {'min': 6.5, 'max': 8.5, 'severity': 'medium'},
        'dissolved_oxygen': {'min': 5.0, 'max': None, 'severity': 'high'},
        'turbidity': {'max': 5.0, 'severity': 'medium'},
        'lead': {'max': 0.015, 'severity': 'critical'},
        'arsenic': {'max': 0.01, 'severity': 'critical'}
    }
    
    # Check each parameter for violations
    for param, threshold in thresholds.items():
        param_readings = [r for r in readings if hasattr(r, param)]
        
        if not param_readings:
            continue
        
        values = [float(getattr(r, param)) for r in param_readings if getattr(r, param) is not None]
        
        if not values:
            continue
        
        # Calculate trend (is it getting worse?)
        recent_values = values[-3:] if len(values) >= 3 else values
        older_values = values[:max(1, len(values) - 3)]
        
        recent_avg = sum(recent_values) / len(recent_values)
        older_avg = sum(older_values) / len(older_values)
        
        # Check for violations
        violation_detected = False
        alert_message = ""
        
        if 'min' in threshold and recent_avg < threshold['min']:
            violation_detected = True
            alert_message = f"{param} level is critically low ({recent_avg:.2f}), below minimum threshold ({threshold['min']})"
        
        if 'max' in threshold and recent_avg > threshold['max']:
            violation_detected = True
            alert_message = f"{param} level is critically high ({recent_avg:.2f}), above maximum threshold ({threshold['max']})"
        
        # Check for negative trend (getting worse)
        if violation_detected or (recent_avg != older_avg and abs(recent_avg - older_avg) / older_avg > 0.2):
            if not violation_detected:
                trend_direction = "increasing" if recent_avg > older_avg else "decreasing"
                alert_message = f"{param} showing concerning {trend_direction} trend (was {older_avg:.2f}, now {recent_avg:.2f})"
            
            predicted_alerts.append({
                'parameter': param,
                'message': alert_message,
                'severity': threshold['severity'],
                'threshold': threshold,
                'recent_value': recent_avg,
                'trend': 'worsening' if recent_avg > older_avg else 'improving'
            })
    
    return predicted_alerts

@router.get("/analyze/{station_id}")
def analyze_station(
    station_id: int,
    lookback_days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Analyze water quality trends for a specific station and return predicted alerts.
    Available to all authenticated users.
    """
    predicted_alerts = analyze_water_quality_trends(db, station_id, lookback_days)
    
    return {
        "station_id": station_id,
        "lookback_days": lookback_days,
        "predicted_alerts": predicted_alerts,
        "alert_count": len(predicted_alerts),
        "analysis_timestamp": datetime.utcnow()
    }

@router.post("/auto-predict")
def auto_predict_and_create_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Automatically analyze all stations and create alerts for critical predictions.
    Only accessible to authority users.
    """
    if current_user.role != "authority":
        raise HTTPException(status_code=403, detail="Only authorities can create predictive alerts")
    
    from models import Station
    
    all_stations = db.query(Station).all()
    created_alerts = []
    
    for station in all_stations:
        predicted_alerts = analyze_water_quality_trends(db, station.id, lookback_days=7)
        
        # Create actual alerts for critical predictions
        for prediction in predicted_alerts:
            # Check if similar alert already exists (within last 24 hours)
            existing = db.query(Alert).filter(
                Alert.location == station.name,
                Alert.is_active == True,
                Alert.created_at >= datetime.utcnow() - timedelta(hours=24)
            ).first()
            
            if not existing and prediction['severity'] in ['high', 'critical']:
                alert = Alert(
                    type="contamination",
                    message=prediction['message'],
                    location=station.name,
                    latitude=station.latitude,
                    longitude=station.longitude,
                    severity=prediction['severity'],
                    is_active=True
                )
                db.add(alert)
                created_alerts.append({
                    'location': station.name,
                    'message': prediction['message'],
                    'severity': prediction['severity']
                })
        
        db.commit()
    
    return {
        "analysis_timestamp": datetime.utcnow(),
        "stations_analyzed": len(all_stations),
        "alerts_created": len(created_alerts),
        "alerts": created_alerts
    }

@router.get("/trends/{station_id}")
def get_water_quality_trends(
    station_id: int,
    lookback_days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get detailed water quality trend analysis with predictions.
    Shows historical data and predictive insights.
    """
    from models import Station
    
    station = db.query(Station).filter(Station.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    
    # Get historical readings
    start_date = datetime.utcnow() - timedelta(days=lookback_days)
    readings = db.query(StationReading).filter(
        StationReadings.station_id == station_id,
        StationReadings.recorded_at >= start_date
    ).order_by(StationReadings.recorded_at).all()
    
    # Calculate statistics
    params = ['pH', 'dissolved_oxygen', 'turbidity', 'lead', 'arsenic']
    statistics = {}
    
    for param in params:
        values = [getattr(r, param) for r in readings if getattr(r, param) is not None]
        if values:
            statistics[param] = {
                'min': min(values),
                'max': max(values),
                'avg': sum(values) / len(values),
                'latest': values[-1] if values else None,
                'data_points': len(values)
            }
    
    # Get predictions
    predictions = analyze_water_quality_trends(db, station_id, lookback_days)
    
    return {
        "station": {
            "id": station.id,
            "name": station.name,
            "location": station.location
        },
        "statistics": statistics,
        "predictions": predictions,
        "critical_alerts": len([p for p in predictions if p['severity'] == 'critical']),
        "warning_alerts": len([p for p in predictions if p['severity'] == 'high']),
        "analysis_period_days": lookback_days
    }
