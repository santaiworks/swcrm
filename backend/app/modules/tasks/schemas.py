from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import Optional
import uuid

class MasterTaskStatusResponse(BaseModel):
    id: uuid.UUID
    name: str
    icon: Optional[str] = None
    color: Optional[str] = None
    class Config:
        from_attributes = True

class MasterTaskPriorityResponse(BaseModel):
    id: uuid.UUID
    name: str
    color: Optional[str] = None
    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status_id: Optional[UUID4] = None
    priority_id: Optional[UUID4] = None
    entity_type: Optional[str] = None
    entity_id: Optional[UUID4] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status_id: Optional[UUID4] = None
    priority_id: Optional[UUID4] = None
    entity_type: Optional[str] = None
    entity_id: Optional[UUID4] = None

class TaskResponse(TaskBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime
    
    # Label versions of status/priority for simple use
    status: Optional[str] = None
    priority: Optional[str] = None
    
    # Full objects if needed
    status_rel: Optional[MasterTaskStatusResponse] = None
    priority_rel: Optional[MasterTaskPriorityResponse] = None

    class Config:
        from_attributes = True
