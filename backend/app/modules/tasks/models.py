from sqlalchemy import Column, String, DateTime, UUID, Text
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(DateTime(timezone=True), nullable=True)
    priority = Column(String, default="Medium") # Low, Medium, High
    status = Column(String, default="Pending") # Pending, In Progress, Completed
    
    entity_type = Column(String, nullable=True)
    entity_id = Column(UUID(as_uuid=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
