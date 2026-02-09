from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import Optional

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[str] = "Medium"
    status: Optional[str] = "Pending"
    entity_type: Optional[str] = None
    entity_id: Optional[UUID4] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    entity_type: Optional[str] = None
    entity_id: Optional[UUID4] = None

class TaskResponse(TaskBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
