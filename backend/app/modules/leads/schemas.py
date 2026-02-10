from pydantic import BaseModel, computed_field
from typing import Optional, Union, Any
import uuid
from datetime import datetime

class LeadCreate(BaseModel):
    # ... existing fields ...
    first_name: str
    last_name: Optional[str] = None
    email: Optional[str] = None
    mobile_no: Optional[str] = None
    status: Optional[uuid.UUID] = None 
    salutation: Optional[uuid.UUID] = None
    job_title: Optional[str] = None
    department: Optional[str] = None
    organization: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[uuid.UUID] = None
    no_employees: Optional[uuid.UUID] = None
    source: Optional[uuid.UUID] = None
    gender: Optional[str] = None
    
    # Opportunity Fields
    estimated_revenue: Optional[float] = None
    probability: Optional[Union[int, str]] = None
    closing_date: Optional[Union[str, datetime]] = None 

    # Mocking these for now since auth isn't fully migrated
    branch_id: Optional[uuid.UUID] = None
    owner_id: Optional[uuid.UUID] = None

class LeadResponse(LeadCreate):
    id: uuid.UUID
    created_at: Any
    status_label: Optional[str] = None
    
    class Config:
        from_attributes = True
