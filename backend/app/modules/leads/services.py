from sqlalchemy.orm import Session
from .models import Lead
from .schemas import LeadCreate
from app.modules.activities.services import ActivityService
from app.modules.master_data.models import MasterLeadStatus
import uuid

class LeadService:
    @staticmethod
    def create_lead(db: Session, lead: LeadCreate):
        # Ensure default status 'New' is mapped to ID if not provided or string
        if isinstance(lead.status, str):
             status_obj = db.query(MasterLeadStatus).filter(MasterLeadStatus.name == lead.status).first()
             if status_obj:
                 lead.status = status_obj.id
        
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
        deal_status_names = ["Proposal", "Negotiation", "Closed Won", "Closed Lost"]
        
        query = db.query(Lead)
        
        if status:
            if status == "Opportunity":
                 # Opportunity logic if needed
                 pass
            elif status == "Deal": 
                 # Fetch IDs for deal statuses
                 status_ids = db.query(MasterLeadStatus.id).filter(MasterLeadStatus.name.in_(deal_status_names)).all()
                 status_ids = [s[0] for s in status_ids]
                 query = query.filter(Lead.status.in_(status_ids))
            else:
                 # Check if status is ID or Name
                 if status.isdigit():
                     query = query.filter(Lead.status == int(status))
                 else:
                     # Try to find ID for name
                     status_obj = db.query(MasterLeadStatus).filter(MasterLeadStatus.name == status).first()
                     if status_obj:
                         query = query.filter(Lead.status == status_obj.id)
        else:
            pass

        return query.all()


    @staticmethod
    def get_deals_leads(db: Session):
        deal_status_names = ["Proposal", "Negotiation", "Closed Won", "Closed Lost"]
        status_ids = db.query(MasterLeadStatus.id).filter(MasterLeadStatus.name.in_(deal_status_names)).all()
        status_ids = [s[0] for s in status_ids]
        return db.query(Lead).filter(Lead.status.in_(status_ids)).all()

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
        # new_status might be ID or Name. Assume ID if possible or resolve.
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if not lead:
            return None
            
        old_status = lead.status
        
        # Resolve new_status to ID if it's a string name
        # If new_status comes from frontend combobox, it might be int or str representation of int
        final_status_id = None
        if isinstance(new_status, int) or (isinstance(new_status, str) and new_status.isdigit()):
             final_status_id = int(new_status)
        else:
             status_obj = db.query(MasterLeadStatus).filter(MasterLeadStatus.name == new_status).first()
             if status_obj:
                 final_status_id = status_obj.id
        
        if final_status_id is not None:
            lead.status = final_status_id
            db.commit()
            
            # Log Activity
            ActivityService.log_activity(
                db=db,
                action_type="UPDATE",
                entity_type="LEAD",
                entity_id=str(lead.id),
                description=f"Lead status changed from {old_status} to {lead.status}.",
                user_id=user_id
            )
            
            return lead
        return None

    @staticmethod
    def convert_lead(db: Session, lead_id: uuid.UUID, conversion_data: dict, user_id: int = None):
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        if not lead:
            return None
            
        # Update Lead Status to "Proposal" (Get ID)
        proposal_status = db.query(MasterLeadStatus).filter(MasterLeadStatus.name == "Proposal").first()
        if proposal_status:
            lead.status = proposal_status.id
        
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
