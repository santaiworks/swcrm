import sys
import os

# Adjust path to find app module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, inspect
from app.core.config import settings

def verify():
    engine = create_engine(settings.DATABASE_URL)
    inspector = inspect(engine)
    
    print("Verifying schema...")
    
    contacts_cols = [c['name'] for c in inspector.get_columns('contacts')]
    if 'organization_id' in contacts_cols:
        print("organization_id exists in contacts")
    else:
        print("organization_id MISSING in contacts")

    deals_cols = [c['name'] for c in inspector.get_columns('deals')]
    if 'organization_id' in deals_cols:
        print("organization_id exists in deals")
    else:
        print("organization_id MISSING in deals")

if __name__ == "__main__":
    verify()
