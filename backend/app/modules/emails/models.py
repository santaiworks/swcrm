from sqlalchemy import Column, String, DateTime, UUID, Text
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class EmailLog(Base):
    __tablename__ = "email_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    to = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    status = Column(String, default="Sent") # Sent, Failed, Draft
    
    entity_type = Column(String, nullable=False) # LEAD, DEAL
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    
    sent_by = Column(String, nullable=True)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
