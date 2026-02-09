import os
import sys
from sqlalchemy.orm import Session

# Add current directory to sys.path to import app modules
sys.path.append(os.getcwd())

from app.core.database import SessionLocal
from app.modules.leads.models import Lead
from app.modules.deals.models import Deal
from app.modules.master_data.models import MasterLeadStatus

db: Session = SessionLocal()

print("--- Database Diagnostics ---")

# Leads per status
print("\nLeads per status:")
statuses = db.query(MasterLeadStatus).all()
for status in statuses:
    count = db.query(Lead).filter(Lead.status == status.name).count()
    print(f"- {status.name}: {count}")

# Deals
deal_count = db.query(Deal).count()
print(f"\nTotal Deals: {deal_count}")

# Check Leads with status 'Deal' (converted)
converted_leads = db.query(Lead).filter(Lead.status == 'Deal').count()
print(f"Leads with status 'Deal': {converted_leads}")

db.close()
