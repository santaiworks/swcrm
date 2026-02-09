import sys
import os
from sqlalchemy import text

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

from app.core import database  # noqa: E402

def migrate_data_calls():
    with database.engine.connect() as connection:
        try:
            # Check existences
            check_old = text("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'call_logs');")
            check_new = text("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'calls');")
            
            old_exists = connection.execute(check_old).scalar()
            new_exists = connection.execute(check_new).scalar()
            
            if old_exists and new_exists:
                print("Moving data from call_logs to calls...")
                trans = connection.begin()
                try:
                    # Move data
                    # Assuming columns align roughly, but id might be issue if unique constraints/PKs.
                    # Explicit column listing safer.
                    # cols: id, subject, notes, duration, status, entity_type, entity_id, created_at, updated_at
                    copy_sql = text("""
                        INSERT INTO calls (id, subject, notes, duration, status, entity_type, entity_id, created_at, updated_at)
                        SELECT id, subject, notes, duration, status, entity_type, entity_id, created_at, updated_at
                        FROM call_logs
                        ON CONFLICT (id) DO NOTHING;
                    """)
                    connection.execute(copy_sql)
                    
                    # Drop old table
                    drop_sql = text("DROP TABLE call_logs;")
                    connection.execute(drop_sql)
                    
                    trans.commit()
                    print("Data migration successful. call_logs dropped.")
                except Exception as e:
                    trans.rollback()
                    print(f"Error migrating data: {e}")
            elif old_exists and not new_exists:
                # Rename
                trans = connection.begin()
                try:
                    rename_sql = text("ALTER TABLE call_logs RENAME TO calls;")
                    connection.execute(rename_sql)
                    trans.commit()
                    print("Renamed call_logs to calls.")
                except Exception as e:
                    trans.rollback()
                    print(f"Error renaming: {e}")
            else:
                print("No migration needed.")

        except Exception as e:
            print(f"Error checking migration: {e}")

if __name__ == "__main__":
    migrate_data_calls()
