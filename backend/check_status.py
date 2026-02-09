import os
import sys
from sqlalchemy import func

# Add current directory to sys.path to import app modules
sys.path.append(os.getcwd())

from app.core.database import SessionLocal
from app.modules.leads.models import Lead

db = SessionLocal()

try:
    print("Distinct Lead Statuses:")
    # Using session.query or select(Lead)
    results = db.query(Lead.status, func.count(Lead.id)).group_by(Lead.status).all()
    for status, count in results:
        print(f"- '{status}': {count}")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
