from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import Optional

class AttachmentBase(BaseModel):
    file_name: str
    file_type: Optional[str] = None
    is_public: bool = False
    entity_type: str
    entity_id: UUID4
    description: Optional[str] = None

class AttachmentCreate(AttachmentBase):
    file_path: str
    uploaded_by: Optional[str] = None

class AttachmentResponse(AttachmentBase):
    id: UUID4
    file_path: str
    created_at: datetime
    uploaded_by: Optional[str] = None

    class Config:
        from_attributes = True
