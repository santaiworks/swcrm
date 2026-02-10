from pydantic import BaseModel
from typing import Optional
import uuid

class MasterDataCreate(BaseModel):
    name: str

class MasterDataResponse(BaseModel):
    id: uuid.UUID
    name: str
    icon: Optional[str] = None
    color: Optional[str] = None
    class Config:
        from_attributes = True
