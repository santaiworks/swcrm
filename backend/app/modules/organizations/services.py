from sqlalchemy.orm import Session
from .models import Organization
from . import schemas
import uuid
from typing import Optional

class OrganizationService:
    @staticmethod
    def create_organization(db: Session, org: schemas.OrganizationCreate):
        db_org = Organization(**org.dict())
        db.add(db_org)
        db.commit()
        db.refresh(db_org)
        return db_org

    @staticmethod
    def get_organization_by_name(db: Session, name: str):
        return db.query(Organization).filter(Organization.name == name).first()
    
    @staticmethod
    def get_organizations(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Organization).offset(skip).limit(limit).all()

    @staticmethod
    def get_organization(db: Session, org_id: uuid.UUID):
        return db.query(Organization).filter(Organization.id == org_id).first()

    @staticmethod
    def update_organization(db: Session, org_id: uuid.UUID, org_data: schemas.OrganizationUpdate) -> Optional[Organization]:
        db_org = OrganizationService.get_organization(db, org_id)
        if not db_org:
            return None
        
        update_data = org_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_org, key, value)
            
        db.commit()
        db.refresh(db_org)
        return db_org

    @staticmethod
    def delete_organization(db: Session, org_id: uuid.UUID) -> bool:
        db_org = OrganizationService.get_organization(db, org_id)
        if not db_org:
            return False
        
        db.delete(db_org)
        db.commit()
        return True
