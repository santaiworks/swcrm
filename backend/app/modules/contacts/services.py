from sqlalchemy.orm import Session
from . import models, schemas
import uuid
from typing import List, Optional

class ContactService:
    @staticmethod
    def get_contact(db: Session, contact_id: uuid.UUID) -> Optional[models.Contact]:
        return db.query(models.Contact).filter(models.Contact.id == contact_id).first()

    @staticmethod
    def get_contacts(db: Session, skip: int = 0, limit: int = 100) -> List[models.Contact]:
        return db.query(models.Contact).offset(skip).limit(limit).all()

    @staticmethod
    def create_contact(db: Session, contact: schemas.ContactCreate) -> models.Contact:
        db_contact = models.Contact(**contact.dict())
        db.add(db_contact)
        db.commit()
        db.refresh(db_contact)
        return db_contact

    @staticmethod
    def update_contact(db: Session, contact_id: uuid.UUID, contact_data: schemas.ContactUpdate) -> Optional[models.Contact]:
        db_contact = ContactService.get_contact(db, contact_id)
        if not db_contact:
            return None
        
        update_data = contact_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_contact, key, value)
            
        db.commit()
        db.refresh(db_contact)
        return db_contact

    @staticmethod
    def delete_contact(db: Session, contact_id: uuid.UUID) -> bool:
        db_contact = ContactService.get_contact(db, contact_id)
        if not db_contact:
            return False
        
        db.delete(db_contact)
        db.commit()
        return True
