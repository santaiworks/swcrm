from sqlalchemy.orm import Session
from .models import Lead
from .schemas import LeadCreate
from app.modules.activities.services import ActivityService
import uuid

class LeadService:
    @staticmethod
    def create_lead(db: Session, lead: LeadCreate):
        db_lead = Lead(**lead.dict())
        db.add(db_lead)
        db.commit()
        db.refresh(db_lead)
        
        # Log Activity
        ActivityService.log_activity(
            db=db,
            action_type="CREATE",
            entity_type="LEAD",
            entity_id=str(db_lead.id),
            description=f"Lead {db_lead.first_name} created.",
            user_id=None # Default system or catch from context if available
        )
        
        return db_lead

    @staticmethod
    def get_leads(db: Session, status: str = None):
        deal_statuses = ["Proposal", "Negotiation", "Closed Won", "Closed Lost"]
        query = db.query(Lead)
        
        if status:
            if status == "Opportunity":
                 # Assuming "Opportunity" is a specific status separate from deals, or if user wants deals included?
                 # Based on master data, "Opportunity" is a status.
                 query = query.filter(Lead.status == status)
            elif status == "Deal": 
                 # If explicit fetch for deals via status param
                 query = query.filter(Lead.status.in_(deal_statuses))
            else:
                 query = query.filter(Lead.status == status)
        else:
            # Default leads usually excludes closed/won unless specified?
            # Or simplified: if no status, return all.
            # But the UI might expect leads != deals.
            # For now, return all or exclude deals?existing code excluded 'Deal'.
            # Let's keep existing behavior: exclude deal statuses if no status provided?
            # The previous implementation was: query = db.query(Lead).filter(Lead.status != 'Deal')
            # Now "Deal" is a set of statuses.
            # Let's just return all for flexibility unless filtered.
            pass

        return query.all()


    @staticmethod
    def get_deals_leads(db: Session):
        deal_statuses = ["Proposal", "Negotiation", "Closed Won", "Closed Lost"]
        return db.query(Lead).filter(Lead.status.in_(deal_statuses)).all()

    @staticmethod
    def get_lead(db: Session, lead_id: uuid.UUID):
        return db.query(Lead).filter(Lead.id == lead_id).first()

    @staticmethod
    def update_lead(db: Session, lead_id: uuid.UUID, lead_data: dict, user_id: int = None):
        db_lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if not db_lead:
            return None
        
        for key, value in lead_data.items():
            setattr(db_lead, key, value)
        
        db.commit()
        db.refresh(db_lead)
        
        # Log Activity
        ActivityService.log_activity(
            db=db,
            action_type="UPDATE",
            entity_type="LEAD",
            entity_id=str(db_lead.id),
            description=f"Lead {db_lead.first_name} details updated.",
            user_id=user_id
        )
        
        return db_lead

    @staticmethod
    def delete_lead(db: Session, lead_id: uuid.UUID, user_id: int = None):
        db_lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if not db_lead:
            return False
        
        db.delete(db_lead)
        db.commit()
        
        # Log Activity
        ActivityService.log_activity(
            db=db,
            action_type="DELETE",
            entity_type="LEAD",
            entity_id=str(lead_id),
            description=f"Lead {db_lead.first_name} deleted.",
            user_id=user_id
        )
        
        return True

    @staticmethod
    def update_lead_status(db: Session, lead_id: uuid.UUID, new_status: str, user_id: int = None):
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if not lead:
            return None
            
        old_status = lead.status
        lead.status = new_status
        db.commit()
        
        # Log Activity
        ActivityService.log_activity(
            db=db,
            action_type="UPDATE",
            entity_type="LEAD",
            entity_id=str(lead.id),
            description=f"Lead status changed from {old_status} to {new_status}.",
            user_id=user_id
        )
        
        return lead

    @staticmethod
    def convert_lead(db: Session, lead_id: uuid.UUID, conversion_data: dict, user_id: int = None):
        # Simplified conversion: just update status to "Proposal" (start of deal)
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if not lead:
            return None
            
        # Update Lead Status to "Proposal"
        lead.status = "Proposal"
        
        # If revenue/probability provided, update them
        if 'estimated_revenue' in conversion_data:
            lead.estimated_revenue = conversion_data['estimated_revenue']
        
        db.commit()
        
        # Log Activity
        ActivityService.log_activity(
            db=db,
            action_type="CONVERT",
            entity_type="LEAD",
            entity_id=str(lead.id),
            description="Lead converted to Deal (Proposal).",
            user_id=user_id
        )
        
        return lead
