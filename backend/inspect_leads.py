import os
import sys

# Add current directory to sys.path to import app modules
sys.path.append(os.getcwd())

from app.core.database import SessionLocal  # noqa: E402
from app.modules.leads.models import Lead  # noqa: E402

db = SessionLocal()

try:
    print("Inspecting 5 Leads:")
    results = db.query(Lead).limit(5).all()
    for lead in results:
        print(f"- ID: {lead.id}, Name: {lead.first_name}, Status: '{lead.status}'")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
