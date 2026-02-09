from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class MasterIndustry(Base):
    __tablename__ = "master_industries"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MasterSource(Base):
    __tablename__ = "master_sources"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MasterSalutation(Base):
    __tablename__ = "master_salutations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MasterEmployeeCount(Base):
    __tablename__ = "master_employee_counts"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MasterLeadStatus(Base):
    __tablename__ = "master_lead_status"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    color = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
