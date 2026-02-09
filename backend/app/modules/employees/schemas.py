from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class EmployeeBase(BaseModel):
    nik: str
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    join_date: Optional[date] = None

class EmployeeCreate(EmployeeBase):
    user_id: int

class EmployeeUpdate(BaseModel):
    nik: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    join_date: Optional[date] = None

class EmployeeResponse(EmployeeBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
