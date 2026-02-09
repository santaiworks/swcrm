import os
import sys

# Add current directory to sys.path to import app modules
sys.path.append(os.getcwd())

from app.core.database import SessionLocal
from app.modules.master_data.models import MasterLeadStatus

db = SessionLocal()

try:
    print("Master Lead Statuses:")
    results = db.query(MasterLeadStatus).all()
    for s in results:
        print(f"- {s.name} (color: {s.color})")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
