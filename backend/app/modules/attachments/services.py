from sqlalchemy.orm import Session
from .models import Attachment
import uuid
import os
import shutil
from fastapi import UploadFile

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

class AttachmentService:
    @staticmethod
    def upload_file(db: Session, file: UploadFile, entity_type: str, entity_id: uuid.UUID, is_public: bool = False, uploaded_by: str = None, description: str | None = None):
        # Generate unique filename
        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        disk_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file
        with open(disk_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Save to DB
        db_attachment = Attachment(
            file_path=f"{UPLOAD_DIR}/{unique_filename}",
            file_name=file.filename,
            file_type=file.content_type,
            is_public=is_public,
            entity_type=entity_type,
            entity_id=entity_id,
            uploaded_by=uploaded_by,
            description=description
        )
        db.add(db_attachment)
        db.commit()
        db.refresh(db_attachment)
        
        return db_attachment

    @staticmethod
    def get_attachments(db: Session, entity_type: str, entity_id: uuid.UUID):
        return db.query(Attachment).filter(
            Attachment.entity_type == entity_type,
            Attachment.entity_id == entity_id
        ).all()

    @staticmethod
    def delete_attachment(db: Session, attachment_id: uuid.UUID):
        attachment = db.query(Attachment).filter(Attachment.id == attachment_id).first()
        if not attachment:
            return False
        
        # Delete file
        if os.path.exists(attachment.file_path):
            os.remove(attachment.file_path)
            
        db.delete(attachment)
        db.commit()
        return True
