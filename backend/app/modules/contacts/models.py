from sqlalchemy import Column, String, DateTime, UUID, ForeignKey
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class Contact(Base):
    __tablename__ = "contacts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # Optional link to a Lead if converted
    lead_id = Column(UUID(as_uuid=True), nullable=True) 
    
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    mobile_no = Column(String, nullable=True)
    job_title = Column(String, nullable=True)
    department = Column(String, nullable=True)
    organization = Column(String, nullable=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
