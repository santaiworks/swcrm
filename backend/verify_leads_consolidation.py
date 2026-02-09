import os
import sys
from sqlalchemy import func, inspect

# Add current directory to sys.path to import app modules
sys.path.append(os.getcwd())

from app.core.database import SessionLocal, engine
from app.modules.leads.models import Lead

db = SessionLocal()

print("--- Data Verification ---")

# Check if deals table exists (should be False)
inspector = inspect(engine)
tables = inspector.get_table_names()
print(f"Tables in database: {tables}")
if 'deals' in tables:
    print("ERROR: 'deals' table still exists!")
else:
    print("SUCCESS: 'deals' table removed.")

# Check Lead statuses
print("\nLeads per status:")
try:
    results = db.query(Lead.status, func.count(Lead.id)).group_by(Lead.status).all()
    for status, count in results:
        print(f"- '{status}': {count}")
except Exception as e:
    print(f"Error checking status: {e}")

# Check Deal fields in Leads
print("\nChecking Deal Fields in Leads (estimated_revenue, closing_date):")
deal_statuses = ["Proposal", "Negotiation", "Closed Won", "Closed Lost"]
deals_count = db.query(Lead).filter(Lead.status.in_(deal_statuses)).count()
print(f"Total Leads with Deal Statuses: {deals_count}")

deals_with_revenue = db.query(Lead).filter(Lead.status.in_(deal_statuses), Lead.estimated_revenue.isnot(None)).count()
print(f"Leads with estimated_revenue: {deals_with_revenue}")

deals_with_closing_date = db.query(Lead).filter(Lead.status.in_(deal_statuses), Lead.closing_date.isnot(None)).count()
print(f"Leads with closing_date: {deals_with_closing_date}")

db.close()
