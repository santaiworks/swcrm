from fastapi import APIRouter, Depends
from app.core.database import get_db
from sqlalchemy.orm import Session
from app.modules.settings.schemas import SettingsUpdate, SettingsResponse
from app.modules.settings.services import SettingsService

router = APIRouter()

@router.get("", response_model=SettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    settings = SettingsService.get_settings(db)
    return settings

@router.put("", response_model=SettingsResponse)
def update_settings(settings: SettingsUpdate, db: Session = Depends(get_db)):
    updated_settings = SettingsService.update_settings(db, settings)
    return updated_settings
