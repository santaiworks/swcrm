from pydantic import BaseModel
from typing import Optional
from enum import Enum

class CurrencyEnum(str, Enum):
    USD = "USD"
    IDR = "IDR"

class SettingsBase(BaseModel):
    app_name: Optional[str] = "SantaiWorks CRM"
    company_name: Optional[str] = "SantaiWorks"
    currency: Optional[CurrencyEnum] = CurrencyEnum.IDR

class SettingsCreate(SettingsBase):
    pass

class SettingsUpdate(SettingsBase):
    pass

class SettingsResponse(SettingsBase):
    id: int

    class Config:
        from_attributes = True
