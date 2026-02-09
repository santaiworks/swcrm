from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from . import schemas, services
import uuid

router = APIRouter()

@router.get("/fix/schema")
def fix_schema(db: Session = Depends(get_db)):
    from sqlalchemy import inspect, text
    try:
        inspector = inspect(db.get_bind())
        fks = inspector.get_foreign_keys("attachments")
        
        results = []
        for fk in fks:
            name = fk['name']
            results.append(name)
            # Try to drop it
            db.execute(text(f'ALTER TABLE "attachments" DROP CONSTRAINT IF EXISTS "{name}"'))
            db.commit()
            
        return {"fks": results, "dropped": True}
    except Exception as e:
        import traceback
        return {"error": str(e), "trace": traceback.format_exc()}

@router.post("/upload", response_model=schemas.AttachmentResponse)
def upload_attachment(
    entity_type: str = Form(...),
    entity_id: uuid.UUID = Form(...),
    is_public: bool = Form(False),
    description: str | None = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # In a real app, get user from token
    uploaded_by = "System" 
    try:
        return services.AttachmentService.upload_file(
            db, file, entity_type, entity_id, is_public, uploaded_by, description=description
        )
    except Exception as e:
        print(f"Error uploading file: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{entity_type}/{entity_id}", response_model=List[schemas.AttachmentResponse])
def get_attachments(
    entity_type: str,
    entity_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    return services.AttachmentService.get_attachments(db, entity_type, entity_id)

@router.delete("/{id}")
def delete_attachment(
    id: uuid.UUID,
    db: Session = Depends(get_db)
):
    success = services.AttachmentService.delete_attachment(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Attachment not found")
    return {"status": "success"}


