from sqlalchemy.orm import Session
from .models import Note
from . import schemas
import uuid
from typing import Optional

class NoteService:
    @staticmethod
    def create_note(db: Session, note: schemas.NoteCreate):
        db_note = Note(**note.dict())
        db.add(db_note)
        db.commit()
        db.refresh(db_note)
        return db_note

    @staticmethod
    def get_notes(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Note).offset(skip).limit(limit).all()

    @staticmethod
    def get_notes_by_entity(db: Session, entity_type: str, entity_id: uuid.UUID):
        return db.query(Note).filter(
            Note.entity_type == entity_type,
            Note.entity_id == entity_id
        ).all()

    @staticmethod
    def get_note(db: Session, note_id: uuid.UUID):
        return db.query(Note).filter(Note.id == note_id).first()

    @staticmethod
    def update_note(db: Session, note_id: uuid.UUID, note_data: schemas.NoteUpdate) -> Optional[Note]:
        db_note = NoteService.get_note(db, note_id)
        if not db_note:
            return None
        
        update_data = note_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_note, key, value)
            
        db.commit()
        db.refresh(db_note)
        return db_note

    @staticmethod
    def delete_note(db: Session, note_id: uuid.UUID) -> bool:
        db_note = NoteService.get_note(db, note_id)
        if not db_note:
            return False
        
        db.delete(db_note)
        db.commit()
        return True
