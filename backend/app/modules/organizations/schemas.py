from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import uuid

class OrganizationBase(BaseModel):
    name: str
    website: Optional[str] = None
    industry: Optional[uuid.UUID] = None
    no_employees: Optional[uuid.UUID] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[uuid.UUID] = None
    no_employees: Optional[uuid.UUID] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None

class OrganizationResponse(OrganizationBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    industry_label: Optional[str] = None
    no_employees_label: Optional[str] = None

    class Config:
        from_attributes = True
