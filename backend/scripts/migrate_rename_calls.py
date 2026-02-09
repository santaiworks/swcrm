import sys
import os
from sqlalchemy import text

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

from app.core import database  # noqa: E402

def migrate_rename_calls():
    # Use engine connect for DDL
    with database.engine.connect() as connection:
        try:
            # Check if call_logs exists
            check_sql = text("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'call_logs');")
            exists = connection.execute(check_sql).scalar()
            
            if exists:
                # Check if calls exists to avoid collision
                check_calls_sql = text("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'calls');")
                calls_exists = connection.execute(check_calls_sql).scalar()
                
                if calls_exists:
                    print("Both 'call_logs' and 'calls' tables exist. Please resolve manually or drop one.")
                else:
                    print("Renaming table call_logs to calls...")
                    # Transaction needed? PostgreSQL DDL is transactional.
                    trans = connection.begin()
                    try:
                        rename_sql = text("ALTER TABLE call_logs RENAME TO calls;")
                        connection.execute(rename_sql)
                        trans.commit()
                        print("Table renamed successfully.")
                    except Exception as e:
                        trans.rollback()
                        raise e
            else:
                print("Table call_logs does not exist. Skipping rename.")
                
        except Exception as e:
            print(f"Error migrating: {e}")

if __name__ == "__main__":
    migrate_rename_calls()
