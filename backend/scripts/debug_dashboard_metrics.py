from app.core.database import SessionLocal
from app.modules.leads.models import Lead
from app.modules.master_data.models import MasterLeadStatus
from datetime import datetime

def debug_metrics():
    db = SessionLocal()
    try:
        leads = db.query(Lead).all()
        statuses = db.query(MasterLeadStatus).all()
        
        status_map = {s.name: s.id for s in statuses}
        print(f"Status Map: {status_map}")
        
        deal_status_names = ['Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']
        qualified_names = ['Qualified'] + deal_status_names
        
        qualified_ids = [status_map[name] for name in qualified_names if name in status_map]
        print(f"Qualified IDs: {qualified_ids}")
        
        converted_leads = []
        total_time = 0
        count = 0
        
        print("\nChecking Leads:")
        for lead in leads:
            is_converted = False
            # Check ID
            if isinstance(lead.status, int):
                if lead.status in qualified_ids:
                    is_converted = True
            # Check Name (legacy)
            elif isinstance(lead.status, str):
                if lead.status in qualified_names:
                    is_converted = True
            
            if is_converted:
                if lead.created_at and lead.updated_at:
                    start = lead.created_at.timestamp() * 1000
                    end = lead.updated_at.timestamp() * 1000
                    
                    diff = end - start
                    if diff >= 0:
                        total_time += diff
                        count += 1
                        converted_leads.append({
                            'id': str(lead.id),
                            'status': lead.status,
                            'created': lead.created_at,
                            'updated': lead.updated_at,
                            'diff_days': diff / (1000 * 60 * 60 * 24)
                        })
        
        print(f"\nFound {len(converted_leads)} converted leads.")
        for l in converted_leads[:5]: # Show first 5
            print(f" - ID: {l['id']}, Status: {l['status']}, Days: {l['diff_days']:.2f}")
            
        if count > 0:
            avg_ms = total_time / count
            avg_days = avg_ms / (1000 * 60 * 60 * 24)
            print(f"\nAvg Lead Close Time: {avg_days:.2f} days")
        else:
            print("\nAvg Lead Close Time: N/A (Count is 0)")

    finally:
        db.close()

if __name__ == "__main__":
    debug_metrics()
