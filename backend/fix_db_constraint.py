from sqlalchemy import create_engine, text
from app.core.config import settings
import sys
import os

sys.path.append(os.getcwd())

def fix_constraint():
    print(f"Connecting to: {settings.DATABASE_URL}")
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        print("Listing ALL constraints on 'attachments' table via pg_constraint:")
        result = conn.execute(text("""
            SELECT conname
            FROM pg_constraint
            JOIN pg_class ON pg_constraint.conrelid = pg_class.oid
            WHERE pg_class.relname = 'attachments';
        """))
        constraints = [row[0] for row in result.fetchall()]
        print(f"Found constraints: {constraints}")

        for constraint in constraints:
            if 'entity_id' in constraint or 'userid' in constraint: # drop suspicious ones
                print(f"Dropping constraint: {constraint}")
                try:
                    conn.execute(text(f"ALTER TABLE attachments DROP CONSTRAINT IF EXISTS \"{constraint}\";"))
                    conn.commit()
                    print("Dropped.")
                except Exception as e:
                    print(f"Error dropping {constraint}: {e}")

if __name__ == "__main__":
    fix_constraint()
