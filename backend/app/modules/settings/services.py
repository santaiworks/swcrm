from sqlalchemy.orm import Session
from .models import Settings
from .schemas import SettingsUpdate

class SettingsService:
    @staticmethod
    def get_settings(db: Session):
        settings = db.query(Settings).first()
        if not settings:
            # Create default settings if not exists
            settings = Settings(id=1, app_name="SantaiWorks CRM", company_name="SantaiWorks", currency="IDR")
            db.add(settings)
            db.commit()
            db.refresh(settings)
        return settings

    @staticmethod
    def update_settings(db: Session, settings_update: SettingsUpdate):
        settings = SettingsService.get_settings(db)
        
        if settings_update.app_name is not None:
            settings.app_name = settings_update.app_name
        if settings_update.company_name is not None:
            settings.company_name = settings_update.company_name
        if settings_update.currency is not None:
            settings.currency = settings_update.currency.value
            
        db.commit()
        db.refresh(settings)
        return settings
