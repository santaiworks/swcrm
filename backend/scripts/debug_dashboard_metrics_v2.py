from app.core.database import SessionLocal
from app.modules.leads.models import Lead
from app.modules.master_data.models import MasterLeadStatus

def debug_metrics():
    db = SessionLocal()
    try:
        leads = db.query(Lead).all()
        statuses = db.query(MasterLeadStatus).all()
        
        status_map = {s.name: s.id for s in statuses}
        qualified_names = ['Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']
        qualified_ids = [status_map[name] for name in qualified_names if name in status_map]
        
        print(f"Qualified IDs: {qualified_ids}")
        
        for i, lead in enumerate(leads[:20]): # Check first 20
            print(f"Lead {lead.id} Status: {lead.status} (Type: {type(lead.status)})")
            
            is_converted = False
            if isinstance(lead.status, int) and lead.status in qualified_ids:
                is_converted = True
            elif str(lead.status) in [str(i) for i in qualified_ids]: # Check string match
                print(f"  -> Match via string!")
            
            if is_converted:
                print("  -> CONVERTED MATCH")

    finally:
        db.close()

if __name__ == "__main__":
    debug_metrics()
