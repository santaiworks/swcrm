import sys
import os

# Adjust path to find app module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from app.core.config import settings

def migrate():
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as conn:
        conn.execution_options(isolation_level="AUTOCOMMIT")
        
        print("Starting manual migration...")
        
        # Add organization_id to contacts
        try:
            conn.execute(text("ALTER TABLE contacts ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);"))
            print("Added organization_id to contacts.")
        except Exception as e:
            print(f"Error adding column to contacts: {e}")

        # Add organization_id to deals
        try:
            conn.execute(text("ALTER TABLE deals ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);"))
            print("Added organization_id to deals.")
        except Exception as e:
            print(f"Error adding column to deals: {e}")
            
    print("Migration completed.")

if __name__ == "__main__":
    migrate()
