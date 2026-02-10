from sqlalchemy import Column, String, DateTime, UUID
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class MasterIndustry(Base):
    __tablename__ = "master_industries"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MasterSource(Base):
    __tablename__ = "master_sources"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MasterSalutation(Base):
    __tablename__ = "master_salutations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MasterEmployeeCount(Base):
    __tablename__ = "master_employee_counts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MasterLeadStatus(Base):
    __tablename__ = "master_lead_status"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, index=True, nullable=False)
    color = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MasterTaskStatus(Base):
    __tablename__ = "master_task_status"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, index=True, nullable=False)
    icon = Column(String, nullable=True) # Lucide icon name
    color = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MasterTaskPriority(Base):
    __tablename__ = "master_task_priority"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, index=True, nullable=False)
    color = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
