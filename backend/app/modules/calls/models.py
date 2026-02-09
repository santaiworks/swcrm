from sqlalchemy import Column, String, DateTime, UUID, Text, Integer
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class Call(Base):
    __tablename__ = "calls"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    subject = Column(String, nullable=False)
    notes = Column(Text, nullable=True)
    duration = Column(String, nullable=True) # e.g. "5:00"
    duration_seconds = Column(Integer, nullable=True)
    status = Column(String, default="Completed") # Planned, Completed, Missed
    call_type = Column(String, default="Incoming")
    to_contact = Column(String, nullable=True)
    from_contact = Column(String, nullable=True)
    received_by = Column(String, nullable=True)
    
    entity_type = Column(String, nullable=True)
    entity_id = Column(UUID(as_uuid=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
