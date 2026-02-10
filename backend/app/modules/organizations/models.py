from sqlalchemy import Column, String, DateTime, UUID, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, index=True)
    website = Column(String, nullable=True)
    industry = Column(UUID(as_uuid=True), ForeignKey("master_industries.id"), nullable=True)
    no_employees = Column(UUID(as_uuid=True), ForeignKey("master_employee_counts.id"), nullable=True)
    
    # Address (optional)
    address = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    industry_rel = relationship("MasterIndustry", lazy="joined")
    no_employees_rel = relationship("MasterEmployeeCount", lazy="joined")

    @property
    def industry_label(self):
        return self.industry_rel.name if self.industry_rel else None

    @property
    def no_employees_label(self):
        return self.no_employees_rel.name if self.no_employees_rel else None
