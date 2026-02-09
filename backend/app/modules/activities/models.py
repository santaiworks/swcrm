from sqlalchemy import Column, String, DateTime, Integer, UUID
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    action_type = Column(String, nullable=False) # e.g., "CREATE", "UPDATE", "DELETE", "CONVERT"
    entity_type = Column(String, nullable=False) # e.g., "LEAD", "DEAL"
    entity_id = Column(String, nullable=False)
    description = Column(String, nullable=True)
    
    user_id = Column(Integer, nullable=True) # Linked to User.id (if available)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
