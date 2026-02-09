from sqlalchemy.orm import Session
from .models import Call
from .schemas import CallCreate, CallUpdate
import uuid

class CallService:
    @staticmethod
    def create_call(db: Session, call: CallCreate):
        data = call.dict()
        if not data.get("subject"):
            parts = []
            if data.get("call_type"):
                parts.append(data["call_type"])
            if data.get("to_contact"):
                parts.append(f"to {data['to_contact']}")
            if data.get("from_contact"):
                parts.append(f"from {data['from_contact']}")
            data["subject"] = " ".join(parts) or "Call"
        db_call = Call(**data)
        db.add(db_call)
        db.commit()
        db.refresh(db_call)
        return db_call

    @staticmethod
    def get_calls(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Call).offset(skip).limit(limit).all()

    @staticmethod
    def get_call(db: Session, call_id: uuid.UUID):
        return db.query(Call).filter(Call.id == call_id).first()

    @staticmethod
    def get_calls_by_entity(db: Session, entity_type: str, entity_id: uuid.UUID):
        return db.query(Call).filter(
            Call.entity_type == entity_type,
            Call.entity_id == entity_id
        ).all()

    @staticmethod
    def update_call(db: Session, call_id: uuid.UUID, call_update: CallUpdate):
        db_call = db.query(Call).filter(Call.id == call_id).first()
        if not db_call:
            return None
        
        update_data = call_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_call, key, value)
            
        db.commit()
        db.refresh(db_call)
        return db_call

    @staticmethod
    def delete_call(db: Session, call_id: uuid.UUID):
        db_call = db.query(Call).filter(Call.id == call_id).first()
        if not db_call:
            return None
            
        db.delete(db_call)
        db.commit()
        return db_call
