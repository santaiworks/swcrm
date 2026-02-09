from pydantic import BaseModel, UUID4, EmailStr
from datetime import datetime
from typing import Optional

class EmailBase(BaseModel):
    to: EmailStr
    subject: str
    body: str
    status: str = "Sent"
    entity_type: str
    entity_id: UUID4

class EmailCreate(EmailBase):
    sent_by: Optional[str] = None

class EmailResponse(EmailBase):
    id: UUID4
    sent_at: datetime
    sent_by: Optional[str] = None

    class Config:
        from_attributes = True
