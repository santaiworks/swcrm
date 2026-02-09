from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    nik = Column(String, unique=True, index=True, nullable=False) # Employee identification number
    phone = Column(String, nullable=True)
    department = Column(String, nullable=True)
    position = Column(String, nullable=True)
    join_date = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("app.modules.auth.models.User", backref="employee", uselist=False)
