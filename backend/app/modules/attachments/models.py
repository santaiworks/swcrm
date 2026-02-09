from sqlalchemy import Column, String, DateTime, UUID, Boolean, Text
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class Attachment(Base):
    __tablename__ = "attachments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    file_path = Column(String, nullable=False)
    file_name = Column(String, nullable=False)
    file_type = Column(String, nullable=True)
    is_public = Column(Boolean, default=False)
    description = Column(Text, nullable=True)
    
    entity_type = Column(String, nullable=False) # LEAD, DEAL, etc.
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    
    uploaded_by = Column(String, nullable=True) # User ID or Name
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
