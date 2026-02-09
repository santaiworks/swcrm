from sqlalchemy import Column, String, DateTime, UUID, Float, Integer

from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # Loosening FK constraints for initial migration as profiles/branches might not exist in swcrm yet
    branch_id = Column(UUID(as_uuid=True), nullable=True) 
    owner_id = Column(UUID(as_uuid=True), nullable=True)

    # Person Details
    salutation = Column(String, nullable=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=True)
    job_title = Column(String, nullable=True)
    department = Column(String, nullable=True)

    # Contact Details
    email = Column(String, nullable=True)
    mobile_no = Column(String, nullable=True)
    gender = Column(String, nullable=True)

    # Company Details
    organization = Column(String, nullable=True)
    website = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    no_employees = Column(String, nullable=True)
    source = Column(String, nullable=True)

    # Status
    status = Column(String, nullable=False, default='New')

    # Opportunity Fields
    estimated_revenue = Column(Float, nullable=True) # Perkiraan Omzet
    probability = Column(Integer, nullable=True) # Probability (percentage)
    closing_date = Column(DateTime(timezone=True), nullable=True) # Perkiraan Closing Date for Deals



    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)
