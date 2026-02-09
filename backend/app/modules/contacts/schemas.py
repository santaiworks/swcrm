from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

class ContactBase(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    email: Optional[str] = None
    mobile_no: Optional[str] = None
    job_title: Optional[str] = None
    department: Optional[str] = None
    organization: Optional[str] = None
    organization_id: Optional[uuid.UUID] = None
    lead_id: Optional[uuid.UUID] = None

class ContactCreate(ContactBase):
    pass

class ContactUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    mobile_no: Optional[str] = None
    job_title: Optional[str] = None
    department: Optional[str] = None
    organization: Optional[str] = None
    organization_id: Optional[uuid.UUID] = None
    lead_id: Optional[uuid.UUID] = None

class ContactResponse(ContactBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
