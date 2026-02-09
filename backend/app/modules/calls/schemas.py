from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import Optional

class CallBase(BaseModel):
    subject: Optional[str] = None
    notes: Optional[str] = None
    duration: Optional[str] = None
    duration_seconds: Optional[int] = 0
    status: Optional[str] = "Completed"
    call_type: Optional[str] = "Incoming"
    to_contact: Optional[str] = None
    from_contact: Optional[str] = None
    received_by: Optional[str] = None
    entity_type: Optional[str] = None
    entity_id: Optional[UUID4] = None

class CallCreate(CallBase):
    pass

class CallUpdate(BaseModel):
    subject: Optional[str] = None
    notes: Optional[str] = None
    duration: Optional[str] = None
    status: Optional[str] = None

class CallResponse(CallBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
