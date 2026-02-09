from sqlalchemy.orm import Session
from .models import Activity

class ActivityService:
    @staticmethod
    def log_activity(
        db: Session,
        action_type: str,
        entity_type: str,
        entity_id: str,
        description: str,
        user_id: int = None
    ):
        activity = Activity(
            action_type=action_type,
            entity_type=entity_type,
            entity_id=str(entity_id),
            description=description,
            user_id=user_id
        )
        db.add(activity)
        db.commit()
        db.refresh(activity)
        return activity
    @staticmethod
    def get_activities(db: Session, entity_type: str, entity_id: str):
        return db.query(Activity).filter(
            Activity.entity_type == entity_type,
            Activity.entity_id == entity_id
        ).order_by(Activity.created_at.desc()).all()
