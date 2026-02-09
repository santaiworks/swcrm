from sqlalchemy import Column, String, DateTime, UUID, Text
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class Note(Base):
    __tablename__ = "notes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(Text, nullable=False)
    
    # Polymorphic link
    entity_type = Column(String, nullable=False) # LEAD, DEAL, CONTACT, ORGANIZATION
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    
    created_by = Column(UUID(as_uuid=True), nullable=True) # User ID if auth enabled
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
