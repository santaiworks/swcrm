import os
import sys
from sqlalchemy import func

# Add current directory to sys.path to import app modules
sys.path.append(os.getcwd())

from app.core.database import SessionLocal
from app.modules.leads.models import Lead

db = SessionLocal()

print("--- Dashboard Data Verification ---")

# 1. Total Leads (excluding deals)
deal_statuses = ['Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']
total_leads = db.query(Lead).filter(Lead.status.notin_(deal_statuses)).count()
print(f"Total Leads: {total_leads}")

# 2. Ongoing Deals
ongoing_deals = db.query(Lead).filter(Lead.status.in_(['Proposal', 'Negotiation'])).count()
print(f"Ongoing Deals: {ongoing_deals}")

# 3. Won Deals
won_deals = db.query(Lead).filter(Lead.status == 'Closed Won').count()
print(f"Won Deals: {won_deals}")

# 4. Avg Deal Value
total_won_value = db.query(func.sum(Lead.estimated_revenue)).filter(Lead.status == 'Closed Won').scalar() or 0
avg_deal_value = total_won_value / won_deals if won_deals > 0 else 0
print(f"Total Won Value: {total_won_value}")
print(f"Avg Deal Value: {avg_deal_value}")

if won_deals == 0:
    print("WARNING: No Won deals found, dashboard will show 0.")
else:
    print("SUCCESS: Won deals data exists.")

db.close()
