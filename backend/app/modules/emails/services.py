from sqlalchemy.orm import Session
from .models import EmailLog
from .schemas import EmailCreate

class EmailService:
    @staticmethod
    def send_email(db: Session, email: EmailCreate):
        # Mock sending email
        print(f"Sending email to {email.to} with subject '{email.subject}'")
        
        db_email = EmailLog(**email.dict())
        db.add(db_email)
        db.commit()
        db.refresh(db_email)
        return db_email

    @staticmethod
    def get_emails(db: Session, entity_type: str, entity_id: str):
        return db.query(EmailLog).filter(
            EmailLog.entity_type == entity_type,
            EmailLog.entity_id == entity_id
        ).order_by(EmailLog.sent_at.desc()).all()
