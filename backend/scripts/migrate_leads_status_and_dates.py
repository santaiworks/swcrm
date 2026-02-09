from app.core.database import SessionLocal
from app.modules.leads.models import Lead
from app.modules.master_data.models import MasterLeadStatus
from datetime import timedelta
import random

def migrate():
    db = SessionLocal()
    try:
        # Get Status Mapping
        statuses = {s.name: s.id for s in db.query(MasterLeadStatus).all()}
        print(f"Status Mapping: {statuses}")

        leads = db.query(Lead).all()
        print(f"Found {len(leads)} leads")

        for lead in leads:
            # 1. Migrate Status to ID
            current_status = lead.status
            # If it's a string and in our map, update it
            if isinstance(current_status, str) and current_status in statuses:
                lead.status = statuses[current_status]
                print(f"Updated lead {lead.id} status: {current_status} -> {lead.status}")
            
            # 2. Fix Dates for Converted Leads
            # Statuses that imply conversion/progress: Qualified, Proposal, Negotiation, Closed Won, Closed Lost
            converted_ids = [statuses[s] for s in ['Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'] if s in statuses]
            
            # Check if status is one of them (lead.status might be int now)
            try:
                status_id = int(lead.status)
            except:
                status_id = -1

            if status_id in converted_ids:
                # If created_at == updated_at, shift created_at back
                if lead.created_at and lead.updated_at and lead.created_at == lead.updated_at:
                    days_back = random.randint(1, 30)
                    lead.created_at = lead.updated_at - timedelta(days=days_back)
                    print(f"  -> Shifted created_at back by {days_back} days")

        db.commit()
        print("Migration completed successfully.")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    migrate()
