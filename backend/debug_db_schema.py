from sqlalchemy import create_engine, text
from app.core.config import settings

# Adjust connection string if needed. Assuming settings.DATABASE_URL works or I construct it.
# If settings not available easily, I'll try standard local url
# DATABASE_URL = "postgresql://user:password@localhost/dbname" 
# Be careful with env vars.

import os
import sys

# Add backend to sys path to import settings
sys.path.append(os.getcwd())


def inspect_constraints():
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        print("Querying Foreign Keys for 'attachments' table...")
        query = text("""
            SELECT
                tc.table_schema, 
                tc.constraint_name, 
                tc.table_name, 
                kcu.column_name, 
                ccu.table_schema AS foreign_table_schema,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name 
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                  AND tc.table_schema = kcu.table_schema
                JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
                  AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='attachments';
        """)
        
        result = conn.execute(query)
        rows = result.fetchall()
        
        if not rows:
            print("No foreign keys found for 'attachments'.")
        else:
            for row in rows:
                print(f"Constraint: {row.constraint_name}")
                print(f"  Column: {row.column_name}")
                print(f"  References: {row.foreign_table_name}.{row.foreign_column_name}")
                print("-" * 20)

if __name__ == "__main__":
    inspect_constraints()
