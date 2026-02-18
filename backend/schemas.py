from pydantic import BaseModel, EmailStr
from enum import Enum

from typing import Optional
from datetime import datetime


class UserRole(str, Enum):
    user = "user"
    authority = "authority"



class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

    role: UserRole = UserRole.user


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: UserRole


    class Config:
        from_attributes = True



class LoginRequest(BaseModel):
    email: EmailStr
    password: str



class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ReportStatus(str, Enum):
    pending = "pending"
    verified = "verified"
    rejected = "rejected"


class ReportCreate(BaseModel):
    location: str
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    description: str
    water_source: str
    photo_url: Optional[str] = None


class ReportResponse(BaseModel):
    id: int
    user_id: int
    location: str
    latitude: Optional[str]
    longitude: Optional[str]
    description: str
    water_source: str
    photo_url: Optional[str]
    status: ReportStatus
    created_at: datetime

    class Config:
        from_attributes = True


class AlertType(str, Enum):
    boil_notice = "boil_notice"
    contamination = "contamination"
    outage = "outage"


class AlertCreate(BaseModel):
    type: AlertType
    message: str
    location: str
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    severity: str = "medium"


class AlertResponse(BaseModel):
    id: int
    type: AlertType
    message: str
    location: str
    latitude: Optional[str]
    longitude: Optional[str]
    severity: str
    issued_at: datetime
    resolved_at: Optional[datetime]
    is_active: str

    class Config:
        from_attributes = True


class CollaborationCreate(BaseModel):
    ngo_name: str
    project_name: str
    contact_email: EmailStr
    phone: Optional[str] = None
    location: str
    description: Optional[str] = None
    website: Optional[str] = None


class CollaborationResponse(BaseModel):
    id: int
    ngo_name: str
    project_name: str
    contact_email: str
    phone: Optional[str]
    location: str
    description: Optional[str]
    website: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
