from sqlalchemy import Column, String, DateTime, UUID, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships to master data
    status_id = Column(UUID(as_uuid=True), ForeignKey("master_task_status.id"), nullable=True)
    priority_id = Column(UUID(as_uuid=True), ForeignKey("master_task_priority.id"), nullable=True)
    
    status_rel = relationship("MasterTaskStatus")
    priority_rel = relationship("MasterTaskPriority")
    
    entity_type = Column(String, nullable=True) # e.g., 'LEAD', 'DEAL'
    entity_id = Column(UUID(as_uuid=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    @property
    def status(self):
        return self.status_rel.name if self.status_rel else None

    @property
    def priority(self):
        return self.priority_rel.name if self.priority_rel else None
