from sqlalchemy import Column, Integer, String
from app.core.database import Base
import enum

class CurrencyEnum(str, enum.Enum):
    USD = "USD"
    IDR = "IDR"

class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True) # Singleton, ID=1 always
    app_name = Column(String, default="SantaiWorks CRM")
    company_name = Column(String, default="SantaiWorks")
    currency = Column(String, default="IDR") # Stored as string for flexibility, validated by enum in schema
