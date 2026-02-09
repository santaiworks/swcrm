from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import Optional

class NoteBase(BaseModel):
    content: str
    entity_type: str
    entity_id: UUID4

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    content: Optional[str] = None
    entity_type: Optional[str] = None
    entity_id: Optional[UUID4] = None

class NoteResponse(NoteBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
