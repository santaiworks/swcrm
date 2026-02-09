from sqlalchemy import Column, String, DateTime, UUID
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, index=True)
    website = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    no_employees = Column(String, nullable=True)
    
    # Address (optional)
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
