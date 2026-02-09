from pydantic import BaseModel
from typing import Optional
import uuid

class LeadCreate(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    email: Optional[str] = None
    mobile_no: Optional[str] = None
    status: str = 'New'
    # ... Add other fields as needed
    salutation: Optional[str] = None
    job_title: Optional[str] = None
    department: Optional[str] = None
    organization: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    no_employees: Optional[str] = None
    source: Optional[str] = None
    gender: Optional[str] = None
    
    # Opportunity Fields
    estimated_revenue: Optional[float] = None
    probability: Optional[int] = None
    closing_date: Optional[str] = None # ISO format string for dates


    
    # Mocking these for now since auth isn't fully migrated
    branch_id: Optional[uuid.UUID] = None
    owner_id: Optional[uuid.UUID] = None

class LeadResponse(LeadCreate):
    id: uuid.UUID
    created_at: str
    
    class Config:
        from_attributes = True
